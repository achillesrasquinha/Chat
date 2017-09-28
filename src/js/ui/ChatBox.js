import FAB        from './FAB'
import SearchBar  from './SearchBar'
import ChatList   from './ChatList'
import ChatWindow from './ChatWindow'

class ChatBox
{
	constructor (options = { })
	{
		this.options    = Object.assign({ }, ChatBox.OPTIONS, options)
		this.$element   = $(ChatBox.TEMPLATE)

		this.$heading   = this.$element.find('.frappe-chatbox-heading')
		this.$heading.css({
			'background-color': this.options.color.primary,
					   'color': '#FEFEFE' // TODO: This should detect by itself.
		})

		this.$title     = this.$element.find('.frappe-chatbox-title')
		this.$title.html(this.options.title)

		this.searchBar  = new SearchBar({ color: this.options.color, autofocus: true })
		this.fab        = new FAB({
			size: 56,
		   color: this.options.color
	   })
	   this.fab.$element.css({
		   position: 'absolute',
			 bottom: 0,
			  right: 0,
			 margin: 20
	   })

		this.chatList   = new ChatList()
		this.chatWindow = new ChatWindow()

		this.$element.find('.panel-body').append(this.searchBar.$element)
		this.$element.append(this.chatList.$element)
		this.$element.append(this.fab.$element)
		this.$element.append(this.chatWindow.$element)

		this.chatWindow.hide()
	}

	open (name)
	{
		this.$title.html(name)

		this.searchBar.hide(); this.chatList.hide(); this.fab.hide();
		this.chatWindow.show();
	}

	fuel (data)
	{
		this.chatList.fuel(data)

		this.searchBar.change((query) => {
			this.chatList.snip((item) => {
				if ( query )
				{
					var name    = item.$heading.html()
					
					// warning: fuzzy matching code ahead (or it looks like).
					var tokens  = name.split(' ')
					var matched = false
					for (var i  = 0 ; i < tokens.length ; ++i)
						if ( tokens[i].toLowerCase().includes(query.toLowerCase()) )
						{
							matched = true
							break
						}
					// end
	
					return !matched
				} else {
					return false
				}
			});
		})

		this.chatList.click((item) => {
			var name = item.$heading.html()
			this.open(name)
		})
	}
}
ChatBox.OPTIONS  =
{
	color:
	{
		primary: '#7575FF'
	},
	title: 'Chats'
}
ChatBox.TEMPLATE =
`
<div class="panel panel-default" style=
	"
		    margin: 0 !important;
		 min-width: 400px;
		min-height: 600px;
	">
	<div class="frappe-chatbox-heading panel-heading">
		<div class="panel-title">
			<div class="text-center">
				<h5 class="frappe-chatbox-title"/>
			</div>
		</div>
	</div>
	<div class="panel-body">

	</div>
</div>
`;

export default ChatBox