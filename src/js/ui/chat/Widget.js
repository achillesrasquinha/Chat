import Component from '../Component'
import DropDown  from '../base/DropDown'
import FAB       from '../FAB'

class Widget extends Component {
	constructor (...options) {
		super (Widget.OPTIONS, ...options)

		this.$element    = $(Widget.TEMPLATE)
		this.dropdown    = new Widget.DropDown()

		this.init()
	}

	init   ( ) {
		super.init()
		
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
	constructor (...options) {
		super (Widget.DropDown.OPTIONS, ...options)

		this.button     = new FAB({
			    icon: 'glyphicon glyphicon-comment',
			toggable: true
		})

		this.init()
	}

	init ( ) {
		super.init()

		this.$element.css({
			position: 'absolute',
			  margin: 20
		})
	}
}
Widget.DropDown.OPTIONS = 
{
	position: Component.POSITION.BOTTOM.RIGHT,
	   title: 
	   `
		<div class="text-center">
			<h5>Chat</h5>
		</div>
		`
}

export default Widget