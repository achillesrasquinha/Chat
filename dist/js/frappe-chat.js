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
		
		this.fab      = new FAB({
			 size: 56,
			color: this.options.color
		});
		this.fab.$element.css({
			position: 'absolute',
			  bottom: 0,
			   right: 0,
			  margin: 20
		});

		this.$element.append(this.fab.$element);
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
<div class="list-group">
	
</div>
`;

ChatList.Item          = class
{
	constructor (options = { })
	{
		this.options   = Object.assign({ }, ChatList.Item.OPTIONS, options);
		this.$element  = $(ChatList.Item.TEMPLATE);
	}
};
ChatList.Item.OPTIONS  = 
{

};
ChatList.Item.TEMPLATE = 
`
<div class="list-group-item">

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
		this.chatList   = new ChatList();

		this.$element.find('.panel-body').append(this.searchBar.$element);
		this.$element.append(this.chatList.$element);

		this.searchBar.change((query) => {
			console.log(query);
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
		this.fab.$element.click(() => {
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

	show ( )
	{
		this.$element.show();
	}
}
Chat.OPTIONS  = 
{
	color:
	{
		primary: '#7575FF'
	}
};
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
`;

const frappe = 
{
	Chat: Chat
};

return frappe;

}());
