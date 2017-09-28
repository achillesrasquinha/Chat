import ui from './ui';

class Chat
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, Chat.OPTIONS, options)
		this.$element = $(Chat.TEMPLATE)
		this.$element.hide()

		this.position(this.options.position)

		this.fab      = new ui.FAB({
			color: this.options.color,
			 icon: 'glyphicon glyphicon-comment'
		});
		this.fab.$element.addClass('dropdown-toggle')
		this.fab.$element.attr('data-toggle', 'dropdown')
		this.fab.click(() => {
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

	position (which)
	{
		var css        = 
		{
			position: 'absolute',
			  margin: this.options.margin
		}
		var $menu      = this.$element.find('.dropdown-menu')

		var tokens     = which.split('')
		if ( tokens.includes('t') )
		{
			css.top    = 0
			this.$element.addClass('dropdown')
		}
		if ( tokens.includes('b') )
		{
			css.bottom = 0
			this.$element.addClass('dropup')
		}
		if ( tokens.includes('l') )
		{
			css.left   = 0

			$menu.addClass('dropdown-menu-left')
		}
		if ( tokens.includes('r') )
		{
			css.right  = 0
			$menu.addClass('dropdown-menu-right')
		}

		this.$element.css(css)
	}

	fuel (data)
	{
		this.chatBox.fuel(data)
	}

	show ( )
	{
		this.$element.show()
	}
}
Chat.POSITION = { TOP: { LEFT: 'tl', RIGHT: 'tr' }, BOTTOM: { LEFT: 'bl', RIGHT: 'br' } }
Chat.OPTIONS  = 
{
	position: Chat.POSITION.BOTTOM.RIGHT,
	  margin: 20,
	   color:
	   {
		   primary: '#7575FF'
	   }
}
Chat.TEMPLATE = 
`
<div class="frappe-chat">
	<div class="dropdown-menu" style=
	"
		margin-bottom: 12px;
			  padding: 0    !important;
			   border: none !important
	">
		
	</div>
</div>
`

export default Chat