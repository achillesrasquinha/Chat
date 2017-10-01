import ui from './ui'

class Client {
	constructor (url, options) {
		// TODO - validate arguments

		this.url    = url
		this.socket = io(url)
		this.widget = new ui.chat.Widget()
	}

	mount (selector = null) {
		this.widget.mount(selector)
	}

	on    (event, callback) {
		// TODO - validate arguments
		// TODO - validate event
		
		this.socket.on(event, callback)
	}
}

export default Client