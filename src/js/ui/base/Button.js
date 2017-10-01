import Component from '../Component'

class Button extends Component {
	constructor (options) {
		options		  = Object.assign({ }, Button.OPTIONS, options)
		super (options)

		this.init()
	}

	init   ( ) {
		this.$element = $(Button.TEMPLATE)
		
		if ( this.options.icon ) {
			var $icon = $(`<i class="${this.options.icon}"/>`)
			this.$element.append($icon)
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