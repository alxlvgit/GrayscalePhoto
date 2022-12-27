/*
 * Project: COMP1320 Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */
const path = require("path");
const { unzip, readDir, grayScale } = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");


const run = async () => {
    try {
        const unzipFile = await unzip(zipFilePath, pathUnzipped);
        console.log(unzipFile);
        const allPngFiles = await readDir(pathUnzipped);
        for (const picturePath of allPngFiles) {
            await grayScale(picturePath, pathProcessed);
        }
        console.log(`Successfully converted to Grayscale. Number of converted files: ${allPngFiles.length} `);
    } catch (error) {
        console.log(error);
    }
}

run();