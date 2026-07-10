import fs from "fs";
import path from "path";

// Combine the three exported collections into a single anonymized dataset for
// analytics. Personal fields (name, email) are dropped; every other field is
// kept, plus a `source` tag identifying the origin collection.

const dir = path.join(__dirname, "exported");
const sources: { file: string; source: string }[] = [
  { file: "losmutantes.reservation.json", source: "reservation" },
  { file: "losmutantes.caja.json", source: "caja" },
  { file: "losmutantes.taquilla.json", source: "taquilla" },
];

const combined = sources.flatMap(({ file, source }) => {
  const rows = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as Record<string, unknown>[];
  return rows.map((row) => {
    const { name, email, _id, ...rest } = row;
    void name;
    void email;
    void _id;
    return { source, ...rest };
  });
});

const outPath = path.join(dir, "combined.json");
fs.writeFileSync(outPath, JSON.stringify(combined, null, 2));

console.log(`Combined ${combined.length} records → ${outPath}`);
for (const { source } of sources) {
  console.log(`  ${source}: ${combined.filter((r) => r.source === source).length}`);
}
