//var quickDraw = require(['src/quickdraw.js']);


function next_image() {
  //var a_set = quickDraw.set('dogs');
  quickDraw.test();
  var src = "assets/data/cat_001.svg";
  show_image(src, 600,600, "A random image");
}


function show_image(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  document.body.appendChild(img);
}



