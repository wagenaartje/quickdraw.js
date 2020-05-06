
/*******************************************************************************
                                  QUICKDRAW
*******************************************************************************/

const quickDraw = {

  /** Converts the strokes of a drawing to an array */
  _strokeToArray: function (data, size) {
    var bitmap = new Array(size * size).fill(0);

    for (let i = 0; i < data.length; i++) {
      let stroke = data[i];
      for (var j = 1; j < stroke[0].length; j++) {
        let dots = quickDraw._plot(
          stroke[0][j - 1] * size / 256,
          stroke[1][j - 1] * size / 256,
          stroke[0][j] * size / 256,
          stroke[1][j] * size / 256
        );

        for (var k = 0; k < dots.length; k++) {
          let dot = dots[k];
          if (dot.y < size && dot.x < size) {
            bitmap[dot.y * size + dot.x] += dot.b;
          }
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

  test: function () {
    ten_cats = categories.pickRandomCats(10);
    console.log(ten_cats);
    return [ten_cats];
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
  },

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
  }
};

