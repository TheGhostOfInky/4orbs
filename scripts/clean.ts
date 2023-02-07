import * as fs from "fs";
import * as path from "path";
import type { FileType } from "./types";


const dirsToClean: FileType[] = [
    { dir: "./scripts", ext: [".js"] },
    { dir: "./dist", ext: [".js", ".map"] }
];

for (const dir of dirsToClean) {
    const dirContents = fs.readdirSync(dir.dir);
    for (const file of dirContents) {
        if (!dir.ext) {
            fs.unlinkSync(dir.dir + "/" + file);
            continue;
        }
        const filext = path.extname(file);
        if (dir.ext.includes(filext)) {
            fs.unlinkSync(dir.dir + "/" + file)
        }
    }
}