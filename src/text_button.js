class TextButton extends Phaser.Group {
    constructor(text = 'button', set = 1, style = 1, event = null, params = null, size = 22, textColor = '#000000') {
        super(game);
         
        //place in center of the screen
        this.x = game.width / 2;
        this.y = game.height / 2;
        var key = "buttons_" + set + "_" + style;
         
        //promote parameters to class variables
        this.key = key;
        this.text = text;
        this.event = event;
        this.params = params;
        //
        //
        //
        //make the back
        this.buttonBack = this.create(0, 0, this.key);
        //set the anchor to center
        this.buttonBack.anchor.set(0.5, 0.5);
        //
        //
        //
        //add the textfield
        this.textField = game.add.text(0, 0, text);
        //anchor the text in the center
        this.textField.anchor.set(0.5, 0.5);
        //
        //
        //set the size
        this.textField.fontSize = size + "px";
        //set the color
        this.textField.fill = textColor;
        //add the textField 
        this.add(this.textField);
 
        //enable the button and add events
        this.buttonBack.inputEnabled = true;
        this.buttonBack.events.onInputUp.add(this.onReleased, this);
        this.buttonBack.events.onInputDown.add(this.onDown, this);
    }
    //preload a single style
    static preload(set, style) {
        var key = "buttons_" + set + "_" + style;
        var path = "images/ui/buttons/" + set + "/" + style + ".png";
        game.load.image(key, path);
    }
    //preload all the buttons
    static preloadAll() {
        var lenArray = [10, 8, 15, 14];
        for (var i = 1; i < 5; i++) {
            for (var j = 1; j < lenArray[i - 1] + 1; j++) {
                TextButton.preload(i, j);
            }
        }
    }
    //set the x and y position of the button
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    //get the back, in order to add events directly to the sprite
    getBack() {
        return this.buttonBack;
    }
    //move up a bit when pressed
    onDown() {
        this.buttonBack.y = -5;
    }
    //dispatch the event
    onReleased() {
        this.buttonBack.y = 0;
        if (this.event) {
            if (this.params) {
                eventDispatcher.dispatch(this.event, this.params);
            } else {
                eventDispatcher.dispatch(this.event);
            }
        }
    }
    //set the text size
    setTextSize(size) {
        this.textField.fontSize = size + "px";
    }
    //set the text position
    setTextPos(xx, yy) {
        this.textField.x = xx;
        this.textField.y = yy;
    }
    //set the text color
    setTextColor(textColor) {
        this.textField.fill = textColor;
    }
    //get the text field
    getTextField() {
        return this.textField;
    }
    //get the text inside the textField
    getText() {
        return this.textField.text;
    }
}
