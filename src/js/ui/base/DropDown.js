import Component from '../Component'
import Button    from  './Button'

class DropDown extends Component {
	constructor (options) {
		options  	  = Object.assign({ }, DropDown.OPTIONS, options)
		super (options)

		this.button   = new Button()
	}

	init   ( ) {
		this.button.$element.addClass('dropdown-toggle')
		this.button.$element.attr('data-toggle', 'dropdown')

		this.$element = $(DropDown.TEMPLATE)
		this.position(this.options.position)
		
		this.button.mount(this.$element)
	}

	position (which) {
		const accepted = [
			Component.POSITION.TOP.LEFT,  Component.POSITION.BOTTOM.LEFT,
			Component.POSITION.TOP.RIGHT, Component.POSITION.BOTTOM.RIGHT
		]

		const tokens   = which.split('')
		if ( !accepted.includes(which) ) 
			throw TypeError(`Expected ${accepted}, got ${which} instead for value position.`)

		const css      = { }
		const $menu    = this.$element.find('.dropdown-menu')
		
		if ( tokens.includes('t') ) {
			css.top    = 0
			this.$element.addClass('dropdown')
		}
		if ( tokens.includes('b') ) {
			css.bottom = 0
			this.$element.addClass('dropup')
		} 

		if ( tokens.includes('l') ) {
			css.left   = 0
			$menu.addClass('dropdown-menu-left')
		}
		if ( tokens.includes('r') ) {
			css.right  = 0
			$menu.addClass('dropdown-menu-right')
		}

		this.$element.css(css)
	}

	render ( ) {

	}
}
DropDown.OPTIONS  = 
{
	position: Component.POSITION.TOP.LEFT
}
DropDown.TEMPLATE = 
`
<div class="frappe-dropdown">
	<div class="dropdown-menu">

	</div>
</div>
`

export default DropDown