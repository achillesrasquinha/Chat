import Component from '../Component'

class Button extends Component {
	constructor (...options) {
		super (Button.OPTIONS, ...options)

		this.$element = $(Button.TEMPLATE)
	}

	init   ( ) {
		super.init()

		if ( this.options.icon ) {
			if ( !this.$element.find('i').length ) {
				this.$element.append(`<i class="${this.options.icon}"/>`)
			}
		}
	}

	render ( ) {

	}
}

Button.OPTIONS		  = 
{

}
Button.TEMPLATE 	  = 
`
<button class="frappe-btn btn btn-default">

</button>
`

export default Button