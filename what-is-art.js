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
	active: true,
	preload: preloadWellDoneScene,
	create: createWellDoneScene
}
var badLuckSceneConfig = 
{
	key: 'badluckscene',
	active: true,
	preload: preloadBadLuckScene,
	create: createBadLuckScene
}

var whiteSceneConfig = 
{
	key: 'whitescene',
	active: true,
	preload: preloadWhiteScene,
	create: createWhiteScene
}

var blackSceneConfig = 
{
	key: 'blackscene',
	active: true,
	preload: preloadBlackScene,
	create: createBlackScene
}


var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 810,
    height: 600,
    scene: [ imageSceneConfig, whiteSceneConfig, blackSceneConfig, buttonSceneConfig, badLuckSceneConfig, wellDoneSceneConfig ]
};


var game = new Phaser.Game(config);
var button_names;
var right_answer;
var score;
var scoreText;
var last_inc;
var last_but_one_inc;
var lives;
var livesText;
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
    button_names[0] = 'art'
    button_names[1] = 'banana stuck on wall'
    button_names[2] = 'wall stuck on banana'
    right_answer = button_names[0];
    button_names = shuffle(button_names);
    if (this.textures.exists('pic_image')){
        this.textures.remove('pic_image');
    }
    this.load.image('pic_image', 'assets/data/art_grey_600.jpeg');
    console.log(this.textures.exists('pic_image'), this.textures.exists('mask'))
    if (! this.textures.exists('mask')){
        this.load.image('mask', 'assets/sprites/ultrasound_beam.png')
    	this.load.image('probe', 'assets/sprites/probe.png')
    	this.load.spritesheet('speckle', 'assets/sprites/strong_speckle.png',
			{ frameWidth: 80, frameHeight: 101 });
    }
}

function createImageScene ()
{
    pic = this.add.image(300, 300, 'pic_image');

    var ultrasound_on = false;
    if (true || (score > 8) && (Math.random() >= 0.5) )
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
	   
	    spotlight.setScale(1.8);
	    probe.setScale(1.6);
	    speckle.setScale(1.8);
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
		
		let x_pos = 550;
		if ( pointer.x < 550 ){
			x_pos = pointer.x;
		}
		let y_pos = pointer.y - 110
		spotlight.x = x_pos;
		spotlight.y = y_pos;
		probe.x = x_pos;
		probe.y = y_pos + 45;
		speckle.x = x_pos;
		speckle.y = y_pos;
		speckle.anims.play('speckle_cycle', true)

    		});

	}
	else{

	    console.log("ultrasound off");
	}
    
	game.scene.bringToTop('imagescene');
}

function createButtonScene ()
{
    score = 0;
    last_but_one_inc = 0;
    last_inc = 1;
    lives = 3;
  
    answerButtons = []

    for ( var i = 0 ; i < button_names.length ; i++ ){
	let button = new TextButton(this, 610, 10 + i * 40, button_names[i], { fill: '#0f0' }, checkanswer);
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


function preloadBlackScene ()
{
    this.load.svg('pic_black', 'assets/backgrounds/black.svg');
}
function preloadWhiteScene ()
{
    this.load.svg('pic_white', 'assets/backgrounds/white.svg');
}
function preloadWellDoneScene ()
{
    this.load.image('picwd', 'assets/backgrounds/iconmonstr-smiley-600.gif');
    console.log("preloaded well done scene");
}
function preloadBadLuckScene ()
{
    this.load.image('picbl', 'assets/backgrounds/iconmonstr-frown-thin_600.gif');
    console.log("preloaded bad luck scene");
}

function createWellDoneScene ()
{
    let smiley = this.add.image(300, 300, 'picwd');
    game.scene.sendToBack('welldonescene');
    console.log("created well done scene");
} 

function createBadLuckScene ()
{
    this.add.image(300, 300, 'picbl');
    whatWasItText = this.add.text(220, 300, 'n/a', { fill: '#000' });
    console.log("created badluckscene");
    game.scene.sendToBack('badluckscene');
} 

function createBlackScene ()
{
    this.add.image(300, 300, 'pic_black');
} 
function createWhiteScene ()
{
    let smiley = this.add.image(300, 300, 'pic_white');
} 

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function on_success(this_game)
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
	game.scene.bringToTop('imagescene');
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
	whatWasItText.setText('It was ' + right_answer);
	await sleep(1600);

	if ( lives > 0 )
	{
		game.scene.stop('badluckscene');
		game.scene.add('imagescene', imageSceneConfig, true);
		game.scene.bringToTop('imagescene');
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
		on_success(this);
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
	game.scene.moveAbove('whitescene', 'blackscene');
  }
  else
  {	
        prefix = "assets/data/white_on_black/";
	game.scene.moveAbove('blackscene', 'whitescene');
  }

  let filename = prefix + categories[0] + "_" + zfill(random_number, 4) + ".svg"
  return [filename, [categories]];
}

function zfill(number, size) {
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}




