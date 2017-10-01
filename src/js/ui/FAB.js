import Button from './base/Button'

class FAB extends Button {
	constructor (options) {
		options = Object.assign({ }, FAB.OPTIONS, options)
		super (options)

		this.init()
	}

	init   ( ) {
		super.init()
	
		this.$element.css({
					width: this.options.size,
				   height: this.options.size,
		  'border-radius': '50%',
		  	 'box-shadow': '0px 3px 6px 0px rgba(0,0,0,.25)'
		})

		if ( this.options.color ) {
			this.$element.css({
				'background-color': this.options.color.primary,
						     color: '#FEFEFE' // TODO: Automatically detect
			})
		}
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