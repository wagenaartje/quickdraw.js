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
var button_names;
function preload ()
{
    let names = next_image();
    button_names = names[1]
    console.log(names);
    this.load.svg('pic', names[0]);
}

function create ()
{

    var pic = this.add.image(300, 300, 'pic');
    const helloButton = this.add.text(610, 10, button_names[0][0], { fill: '#0f0' });
    helloButton.setInteractive();


}


function next_image() {
  let [categories] = quickDraw.test();
  categories[0] = "cat"	
  let random_number = Math.floor(Math.random() * 200)
  let filename = "assets/data/" + categories[0] + "_" + zfill(random_number, 4) + ".svg"
  return [filename, [categories]];
}

function zfill(number, size) {
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}




