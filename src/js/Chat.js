import ui from './ui';

class Chat
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, Chat.OPTIONS, options)
		this.$element = $(Chat.TEMPLATE)
		this.$element.css({
			position: 'absolute',
			  bottom: 0,
			   right: 0,
			  margin: 20
		})
		this.$element.hide()

		this.fab      = new ui.FAB({
			color: this.options.color,
			 icon: 'glyphicon glyphicon-comment'
		});
		this.fab.$element.addClass('dropdown-toggle')
		this.fab.$element.attr('data-toggle', 'dropdown')
		this.fab.$element.click(() => {
			this.fab.$icon.toggleClass('glyphicon-comment')
			this.fab.$icon.toggleClass('glyphicon-remove')
		})

		this.chatBox  = new ui.ChatBox({
			color: this.options.color
		});

		this.$element.prepend(this.fab.$element)
		this.$element.find('.dropdown-menu').append(this.chatBox.$element)
		this.$element.find('.dropdown-menu').click((event) => event.stopPropagation())

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
<div class="frappe-chat dropup">
	<div class="dropdown-menu dropdown-menu-right" style=
	"
		margin-bottom: 12px;
		      padding: 0    !important;
		       border: none !important
	">
		
	</div>
</div>
`

export default Chat