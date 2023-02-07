"use strict";
import * as pug from "pug";
import * as fs from "fs";
import * as path from "path";
import * as terser from "terser";

const minify = process.argv.some(x => x.toLowerCase() === "--minify");
const deleteJS = process.argv.some(x => x.toLowerCase() === "--deletejs");

const fsParams: fs.ObjectEncodingOptions = { encoding: "utf8" };

const terserParams: terser.MinifyOptions = {
    compress: {
        ecma: 2020
    },
    module: true,
    toplevel: true
};

type stringObj = { [key: string]: string };

function jsKv(terserOutput: terser.MinifyOutput, filename: string): stringObj {
    const nameWOExt = path.parse(filename).name;
    const code = terserOutput.code ?? "";
    const filteredCode = code.replace(/\.\/(\w+)\.js/gmi, "./dist/$1.min.js");
    return { [nameWOExt]: filteredCode };
}

async function minifyJs(file: string): Promise<void | stringObj> {
    const ext = path.extname(file);
    if (ext !== ".js")
        return;

    return new Promise((res, rej) =>
        fs.readFile(jsDir + file, fsParams, (err, data) => {
            if (err)
                rej(err);
            else if (data) {
                if (typeof data !== "string")
                    rej("Invalid data")
                else
                    terser.minify(data, terserParams)
                        .then(x => res(jsKv(x, file)))
                        .catch(x => rej(x));
            }
        })
    );
}

const pkgVersion = process.env.npm_package_version;

const pugDir = "./src/pug/";
const pugFiles = fs.readdirSync(pugDir);

const jsDir = "./dist/";
const jsFiles = fs.readdirSync(jsDir);
const jsKeep = ["commons"];


let jsObj: stringObj = {};

if (minify) {
    const js = await Promise.all(
        jsFiles.map(minifyJs)
    );

    for (const file of js) {
        if (file) {
            jsObj = {
                ...jsObj,
                ...file
            };
        }
    }
    if (deleteJS) {
        const fileList = Object.keys(jsObj);
        const jsList = fileList.map(x => x + ".js");
        const mapList = fileList.map(x => x + ".js.map");
        const allFiles = [...jsList, ...mapList];

        for (const file of allFiles) {
            fs.unlinkSync(jsDir + file);
            console.log(`Deleting ${file}...`);
        }
    }
    for (const file of jsKeep) {
        fs.writeFileSync(
            jsDir + file + ".min.js",
            jsObj[file]
        );
    }
}

const pugParams: pug.LocalsObject = {
    version: pkgVersion,
    inlineJs: minify,
    js: jsObj
};

for (const file of pugFiles) {
    const ext = path.extname(file);
    if (ext === ".pug") {
        const rendered = pug.renderFile(pugDir + file, pugParams);
        const baseName = path.parse(file).name;
        fs.writeFileSync(`./${baseName}.html`, rendered);
    }
}

const jsonInDir = "./src/json/";
const jsonOutDir = "./dist/json/";

for (const file of fs.readdirSync(jsonInDir)) {
    const ext = path.extname(file);
    if (ext === ".json") {
        const raw = fs.readFileSync(jsonInDir + file, fsParams);
        if (typeof raw !== "string")
            continue;
        const data = JSON.parse(raw);
        if("version" in data)
            data.version = pkgVersion;
        fs.writeFileSync(
            jsonOutDir + file,
            JSON.stringify(data),
            fsParams
        );
    }
}