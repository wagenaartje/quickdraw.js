class TextButton extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style, callback) {
     super(scene, x, y, text, style);

     this.setInteractive({ useHandCursor: true })
	.on('pointerover', () => this.enterButtonHoverState() )
    }

    enterButtonHoverState() {
      this.setStyle({ fill: '#ff0'});
      console.log(this.text);
    }
}

