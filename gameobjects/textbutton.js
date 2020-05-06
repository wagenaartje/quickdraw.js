class TextButton extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style, target_text, on_success, on_fail ) {
     super(scene, x, y, text, style);

     this.setInteractive({ useHandCursor: true })
	.on('pointerover', () => this.enterButtonHoverState() )
	.on('pointerout', () => this.enterButtonResetState() )
	.on('pointerdown', () => this.checkanswer(target_text, on_success, on_fail) )
    }

    enterButtonHoverState() {
      this.setStyle({ fill: '#ff0'});
    }
    enterButtonResetState() {
      this.setStyle({ fill: '#0f0'});
    }

    checkanswer(target_text, on_success, on_fail) {
      if ( this.text == target_text) {
	      on_success();
      }
      else
      {
	  on_fail();
      }
    }
}

