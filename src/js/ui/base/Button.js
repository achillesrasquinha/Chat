import Component from '../Component'

class Button extends Component {
	constructor (options) {
		options		  = Object.assign({ }, Button.OPTIONS, options)
		super (options)

		this.$element = $(Button.TEMPLATE)
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