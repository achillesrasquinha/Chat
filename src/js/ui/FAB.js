import Component from './Component'
import Button 	 from './base/Button'

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

	position (which) {
		const accepted = [
			FAB.POSITION.TOP.LEFT,  FAB.POSITION.BOTTOM.LEFT,
			FAB.POSITION.TOP.RIGHT, FAB.POSITION.BOTTOM.RIGHT
		]

		const tokens   = which.split('')
		if ( !accepted.includes(which) ) 
			throw TypeError(`Expected ${accepted}, got ${which} instead for value position.`)

		const css      = { position: 'absolute' }
		
		if ( tokens.includes('t') ) {
			css.top    = 0
			this.$element.css({
				   'margin-top': 8
			})
		}
		if ( tokens.includes('b') ) {
			css.bottom = 0
			this.$element.css({
				'margin-bottom': 8
			})
		}

		if ( tokens.includes('l') ) {
			css.left   = 0
			this.$element.css({
				  'margin-left': 8
			})
		}
		if ( tokens.includes('r') ) {
			css.right  = 0
			this.$element.css({
				 'margin-right': 8
			})
		}

		this.$element.css(css)
	}
}

FAB.POSITION    = Component.POSITION
FAB.OPTIONS     = 
{
		size: 56,
	    icon: 'glyphicon glyphicon-plus',
	toggable: false
}

export default FAB