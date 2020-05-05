//var quickDraw = require(['src/quickdraw.js']);


function next_image() {
  let category = quickDraw.test();
  category = "cat"	
  let random_number = Math.floor(Math.random() * 200)
  let filename = "assets/data/" + category + "_" + zfill(random_number, 4) + ".svg"
  show_image(filename, 600,600, "A random image");
}

function zfill(number, size) {
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}

function show_image(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  document.body.appendChild(img);
}



