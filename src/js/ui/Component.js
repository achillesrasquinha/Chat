class Component {
	constructor (...options) {
		this.options = Object.assign({ }, Component.OPTIONS, ...options)
	}

	init   ( ) {
		
	}

	render ( ) {

	}

	click  (callback) {
		this.$element.click(callback)
	}

	mount  (selector = null) {
		this.render()
		
		var which    = selector ? selector : 'body'
		$(which).append(this.$element)
	}
}

Component.POSITION = 
{
	   TOP: { LEFT: 'tl', RIGHT: 'tr' },
	BOTTOM: { LEFT: 'bl', RIGHT: 'br' }
}
Component.OPTIONS  = 
{
	color: 
	{
		primary: '#3F51B5',
		 accent: '#E91E63'
	}
}

export default Component