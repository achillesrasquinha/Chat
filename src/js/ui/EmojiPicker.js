import DropDown from './base/DropDown'

class EmojiPicker extends DropDown {
	constructor (...options) {
		super (EmojiPicker.OPTIONS, ...options)

		this.init()
	}

	init ( ) {
		super.init()
	}
}

EmojiPicker.OPTIONS  = 
{
	icon: 'glyphicon glyphicon-thumbs-up'
}

export default EmojiPicker