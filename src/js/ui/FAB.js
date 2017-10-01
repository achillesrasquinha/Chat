import Button from './base/Button'

class FAB extends Button {
	constructor (options) {
		options = Object.assign({ }, FAB.OPTIONS, options)
		super (options)

		this.init()
	}

	init   ( ) {
		this.$element.css({
					width: this.options.size,
				   height: this.options.size,
		  'border-radius': '50%'
		})
	}

	render ( ) {
		
	}
}
FAB.OPTIONS     = 
{
		size: 56,
	    icon: 'glyphicon glyphicon-plus',
	toggable: false
}

export default FAB