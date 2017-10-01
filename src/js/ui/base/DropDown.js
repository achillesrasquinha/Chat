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
		
		this.button.mount(this.$element)
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
<div class="frappe-dropdown dropdown">
	<div class="dropdown-menu">

	</div>
</div>
`

export default DropDown