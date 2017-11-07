import ui from './ui'

class Client {
	constructor (url = null, options = { }) {
		this.url     = url
		this.options = Object.assign({ }, Client.OPTIONS, options)

		this.socket  = io(url)
		
		this.widget  = new ui.chat.Widget({
			layout: this.options.layout,
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
Client.LAYOUT  = ui.chat.Widget.LAYOUT
Client.OPTIONS = 
{
	layout: Client.LAYOUT.COLLAPSIBLE,
	 color: 
	 {
		primary: '#7575FF',
		 accent: '#7575FF'
	 }
}

export default Client