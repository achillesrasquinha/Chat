import ui from './ui'

class Client {
	constructor (url, options) {
		this.options = Object.assign({ }, Client.OPTIONS, options)

		this.url     = new URL(url)
		this.socket  = io(url)
		this.widget  = new ui.chat.Widget({
			color: this.options.color
		})
	}

	mount (selector = null) {
		this.widget.mount(selector)
	}

	on    (event, callback) {
		this.socket.on(event, callback)
	}
}
Client.OPTIONS = 
{
	color: 
	{
		primary: '#3F51B5',
		 accent: '#E91E63'
	}
}

export default Client