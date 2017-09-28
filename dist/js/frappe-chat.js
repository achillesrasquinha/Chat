var frappe = (function () {
'use strict';

class FAB
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, FAB.OPTIONS, options);
		this.$element = $(FAB.TEMPLATE);

		this.$element.css({
		  	   'border-radius': '50%',
			'background-color': this.options.color.primary,
					   'color': '#FEFEFE', // TODO: This should detect based on color.primary
			      'box-shadow': '0px 0px 12px 3px rgba(0,0,0,0.25)'
		});
		this.$element.css({
			width: this.options.size, height: this.options.size
		});

		this.$icon    = this.$element.find('.fab-icon');
		this.$icon.addClass(this.options.icon);
	}

	show ( )
	{
		this.$element.show();
	}

	hide ( )
	{
		this.$element.hide();
	}

	click (callback)
	{
		this.$element.click(callback);
	}
}
FAB.OPTIONS  =
{
	 size: 64,
	color:
	{
		primary: '#7575FF'
	},
	 icon: 'glyphicon glyphicon-plus'
};
FAB.TEMPLATE = 
`
<button class="btn btn-default">
	<i class="fab-icon"/>
</button>
`;

class SearchBar
{
	constructor (options = { })
	{
		this.options    = Object.assign({ }, SearchBar.OPTIONS, options);
		this.$element   = $(SearchBar.TEMPLATE);

		this.$element.find('.input-group-addon').css({
			color: this.options.color.primary
		});

		this.$input     = this.$element.find('.frappe-chat-searchbar-input');
		this.$input.attr('autofocus', this.options.autofocus);

		this.prevQuery  = this.$input.val();

		this.$element.submit((event) => {
			if (!event.isDefaultPrevented())
				 event.preventDefault();
		});
	}

	show ( )
	{
		this.$element.show();
	}

	hide ( )
	{
		this.$element.hide();
	}

	change (callback)
	{
		this.$input.on('change keyup paste', () => {
			const curQuery  = this.$input.val();
			if ( curQuery !== this.prevQuery )
			{
				this.prevQuery = curQuery;

				callback(curQuery);
			}
				
		});
	}

	submit (callback)
	{
		this.$element.submit((event) => {
			const curQuery  = this.$input.val();

			callback(curQuery);
		});
	}
}
SearchBar.OPTIONS       = 
{
	color:
	{
		primary: '#7575FF'
	},
	autofocus: false
};
SearchBar.TEMPLATE      = 
`
<form>
	<div class="input-group">
		<div class="input-group-addon">
			<i class="glyphicon glyphicon-search"/>
		</div>
		<input
			class="frappe-chat-searchbar-input form-control"
			placeholder="Search conversations..."/>
	</div>
</form>
`;

class ChatList
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, ChatList.OPTIONS, options);
		this.$element = $(ChatList.TEMPLATE);
		this.items    = Array();
	}

	fuel  (data)
	{
		data.users.forEach((user) => {
			var item   = new ChatList.Item();
			item.fuel(user);

			this.$element.append(item.$element);
			this.items.push(item);
		});
	}

	snip  (callback)
	{
		this.items.forEach((item) => {
			if ( callback(item) )
				item.hide();
			else
				item.show();
		});
	}

	show ( )
	{
		this.$element.show();
	}

	hide ( )
	{
		this.$element.hide();
	}

	click (callback)
	{
		this.items.forEach((item) => item.click(() => callback(item)));
	}
}
ChatList.OPTIONS       = 
{
	color:
	{
		primary: '#7575FF'
	}
};
ChatList.TEMPLATE      = 
`
<div class="list-group" style=
"	
	max-height: 475px;
	overflow-y: scroll
">	
</div>
`;

ChatList.Item          = class
{
	constructor (options = { })
	{
		this.options   = Object.assign({ }, ChatList.Item.OPTIONS, options);
		this.$element  = $(ChatList.Item.TEMPLATE);

		this.$heading  = this.$element.find('.frappe-chat-list-item-heading');
		this.$avatar   = this.$element.find('.frappe-chat-list-item-avatar');
	}

	fuel (data)
	{
		const { name, avatar } = data;

		this.$heading.html(name);
		this.$avatar .attr('src', avatar);
	}

	show ( )
	{
		this.$element.show();
	}

	hide ( )
	{
		this.$element.hide();
	}

	click (callback)
	{
		this.$element.click(callback);
	}
};
ChatList.Item.OPTIONS  = 
{

};
ChatList.Item.TEMPLATE = 
`
<div class="list-group-item">
	<a href="javascript:void(0);">
		<div class="row">
			<div class="col-xs-3">
				<div class="text-center">
					<img class="frappe-chat-list-item-avatar img-responsive img-circle img-thumbnail" height="48"/>
				</div>
			</div>
			<div class="col-xs-9">
				<h5 class="frappe-chat-list-item-heading"/>
			</div>
		</div>
	</a>
</div>
`;

class ChatForm
{
	constructor (options = { })
	{
		this.options   = Object.assign({ }, ChatForm.OPTIONS, options);
		this.$element  = $(ChatForm.TEMPLATE);

		this.$input    = this.$element.find('.frappe-chat-form-input');
		this.$element.find('.frappe-chat-form-send').css({
			'background-color': this.options.color.primary,
					   'color': '#FEFEFE' // TODO: This should be autodetected.
		});
	}

