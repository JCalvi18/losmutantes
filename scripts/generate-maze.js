#!/usr/bin/env node
/**
 * Maze image generator
 *
 * Outputs an SVG with a solvable maze — entry at top-left, exit at bottom-right.
 *
 * Usage:
 *   node scripts/generate-maze.js [options]
 *
 * Options:
 *   --width  <px>   Image width in pixels  (default: 800)
 *   --height <px>   Image height in pixels (default: 600)
 *   --cell   <px>   Cell size in pixels    (default: 30)
 *   --line   <px>   Wall stroke width      (default: 2)
 *   --bg     <hex>  Background colour      (default: #1a1a1a)
 *   --fg     <hex>  Wall colour            (default: #e8631a)
 *   --out    <path> Output file path       (default: maze.svg)
 *   --seed   <int>  RNG seed for reproducible mazes (default: random)
 *   --solve         Also draw the solution path
 *
 * Examples:
 *   node scripts/generate-maze.js --width 1920 --height 1080 --out maze-hd.svg
 *   node scripts/generate-maze.js --width 400 --height 400 --cell 20 --solve
 *   node scripts/generate-maze.js --seed 42 --out maze-42.svg
 */

"use strict";

const fs = require("fs");
const path = require("path");

// ── Argument parsing ──────────────────────────────────────────────────────────

function parseArgs(argv) {
    const args = {
        width: 800, height: 600, cell: 30, line: 2,
        bg: "#1a1a1a", fg: "#e8631a", out: "maze.svg", seed: null, solve: false
    };
    for (let i = 2; i < argv.length; i++) {
        switch (argv[i]) {
            case "--width": args.width = parseInt(argv[++i], 10); break;
            case "--height": args.height = parseInt(argv[++i], 10); break;
            case "--cell": args.cell = parseInt(argv[++i], 10); break;
            case "--line": args.line = parseFloat(argv[++i]); break;
            case "--bg": args.bg = argv[++i]; break;
            case "--fg": args.fg = argv[++i]; break;
            case "--out": args.out = argv[++i]; break;
            case "--seed": args.seed = parseInt(argv[++i], 10); break;
            case "--solve": args.solve = true; break;
            default:
                console.error(`Unknown option: ${argv[i]}`);
                process.exit(1);
        }
    }
    return args;
}

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────────────

function makePRNG(seed) {
    let s = seed >>> 0; // force uint32
    return function () {
        s += 0x6d2b79f5;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
    };
}

// ── Maze generation (recursive back-tracker) ─────────────────────────────────

// Direction indices: 0=top, 1=right, 2=bottom, 3=left
const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const OPPOSITE = [2, 3, 0, 1];

function generateMaze(cols, rows, rand) {
    const grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ walls: [true, true, true, true] }))
    );
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

    const stack = [[0, 0]];
    visited[0][0] = true;

    while (stack.length) {
        const [c, r] = stack[stack.length - 1];
        const shuffled = [0, 1, 2, 3].sort(() => rand() - 0.5);
        let moved = false;

        for (const d of shuffled) {
            const nc = c + DIRS[d][0];
            const nr = r + DIRS[d][1];
            if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && !visited[nr][nc]) {
                grid[r][c].walls[d] = false;
                grid[nr][nc].walls[OPPOSITE[d]] = false;
                visited[nr][nc] = true;
                stack.push([nc, nr]);
                moved = true;
                break;
            }
        }

        if (!moved) stack.pop();
    }

    // Open entry (top wall of [0,0]) and exit (bottom wall of [cols-1, rows-1])
    grid[0][0].walls[0] = false; // entry
    grid[rows - 1][cols - 1].walls[2] = false; // exit

    return grid;
}

// ── BFS solver ────────────────────────────────────────────────────────────────

function solveMaze(maze, cols, rows) {
    const from = Array.from({ length: rows }, () => new Array(cols).fill(null));
    const queue = [[0, 0]];
    from[0][0] = "start";

    while (queue.length) {
        const [c, r] = queue.shift();
        if (c === cols - 1 && r === rows - 1) break;

        for (let d = 0; d < 4; d++) {
            if (maze[r][c].walls[d]) continue;       // wall blocks
            const nc = c + DIRS[d][0];
            const nr = r + DIRS[d][1];
            if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue; // opening to outside
            if (from[nr][nc] !== null) continue;
            from[nr][nc] = [c, r];
            queue.push([nc, nr]);
        }
    }

    // Trace back
    const path = [];
    let cur = [cols - 1, rows - 1];
    while (from[cur[1]][cur[0]] !== "start") {
        path.push(cur);
        cur = from[cur[1]][cur[0]];
    }
    path.push([0, 0]);
    return path.reverse();
}

