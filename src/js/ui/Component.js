class Component {
	constructor (options) {
		this.options = Object.assign({ }, Component.OPTIONS, options)
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
// constants
Component.POSITION = 
{
	   TOP: { LEFT: 'tl', RIGHT: 'tr' },
	BOTTOM: { LEFT: 'bl', RIGHT: 'br' }
}
Component.OPTIONS  = 
{
	color: 
	{
		primary: '#7575FF'
	}
}

export default Component