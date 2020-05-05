//var quickDraw = require(['src/quickdraw.js']);

//import { TextButton } from 'gameobjects/textbutton';

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
    var answerButtons = []
    for ( var i = 0 ; i < button_names[0].length ; i++ ){
	
	let button = new TextButton(this, 610, 10 + i * 20, button_names[0][i], { fill: '#0f0' });
    	answerButtons.push(button);
	this.add.existing(answerButtons[i]);
    //	answerButtons.push(this.add.TextButton(610, 10 + i * 20, button_names[0][i], { fill: '#0f0' }));
   // 	answerButtons[i].setInteractive();
//	answerButtons[i].on('pointerover', () => onPointerOver(i) )
    }


}

//function onPointerOver(i)
//{

//	console.log('pointerover' + button_names[0][i]);
//}

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




