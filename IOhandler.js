/*
 * Project: COMP1320 Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const { createReadStream, createWriteStream } = require("fs");
const { extname, join, basename } = require('path');
const { pipeline } = require("stream");

const unzipper = require('unzipper'),
  fs = require("fs").promises,
  PNG = require('pngjs').PNG;


/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    pipeline(
      createReadStream(pathIn),
      unzipper.Extract({ path: pathOut })
        .on("close", () => resolve("Extraction complete")), (err) => {
          if (err) {
            reject(err);
          }
        }
    )
  })
}

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return fs.readdir(dir)
    .then((files) => {
      const allPngFiles = [];
      for (const file of files) {
        if (extname(file) == ".png") {
          allPngFiles.push(join(dir, file));
        }
      }
      return allPngFiles;
    })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    pipeline(
      createReadStream(pathIn),
      new PNG()
        .on("parsed", function () {
          for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
              var idx = (this.width * y + x) << 2;
              // grayscale algorithm
              const gray = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
              this.data[idx] = gray;
              this.data[idx + 1] = gray;
              this.data[idx + 2] = gray;
            }
          }
          this.pack();
        }),
      createWriteStream(join(pathOut, basename(pathIn)))
        .on("close", () => resolve()),
      (err) => {
        if (err) { reject(err) }
      }
    )
  })
};



module.exports = {
  unzip,
  readDir,
  grayScale
};




// Pipes

// const unzip = (pathIn, pathOut) => {
//   return new Promise((resolve, reject) => {
//     createReadStream(pathIn)
//       .pipe(unzipper.Extract({ path: pathOut }))
//       .on("close", () => resolve("Extraction complete"))
//       .on("error", (err) => reject(err));
//   })
// };


// const grayScale = (pathIn, pathOut) => {
//   return new Promise((resolve, reject) => {
//     createReadStream(pathIn)
//       .pipe(new PNG({
//       }
//       ))
//       .on("parsed", function () {
//         for (var y = 0; y < this.height; y++) {
//           for (var x = 0; x < this.width; x++) {
//             var idx = (this.width * y + x) << 2;
//             // grayscale algorithm
//             const gray = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
//             this.data[idx] = gray;
//             this.data[idx + 1] = gray;
//             this.data[idx + 2] = gray;
//           }
//         }
//         this.pack().pipe(createWriteStream(join(pathOut, basename(pathIn))))
//           .on("close", () => resolve())
//           .on("error", (err) => reject(err));
//       })
//   })
// };
