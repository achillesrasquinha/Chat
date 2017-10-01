import Component from '../Component'
import DropDown  from '../base/DropDown'
import FAB       from '../FAB'

class Widget extends Component {
	constructor (options) {
		options          = Object.assign({ }, Widget.OPTIONS, options)
		super (options)

		this.page        = new Widget.Page()
		this.dropdown    = new Widget.DropDown()

		this.$element    = $(Widget.TEMPLATE)
		
		this.dropdown.mount(this.$element)
	}

	render ( ) {
		
	}
}
Widget.OPTIONS   		 =
{
	
}
Widget.TEMPLATE  		 = 
`
<div class="frappe-chat">
	
</div>
`

Widget.DropDown 		= class extends DropDown {
	constructor (options) {
		options         = Object.assign({ }, Widget.DropDown.OPTIONS, options)
		super (options)

		this.button     = new FAB()

		this.init()
	}
}
Widget.DropDown.OPTIONS = 
{

}

Widget.Page             = class extends Component {
	constructor (options) {
		options         = Object.assign({ }, Widget.Page.OPTIONS, options)
		super (options)
	}
}
Widget.Page.OPTIONS     = 
{

}

export default Widget