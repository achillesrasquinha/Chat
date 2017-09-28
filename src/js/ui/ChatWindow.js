import ChatForm from './ChatForm'

class ChatWindow
{
	constructor (options = { })
	{
		this.options   = Object.assign({ }, ChatWindow.OPTIONS, options)
		this.$element  = $(ChatWindow.TEMPLATE)

		this.chatform  = new ChatForm({
			color: this.options.color
		})
		this.chatform.$element.css({
			position: 'absolute',
			  bottom: 0,
			  margin: 20
		})
		this.chatform.submit((message) => {
			console.log(message)
		})

		this.$element.append(this.chatform.$element)
	}

	show ( )
	{
		this.$element.show()
	}

	hide ( )
	{
		this.$element.hide()
	}
}
ChatWindow.OPTIONS     = 
{
	color:
	{
		primary: '#7575FF'
	}
}
ChatWindow.TEMPLATE    = 
`
<div class="frappe-chat-window">
	
</div>
`

export default ChatWindow