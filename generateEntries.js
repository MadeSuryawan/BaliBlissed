// generateEntries.mjs  (or .js if "type":"module" is set)
import path from "node:path";
import { globSync } from "glob"; // modern ESM version of the glob package

/**
 * Recursively collects every .html file under `baseDir`
 * and returns an object suitable for Rollup’s `input`.
 * Keys are the relative path (without extension) and
 * values are the absolute file paths.
 */
export default function generateEntries(baseDir) {
    const entries = {};
    const files = globSync("**/*.html", { cwd: baseDir, nodir: true });

    for (const file of files) {
        const key = file.replace(/\.html$/i, "");
        entries[key] = path.resolve(baseDir, file);
    }

    return entries;
}
