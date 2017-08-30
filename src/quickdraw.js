const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const https = require('https');
const ndjson = require('ndjson');
const { createCanvas } = require('canvas');

/*******************************************************************************
                                  QUICKDRAW
*******************************************************************************/

const quickDraw = {
  /** List of categories **/
  categories: require('./categories'),

  /** Converts the strokes of a drawing to an actual canvas */
  _strokeToCanvas: function (data, size) {
    var canvas = createCanvas(size, size);

    var ctx = canvas.getContext('2d');

    for (var i = 0; i < data.length; i++) {
      var stroke = data[i];
      ctx.moveTo(stroke[0][0] * size / 256, stroke[1][0] * size / 256);
      for (var j = 0; j < stroke[0].length; j++) {
        ctx.lineTo(stroke[0][j] * size / 256, stroke[1][j] * size / 256);
      }
    }

    ctx.stroke();

    return { canvas: canvas, context: ctx };
  },

  /** Converts a canvas to a greyscale size x size array */
  _contextToArray: function (context, size) {
    var pixelData = context.getImageData(0, 0, size, size).data;

    var result = [];
    for (var i = 3; i < pixelData.length; i += 4) {
      let greyScale = Math.round(pixelData[i] / 256 * 1000) / 1000;
      result.push(greyScale);
    }

    return result;
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
      let { context } = quickDraw._strokeToCanvas(d.drawing, size);
      let array = quickDraw._contextToArray(context, size);
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
