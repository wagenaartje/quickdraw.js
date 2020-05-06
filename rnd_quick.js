//var quickDraw = require(['src/quickdraw.js']);

//import { TextButton } from 'gameobjects/textbutton';

class random_image extends Phaser.Scene
{
	constructor()
	{
		super({key: 'random_image', active: true});
	}

	preload()
	{
		let names = next_image();
    		button_names = names[1][0];
    		right_answer = button_names[0];
    		button_names = shuffle(button_names);
    		this.load.svg('pic', names[0]);
	}



}
var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create,
	preload: preload,
    }
};

var game = new Phaser.Game(config);
var button_names;
var right_answer;
var score;
var last_inc;
var last_but_one_inc;
var lives;
var answerButtons;
var pic;
var background_image;

function preload ()
{
    let names = next_image();
    button_names = names[1][0];
    right_answer = button_names[0];
    button_names = shuffle(button_names);
    this.load.svg('pic', names[0]);
}

function create ()
{
    score = 0;
    last_but_one_inc = 0;
    last_inc = 1;
    lives = 3;
   
    answerButtons = []

    pic = this.add.image(300, 300, 'pic');

    for ( var i = 0 ; i < button_names.length ; i++ ){
	let button = new TextButton(this, 610, 10 + i * 20, button_names[i], { fill: '#0f0' }, right_answer, on_success, on_fail);
    	answerButtons.push(button);
	this.add.existing(answerButtons[i]);
    }


}

function on_success()
{
	console.log("Well done");
	this.textures.remove('pic');
	this.load.svg('pic', 'assets/backgrounds/iconmonstr-smiley-2.svg');
}
function on_fail()
{
	console.log("Bad luck");
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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




