import Component from '../Component'

class Form extends Component {
	constructor (options) {
		options 	  = Object.assign({ }, Form.OPTIONS, options)
		super (options)
		
		this.$element = $(Form.TEMPLATE)

		this.init()
	}

	submit (callback) {
		this.$element.submit((event) => {
			if (!event.isDefaultPrevented() )
				 event.preventDefault()
				 
			callback(event)
		})
	}

	init   ( ) {
		
	}
}
Form.TEMPLATE = 
`
<form>
	
</form>
`

export default Form