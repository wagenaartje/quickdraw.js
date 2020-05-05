//var quickDraw = require(['src/quickdraw.js']);

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,

    }
};

var game = new Phaser.Game(config);

function preload ()
{
    let filename = next_image();
    console.log(filename);
    this.load.svg('pic', filename);
    //this.load.svg('pic', 'assets/data/cat_0000_is.svg');
    //this.load.image('pic_t', 'assets/backgrounds/taikodrummaster.jpg');
    this.load.svg('pic_t', 'assets/svg/grapes.svg');
}

function create ()
{

    var pic = this.add.image(125, 125, 'pic');
	
}


function next_image() {
  let category = quickDraw.test();
  category = "cat"	
  let random_number = Math.floor(Math.random() * 200)
  let filename = "assets/data/" + category + "_" + zfill(random_number, 4) + ".svg"
  return filename;
}

function zfill(number, size) {
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}




