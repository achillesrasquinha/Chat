import Button from './base/Button'

class FAB extends Button {
	constructor (...options) {
		super (FAB.OPTIONS, ...options)

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
				'background-color': this.options.color.accent,
						     color: '#FEFEFE'
			})
		}

		if ( this.options.toggable ) {
			const $icon = this.$element.find('i')

			this.$element.click(() => {
				$icon.toggleClass(`${this.options.icon}`)
				$icon.toggleClass("glyphicon glyphicon-remove")
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