	submit (callback)
	{
		this.$element.submit((event) => {
			if (!event.isDefaultPrevented() )
				 event.preventDefault();

			const value  = this.$input.val();
			if ( value !== "" )
			{
				const message = { content: value };
				
				callback(message);

				this.$input.val("");
			}
		});
	}
}
ChatForm.OPTIONS  =
{
	color:
	{
		primary: '#7575FF'
	}
};
ChatForm.TEMPLATE = 
`
<form>
	<div class="input-group">
		<div class="frappe-chat-form-emoji input-group-btn">
			
		</div>
		<input
			class="frappe-chat-form-input form-control"
			placeholder="Type a message..."/>
		<div class="input-group-btn">
			<button class="frappe-chat-form-send btn btn-default">
				<i class="glyphicon glyphicon-send"/>
			</button>
		</div>
	</div>
</form>
`;

class ChatWindow
{
	constructor (options = { })
	{
		this.options   = Object.assign({ }, ChatWindow.OPTIONS, options);
		this.$element  = $(ChatWindow.TEMPLATE);

		this.chatform  = new ChatForm({
			color: this.options.color
		});
		this.chatform.$element.css({
			position: 'absolute',
			  bottom: 0,
			  margin: 20
		});
		this.chatform.submit((message) => {
			console.log(message);
		});

		this.$element.append(this.chatform.$element);
	}

	show ( )
	{
		this.$element.show();
	}

	hide ( )
	{
		this.$element.hide();
	}
}
ChatWindow.OPTIONS     = 
{
	color:
	{
		primary: '#7575FF'
	}
};
ChatWindow.TEMPLATE    = 
`
<div class="frappe-chat-window">
	
</div>
`;

class ChatBox
{
	constructor (options = { })
	{
		this.options    = Object.assign({ }, ChatBox.OPTIONS, options);
		this.$element   = $(ChatBox.TEMPLATE);

		this.$heading   = this.$element.find('.frappe-chatbox-heading');
		this.$heading.css({
			'background-color': this.options.color.primary,
					   'color': '#FEFEFE' // TODO: This should detect by itself.
		});

		this.$title     = this.$element.find('.frappe-chatbox-title');
		this.$title.html(this.options.title);

		this.searchBar  = new SearchBar({ color: this.options.color, autofocus: true });
		this.fab        = new FAB({
			size: 56,
		   color: this.options.color
	   });
	   this.fab.$element.css({
		   position: 'absolute',
			 bottom: 0,
			  right: 0,
			 margin: 20
	   });

		this.chatList   = new ChatList();
		this.chatWindow = new ChatWindow();

		this.$element.find('.panel-body').append(this.searchBar.$element);
		this.$element.append(this.chatList.$element);
		this.$element.append(this.fab.$element);
		this.$element.append(this.chatWindow.$element);

		this.chatWindow.hide();
	}

	open (name)
	{
		this.$title.html(name);

		this.searchBar.hide(); this.chatList.hide(); this.fab.hide();
		this.chatWindow.show();
	}

	fuel (data)
	{
		this.chatList.fuel(data);

		this.searchBar.change((query) => {
			this.chatList.snip((item) => {
				if ( query )
				{
					var name    = item.$heading.html();
					
					// warning: fuzzy matching code ahead (or it looks like).
					var tokens  = name.split(' ');
					var matched = false;
					for (var i  = 0 ; i < tokens.length ; ++i)
						if ( tokens[i].toLowerCase().includes(query.toLowerCase()) )
						{
							matched = true;
							break
						}
					// end
	
					return !matched
				} else {
					return false
				}
			});
		});

		this.chatList.click((item) => {
			var name = item.$heading.html();
			this.open(name);
		});
	}
}
ChatBox.OPTIONS  =
{
	color:
	{
		primary: '#7575FF'
	},
	title: 'Chats'
};
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

const ui = 
{
	      FAB: FAB,
	SearchBar: SearchBar,
	  ChatBox: ChatBox,
};

class Chat
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, Chat.OPTIONS, options);
		this.$element = $(Chat.TEMPLATE);

		this.position(Chat.POSITION.BOTTOM_RIGHT);

		this.$element.css({
			position: 'absolute',
			  bottom: 0,
			   right: 0,
			  margin: 20
		});
		this.$element.hide();

		this.fab      = new ui.FAB({
			color: this.options.color,
			 icon: 'glyphicon glyphicon-comment'
		});
		this.fab.$element.addClass('dropdown-toggle');
		this.fab.$element.attr('data-toggle', 'dropdown');
		this.fab.click(() => {
			this.fab.$icon.toggleClass('glyphicon-comment');
			this.fab.$icon.toggleClass('glyphicon-remove');
		});

		this.chatBox  = new ui.ChatBox({
			color: this.options.color
		});

		this.$element.prepend(this.fab.$element);
		this.$element.find('.dropdown-menu').append(this.chatBox.$element);
		this.$element.find('.dropdown-menu').click((event) => event.stopPropagation());

		$('body').append(this.$element);
	}

	fuel (data)
	{
		this.chatBox.fuel(data);
	}

	show ( )
	{
		this.$element.show();
	}
}
Chat.POSITION = { BOTTOM_RIGHT: 'br' };
Chat.OPTIONS  = 
{
	position: Chat.POSITION.BOTTOM_RIGHT,
	   color:
	   {
		   primary: '#7575FF'
	   }
};
Chat.TEMPLATE = 
`
<div class="frappe-chat">
	<div class="dropup">
		<div class="dropdown-menu dropdown-menu-right" style=
		"
			margin-bottom: 12px;
				padding: 0    !important;
				border: none !important
		">
			
		</div>
	</div>
</div>
`;

const frappe = 
{
	Chat: Chat
};

return frappe;

}());
