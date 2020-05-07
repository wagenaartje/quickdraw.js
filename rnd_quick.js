var imageSceneConfig = 
{
	key: 'imagescene',
	active: true,
	preload: preloadImageScene,
	create: createImageScene
}

var buttonSceneConfig = 
{
	key: 'buttonscene',
	active: true,
	create: createButtonScene
}

var wellDoneSceneConfig = 
{
	key: 'welldonescene',
	active: false,
	preload: preloadWellDoneScene,
	create: createWellDoneScene
}
var badLuckSceneConfig = 
{
	key: 'badluckscene',
	active: false,
	preload: preloadBadLuckScene,
	create: createBadLuckScene
}


var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ badLuckSceneConfig, wellDoneSceneConfig, imageSceneConfig, buttonSceneConfig ]
};


var game = new Phaser.Game(config);
var button_names;
var right_answer;
var score;
var scoreText;
var last_inc;
var last_but_one_inc;
var lives;
var answerButtons;
var pic;
var background_image;
var whatWasItText;
var spotlight;
var probe;
var speckle;




function preloadImageScene ()
{
    let names = next_image();
    button_names = names[1][0];
    right_answer = button_names[0];
    button_names = shuffle(button_names);
    if (this.textures.exists('pic_image')){
        this.textures.remove('pic_image');
    }
    this.load.svg('pic_image', names[0]);
    console.log(this.textures.exists('pic_image'), this.textures.exists('mask'))
    if (! this.textures.exists('mask')){
        this.load.image('mask', 'assets/sprites/ultrasound_beam.png')
    	this.load.image('probe', 'assets/sprites/probe.png')
    	this.load.spritesheet('speckle', 'assets/sprites/speckle.png',
			{ frameWidth: 80, frameHeight: 101 });
    }
}

function createImageScene ()
{
    pic = this.add.image(300, 300, 'pic_image');

    var ultrasound_on = false;
    if (Math.random() >= 0.2 )
	{
	    console.log("ultrasound on");
	    ultrasound_on = true;
	    var spotlight = this.make.sprite({
		x: 500,
		y: 500,
		key: 'mask',
		add: false
	    });
	    probe = this.make.sprite({
		x: 500,
		y: 500,
		key: 'probe',
		add: true
	    });

	    speckle = this.make.sprite({
		x: 500,
		y: 500,
		key: 'speckle',
		add: true
	    });
	    
	    if (! this.textures.exists('speckle_cycle'))
		{
	    		this.anims.create({
        		key: 'speckle_cycle',
        		frames: this.anims.generateFrameNumbers('speckle', { start: 0, end: 9 }),
        		frameRate: 10,
        		repeat: -1
			
            		});
		}

	    pic.mask = new Phaser.Display.Masks.BitmapMask(this, spotlight);

	    this.input.on('pointermove', function (pointer) {

		spotlight.x = pointer.x;
		spotlight.y = pointer.y;
		probe.x = pointer.x;
		probe.y = pointer.y;
		speckle.x = pointer.x;
		speckle.y = pointer.y;
		speckle.anims.play('speckle_cycle', true)

    		});

	}
    
}

function createButtonScene ()
{
    score = 0;
    last_but_one_inc = 0;
    last_inc = 1;
    lives = 3;
  
    answerButtons = []

    for ( var i = 0 ; i < button_names.length ; i++ ){
	let button = new TextButton(this, 610, 10 + i * 20, button_names[i], { fill: '#0f0' }, checkanswer);
    	answerButtons.push(button);
	this.add.existing(answerButtons[i]);
    }
    
    scoreText = this.add.text(610, 560, 'Score:' + score, { fill: '#0f0' });
    livesText = this.add.text(610, 580, 'Lives: ' + lives, { fill: '#0f0' });


    update_buttons();
}

function update_buttons()
{
        for ( var i = 0 ; i < button_names.length ; i++ ){
        	answerButtons[i].setText(button_names[i]);
	}
}


function preloadWellDoneScene ()
{
    this.load.image('picwd', 'assets/backgrounds/iconmonstr-smiley-600.gif');
}
function preloadBadLuckScene ()
{
    this.load.image('picbl', 'assets/backgrounds/iconmonstr-frown-thin_600.gif');
}

function createWellDoneScene ()
{
    let smiley = this.add.image(300, 300, 'picwd');
} 
function createBadLuckScene ()
{
    this.add.image(300, 300, 'picbl');
    whatWasItText = this.add.text(220, 300, '' + right_answer, { fill: '#000' });
} 

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function on_success()
{
	let new_inc = last_inc + last_but_one_inc;
	last_but_one_inc = last_inc;
	last_inc = new_inc;
	score += new_inc;
	scoreText.setText('Score: ' + score);

	game.scene.run('welldonescene');
	game.scene.bringToTop('welldonescene');
	game.scene.stop('imagescene');
	game.scene.remove('imagescene');
	await sleep(1000);
	game.scene.add('imagescene', imageSceneConfig, true);
	game.scene.stop('welldonescene');

	update_buttons();
	
}
async function on_fail()
{
	last_but_one_inc = 0;
        last_inc = 1;
	lives -= 1;
	livesText.setText('Lives: ' + lives)
	
	game.scene.run('badluckscene');
	game.scene.stop('imagescene');
	game.scene.remove('imagescene');
	game.scene.bringToTop('badluckscene');
	whatWasItText.setText('It was a ' + right_answer);
	await sleep(1000);

	if ( lives > 0 )
	{
		game.scene.stop('badluckscene');
		game.scene.add('imagescene', imageSceneConfig, true);
		update_buttons();
	}
	else
	{
		whatWasItText.setText('Game Over! You scored ' + score);
		game.scene.stop('buttonscene');
		game.scene.stop();
	}


}

function checkanswer (text)
{
	console.log(text + " =? " + right_answer);
	if ( text == right_answer )
	{
		on_success();
	}
	else
	{
		on_fail();
	}
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
  let random_number = Math.floor(Math.random() * 200);
  let prefix = ""
  if (Math.random() >= 0.5 )
  {
	prefix = "assets/data/black_on_white/";
  }
  else
  {	
        prefix = "assets/data/white_on_black/";
  }

  let filename = prefix + categories[0] + "_" + zfill(random_number, 4) + ".svg"
  return [filename, [categories]];
}

function zfill(number, size) {
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}




