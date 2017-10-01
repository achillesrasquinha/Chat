import DropDown from './base/DropDown'

class EmojiPicker extends DropDown {
	constructor (options) {
		options      = Object.assign({ }, EmojiPicker.OPTIONS, options)
		super (options)

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