import ui from './ui';

class Chat
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, Chat.OPTIONS, options)
		this.$element = $(Chat.TEMPLATE)
		this.$element.hide()

		this.$fab     = new ui.FAB({
			color: this.options.color
		});
		this.$chatbox = new ui.ChatBox({
			color: this.options.color
		});

		this.$element.prepend(this.$fab.$element)
		this.$element.find('.dropdown-menu').append(this.$chatbox.$element)

		$('body').append(this.$element)
	}

	show ( )
	{
		this.$element.show()
	}
}
Chat.OPTIONS  = 
{
	color:
	{
		primary: '#7575FF'
	}
}
Chat.TEMPLATE = 
`
<div class="dropdown">
	<div class="dropdown-menu dropdown-menu-left" style=
	"
		padding: 0    !important;
		 border: none !important
	">
		
	</div>
</div>
`

export default Chat