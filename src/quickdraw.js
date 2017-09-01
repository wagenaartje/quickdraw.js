const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const https = require('https');
const ndjson = require('ndjson');

/*******************************************************************************
                                  QUICKDRAW
*******************************************************************************/

const quickDraw = {
  /** List of categories */
  categories: require('./categories'),

  /** Plots a line on dots, adapted from https://goo.gl/kRNrMR */
  _plot: function (x0, y0, x1, y1) {
    if (x0 === x1 && y0 === y1) {
      return [];
    }

    var fraction = function (x) {
      return x - Math.floor(x);
    };

    var dots = [];
    var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

    if (steep) {
      [y0, x0] = [x0, y0];
      [y1, x1] = [x1, y1];
    }

    if (x0 > x1) {
      [x1, x0] = [x0, x1];
      [y1, y0] = [y0, y1];
    }

    var dx = x1 - x0;
    var dy = y1 - y0;
    var gradient = dy / dx;

    var xEnd = Math.round(x0);
    var yEnd = y0 + gradient * (xEnd - x0);
    var xGap = 1 - fraction(x0 + 0.5);
    var xPx1 = xEnd;
    var yPx1 = Math.floor(Math.abs(yEnd));

    if (steep) {
      dots.push({ x: yPx1, y: xPx1, b: 1 - fraction(yEnd) * xGap });
      dots.push({ x: yPx1 + 1, y: xPx1, b: fraction(yEnd) * xGap });
    } else {
      dots.push({ x: xPx1, y: yPx1, b: 1 - fraction(yEnd) * xGap });
      dots.push({ x: xPx1, y: yPx1 + 1, b: fraction(yEnd) * xGap });
    }

    var intery = yEnd + gradient;

    xEnd = Math.round(x1);
    yEnd = y1 + gradient * (xEnd - x1);
    xGap = fraction(x1 + 0.5);

    var xPx2 = xEnd;
    var yPx2 = Math.floor(Math.abs(yEnd));

    if (steep) {
      dots.push({ x: yPx2, y: xPx2, b: 1 - fraction(yEnd) * xGap });
      dots.push({ x: yPx2 + 1, y: xPx2, b: fraction(yEnd) * xGap });
    } else {
      dots.push({ x: xPx2, y: yPx2, b: 1 - fraction(yEnd) * xGap });
      dots.push({ x: xPx2, y: yPx2 + 1, b: fraction(yEnd) * xGap });
    }

    if (steep) {
      for (let x = xPx1 + 1; x <= xPx2 - 1; x++) {
        dots.push({ x: Math.floor(Math.abs(intery)), y: x, b: 1 - fraction(intery) });
        dots.push({ x: Math.floor(Math.abs(intery)) + 1, y: x, b: fraction(intery) });
        intery = intery + gradient;
      }
    } else {
      for (let x = xPx1 + 1; x <= xPx2 - 1; x++) {
        dots.push({ x: x, y: Math.floor(Math.abs(intery)), b: 1 - fraction(intery) });
        dots.push({ x: x, y: Math.floor(Math.abs(intery)) + 1, b: fraction(intery) });
        intery = intery + gradient;
      }
    }

    return dots;
  },

  /** Converts the strokes of a drawing to an array */
  _strokeToArray: function (data, size) {
    var bitmap = new Array(size * size).fill(0);

    for (let i = 0; i < data.length; i++) {
      let stroke = data[i];
      for (var j = 1; j < stroke[0].length; j++) {
        let dots = quickDraw._plot(stroke[0][j - 1] * size / 256, stroke[1][j - 1] * size / 256, stroke[0][j] * size / 256, stroke[1][j] * size / 256);
        for (var k = 0; k < dots.length; k++) {
          let dot = dots[k];
          bitmap[dot.y * size + dot.x] += dot.b;
        }
      }
    }

    for (let i = 0; i < bitmap.length; i++) {
      if (bitmap[i] > 1) {
        bitmap[i] = 1;
      } else {
        bitmap[i] = Math.round(bitmap[i] * 1000) / 1000;
      }
    }

    return bitmap;
  },

  /** Downloads the given amount of drawings from the given category */
  _downloadSet: function (category, amount) {
    var url = 'https://storage.googleapis.com/quickdraw_dataset/full/simplified/';
    url += encodeURIComponent(category) + '.ndjson';

    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        var { statusCode } = res;

        if (statusCode !== 200) {
          throw new Error(`Request Failed.\n Status Code: ${statusCode}`);
        }

        res.setEncoding('utf8');
        var drawings = [];
        res
          .pipe(ndjson.parse())
          .on('data', function (obj) {
            if (drawings.length < amount) {
              drawings.push(obj);
            } else {
              this.destroy();
            }
          })
          .on('end', () => {
            resolve(drawings);
          })
          .on('close', () => {
            resolve(drawings);
          });
      }).on('error', (e) => {
        throw new Error(e.message);
      });
    });
  },

  /** Imports the dataset of the certain category  */
  import: async function (category, amount, size = 28) {
    var drawings = await quickDraw._downloadSet(category, amount);

    if (drawings.length < amount) {
      console.warn(`Requested ${amount} images from '${category}', only ${drawings.length} available!`);
    }

    var fileName = category + '.ndjson.gz';
    var transformStream = ndjson.serialize();
    var outputStream = fs.createWriteStream(path.join(__dirname, '/drawings/', fileName));

    var gzip = zlib.createGzip();

    transformStream.pipe(gzip).pipe(outputStream);

    drawings.forEach(function (d) {
      let array = quickDraw._strokeToArray(d.drawing, size);
      transformStream.write(array);
    });

    transformStream.end();

    return new Promise((resolve, reject) => {
      outputStream.on('finish', function handleFinish () {
        console.log(category, ' - Processing done! # of drawings:', drawings.length);
        resolve();
      });
    });
  },

  /** Imports the datasets of all categories */
  importAll: async function (amount, size) {
    for (var i = 0; i < quickDraw.categories.length; i++) {
      let category = quickDraw.categories[i];
      await quickDraw.import(category, amount, size);
    }
  },

  /** Returns a useable dataset for Neataptic and Synaptic */
  set: function (amount, categories = quickDraw.categories) {
    var dataSet = [];

    var chunkSize = Math.floor(amount / categories.length);
    var rest = Math.round((amount / categories.length - chunkSize) * categories.length);

    var inputSize;

    for (var i = 0; i < categories.length; i++) {
      let category = categories[i];

      let data;
      try {
        let gzip = fs.readFileSync(path.join(__dirname, `./drawings/${category}.ndjson.gz`));
        let unzipped = zlib.unzipSync(new Buffer(gzip, 'base64')).toString();

        data = unzipped.split('\r\n');
        data.pop();
        data = data.map(x => JSON.parse(x));
      } catch (err) {
        throw new Error(`Missing category: '${category}'. Please import!`);
      }

      if (i === 0) {
        inputSize = data[0].length;
      } else if (data[0].length !== inputSize) {
        console.warn(`${category} set does not have correct dimensions and has not been included. Wanted dim: ${Math.sqrt(inputSize)}, ${category} dim: ${Math.sqrt(data[0].length)}`);
      }

      let toPick;
      if (rest > 0) {
        toPick = chunkSize + 1;
        rest--;
      } else {
        toPick = chunkSize;
      }

      if (data.length < toPick) {
        throw new Error(`Too few elements in local '${category}' set! (${data.length}, ${amount} needed)`);
      }

      let picked = quickDraw._pickRandom(data, toPick);

      for (var j = 0; j < picked.length; j++) {
        let output = new Array(categories.length).fill(0);
        output[i] = 1;

        dataSet.push({ input: picked[j], output: output });
      }
    }

    dataSet = quickDraw._shuffle(dataSet);
    return { input: inputSize, set: dataSet, output: categories.length };
  },

  /** Pick non-repeating elements in a random fashion */
  _pickRandom: function (array, amount) {
    var picked = [];
    for (var i = array.length - 1; i >= array.length - amount; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      let pick = array[j];
      let temp = array[i];

      array[i] = pick;
      array[j] = temp;

      picked.push(pick);
    }

    return picked;
  },

  /** Shuffles an array */
  _shuffle: function (array) {
    var i = array.length;

    while (--i) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }
};

module.exports = quickDraw;
