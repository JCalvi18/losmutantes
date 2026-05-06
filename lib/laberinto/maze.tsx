"use client";

import { useEffect, useRef } from "react";
import { laberintoColors } from "./laberinto-theme";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const CONFIG = {
    cellSize: 30,                          // px per cell
    bgColor: laberintoColors.background,
    lineColor: laberintoColors.orange,
    lineWidth: 4.0,
    duration: 2000,                        // ms for all walls to grow from 0 to full length
    nodeRadius: 2.0,                         // px radius of the intersection dots
};
// ───────────────────────────────────────────────────────────────────────────

const OPPOSITE = [2, 3, 0, 1] as const;
const DIRS = [
    [0, -1], // 0 top
    [1, 0], // 1 right
    [0, 1], // 2 bottom
    [-1, 0], // 3 left
] as const;

interface Cell {
    walls: [boolean, boolean, boolean, boolean];
}

interface Segment {
    x1: number; y1: number;
    x2: number; y2: number;
}

function generateMaze(cols: number, rows: number): Cell[][] {
    const grid: Cell[][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            walls: [true, true, true, true] as [boolean, boolean, boolean, boolean],
        }))
    );
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

    const stack: [number, number][] = [[0, 0]];
    visited[0][0] = true;

    while (stack.length > 0) {
        const [c, r] = stack[stack.length - 1];
        const shuffled = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
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

    return grid;
}

// BFS reveal order — spreads outward from top-left
function bfsOrder(cols: number, rows: number): [number, number][] {
    const order: [number, number][] = [];
    const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const queue: [number, number][] = [[0, 0]];
    seen[0][0] = true;

    while (queue.length) {
        const [c, r] = queue.shift()!;
        order.push([c, r]);
        for (const [dc, dr] of DIRS) {
            const nc = c + dc;
            const nr = r + dr;
            if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && !seen[nr][nc]) {
                seen[nr][nc] = true;
                queue.push([nc, nr]);
            }
        }
    }

    return order;
}

function buildSegments(order: [number, number][], maze: Cell[][], cs: number): Segment[] {
    const segments: Segment[] = [];
    for (const [c, r] of order) {
        const { walls } = maze[r][c];
        const px = c * cs, py = r * cs;
        if (walls[0]) segments.push({ x1: px, y1: py, x2: px + cs, y2: py }); // top
        if (walls[1]) segments.push({ x1: px + cs, y1: py, x2: px + cs, y2: py + cs }); // right
        if (walls[2]) segments.push({ x1: px, y1: py + cs, x2: px + cs, y2: py + cs }); // bottom
        if (walls[3]) segments.push({ x1: px, y1: py, x2: px, y2: py + cs }); // left
    }
    return segments;
}

export default function MazeBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;

        const init = () => {
            const W = window.innerWidth;
            const H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;

            const cs = CONFIG.cellSize;
            const cols = Math.ceil(W / cs);
            const rows = Math.ceil(H / cs);

            const maze = generateMaze(cols, rows);
            const order = bfsOrder(cols, rows);
            const segments = buildSegments(order, maze, cs);
            const totalSegments = segments.length;

            const { duration, nodeRadius } = CONFIG;

            // Pre-draw nodes onto an offscreen canvas so we can stamp them cheaply every frame
            const offscreen = document.createElement("canvas");
            offscreen.width = W;
            offscreen.height = H;
            const offCtx = offscreen.getContext("2d")!;
            offCtx.fillStyle = CONFIG.lineColor;
            for (let r = 0; r <= rows; r++) {
                for (let c = 0; c <= cols; c++) {
                    offCtx.beginPath();
                    offCtx.arc(c * cs, r * cs, nodeRadius, 0, Math.PI * 2);
                    offCtx.fill();
                }
            }

            let startTime: number | null = null;

            const render = (now: number) => {
                if (startTime === null) startTime = now;
                const elapsed = now - startTime;
                const frac = Math.min(1, elapsed / duration);

                // 1. Background
                ctx.fillStyle = CONFIG.bgColor;
                ctx.fillRect(0, 0, W, H);

                // 2. Nodes — visible immediately, stamped in one drawImage call
                ctx.drawImage(offscreen, 0, 0);

                // 3. All segments grow simultaneously at the same rate
                ctx.strokeStyle = CONFIG.lineColor;
                ctx.lineWidth = CONFIG.lineWidth;
                ctx.beginPath();
                for (let i = 0; i < totalSegments; i++) {
                    const { x1, y1, x2, y2 } = segments[i];
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x1 + (x2 - x1) * frac, y1 + (y2 - y1) * frac);
                }
                ctx.stroke();

                if (frac < 1) {
                    animId = requestAnimationFrame(render);
                }
            };

            animId = requestAnimationFrame(render);
        };

        init();

        const onResize = () => {
            cancelAnimationFrame(animId);
            init();
        };

        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            aria-hidden="true"
        />
    );
}