import Component from '../Component'
import DropDown  from '../base/DropDown'
import Page      from '../base/Page'
import FAB       from '../FAB'

class Widget extends Component {
	constructor (...options) {
		super (Widget.OPTIONS, ...options)

		this.$element   = $(Widget.TEMPLATE)
		this.dropdown   = new Widget.DropDown({
			color: this.options.color
		})

		this.init()
	}

	init   ( ) {
		super.init()
		
		this.dropdown.mount(this.$element)
	}

	render ( ) {
		
	}
}
Widget.LAYOUT           =
{
	COLLAPSIBLE: 'collapsible'
}
Widget.OPTIONS   		=
{
		 layout: Widget.LAYOUT.COLLAPSIBLE
}
Widget.TEMPLATE  		= 
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
		this.fab        = new FAB({
				size: 48,
				icon: 'glyphicon glyphicon-pencil'
		})
		this.fab.position(FAB.POSITION.BOTTOM.RIGHT)

		this.init()
	}

	init ( ) {
		super.init()

		this.$element.css({
			position: 'absolute',
			  margin: 20
		})

		this.panel.$element.find('.panel-body').append(this.fab.$element)
	}
}
Widget.DropDown.OPTIONS =
{
	position: DropDown.POSITION.BOTTOM.RIGHT,
	   title: 
	   `
		<div class="text-center">
			<h5>Chat</h5>
		</div>
		`
}

Widget.Page             = class extends Page {
	constructor (...options) {
		super (Widget.Page.OPTIONS, ...options)
	}
}
Widget.Page.OPTIONS     = 
{
	
}

export default Widget