// ── SVG builder ───────────────────────────────────────────────────────────────

function buildSVG({ width, height, cell, line, bg, fg, maze, cols, rows, solvePath }) {
    const lines = [];
    const borderLine = line * 2;

    // Header
    lines.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);
    lines.push(`  <rect width="${width}" height="${height}" fill="${bg}"/>`);

    // Interior walls
    const wallLines = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const { walls } = maze[r][c];
            const px = c * cell, py = r * cell;

            if (walls[0]) wallLines.push(`M${px},${py}H${px + cell}`);        // top
            if (walls[1]) wallLines.push(`M${px + cell},${py}V${py + cell}`);   // right
            if (walls[2]) wallLines.push(`M${px},${py + cell}H${px + cell}`);   // bottom
            if (walls[3]) wallLines.push(`M${px},${py}V${py + cell}`);        // left
        }
    }
    lines.push(`  <path d="${wallLines.join(" ")}" stroke="${fg}" stroke-width="${line}" stroke-linecap="square" fill="none"/>`);

    // Outer border — separate path so it can have a thicker stroke
    const borderLines = [];
    // Top border — skip entry opening at col 0 (x=0..cell)
    for (let c = 1; c < cols; c++) {
        borderLines.push(`M${c * cell},0H${(c + 1) * cell}`);
    }
    // Left border
    for (let r = 0; r < rows; r++) {
        borderLines.push(`M0,${r * cell}V${(r + 1) * cell}`);
    }
    // Right border
    for (let r = 0; r < rows; r++) {
        borderLines.push(`M${cols * cell},${r * cell}V${(r + 1) * cell}`);
    }
    // Bottom border — skip exit opening at col cols-1
    for (let c = 0; c < cols - 1; c++) {
        borderLines.push(`M${c * cell},${rows * cell}H${(c + 1) * cell}`);
    }
    lines.push(`  <path d="${borderLines.join(" ")}" stroke="${fg}" stroke-width="${borderLine}" stroke-linecap="square" fill="none"/>`);

    // Entry / exit labels
    const labelSize = Math.max(8, Math.round(cell * 0.4));
    lines.push(`  <text x="${cell / 2}" y="${-labelSize * 0.3}" font-family="monospace" font-size="${labelSize}" fill="${fg}" text-anchor="middle">IN</text>`);
    lines.push(`  <text x="${(cols - 0.5) * cell}" y="${rows * cell + labelSize}" font-family="monospace" font-size="${labelSize}" fill="${fg}" text-anchor="middle">OUT</text>`);

    // Solution path (optional)
    if (solvePath && solvePath.length > 1) {
        const pts = solvePath.map(([c, r]) => `${c * cell + cell / 2},${r * cell + cell / 2}`).join(" ");
        lines.push(`  <polyline points="${pts}" stroke="#4fc3f7" stroke-width="${Math.max(1, line * 0.7)}" stroke-opacity="0.75" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`);
        // Entry stub
        lines.push(`  <line x1="${cell / 2}" y1="0" x2="${cell / 2}" y2="${cell / 2}" stroke="#4fc3f7" stroke-width="${Math.max(1, line * 0.7)}" stroke-opacity="0.75"/>`);
        // Exit stub
        lines.push(`  <line x1="${(cols - 0.5) * cell}" y1="${(rows - 0.5) * cell}" x2="${(cols - 0.5) * cell}" y2="${rows * cell}" stroke="#4fc3f7" stroke-width="${Math.max(1, line * 0.7)}" stroke-opacity="0.75"/>`);
    }

    lines.push(`</svg>`);
    return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

const args = parseArgs(process.argv);

const cols = Math.max(1, Math.floor(args.width / args.cell));
const rows = Math.max(1, Math.floor(args.height / args.cell));

// Snap width/height to exact cell multiples so the maze fills perfectly
const mazeW = cols * args.cell;
const mazeH = rows * args.cell;

const seed = args.seed !== null ? args.seed : Math.floor(Math.random() * 0x100000000);
const rand = makePRNG(seed);

console.log(`Generating ${cols}×${rows} maze (${mazeW}×${mazeH} px) — seed: ${seed}`);

const maze = generateMaze(cols, rows, rand);
const solvePath = args.solve ? solveMaze(maze, cols, rows) : null;

if (args.solve) {
    console.log(`Solution path: ${solvePath.length} cells`);
}

const svg = buildSVG({
    width: mazeW,
    height: mazeH,
    cell: args.cell,
    line: args.line,
    bg: args.bg,
    fg: args.fg,
    maze,
    cols,
    rows,
    solvePath,
});

const outPath = path.resolve(args.out);
fs.writeFileSync(outPath, svg, "utf8");
console.log(`Saved → ${outPath}`);
