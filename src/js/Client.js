import ui from './ui'

class Client {
	constructor (url, options) {
		this.url    = url
		this.socket = io(url)
		this.widget = new ui.chat.Widget()
	}

	mount (selector = null) {
		this.widget.mount(selector)
	}

	on    (event, callback) {
		this.socket.on(event, callback)
	}
}

export default Client