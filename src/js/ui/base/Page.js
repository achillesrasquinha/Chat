import Component from '../Component'

class Page extends Component {
	constructor (...options) {
		super (Page.OPTIONS, ...options)

		this.$element = $(Page.TEMPLATE)

		this.init()
	}

	init ( ) {
		super.init()

		const className = `container${this.options.fluid ? '-fluid' : ''}`
		this.$element.addClass(className)
	}
}

Page.OPTIONS  = 
{
	fluid: false
}

Page.TEMPLATE = 
`
<div>

</div>
`

export default Page