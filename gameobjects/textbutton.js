class TextButton extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style, callback ) {
     super(scene, x, y, text, style);

     this.setInteractive({ useHandCursor: true })
	.on('pointerover', () => this.enterButtonHoverState() )
	.on('pointerout', () => this.enterButtonResetState() )
	.on('pointerdown', () => this.checkanswer(callback) )
    }

    enterButtonHoverState() {
      this.setStyle({ fill: '#ff0'});
    }
    enterButtonResetState() {
      this.setStyle({ fill: '#0f0'});
    }

    checkanswer(callback) {
      callback(this.text)
    }
}

