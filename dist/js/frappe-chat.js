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
			width: 64, height: 64
		});
		this.$element.css({
			// position: 'absolute',
			  bottom: 0,
			   right: 0,
			  margin: 20
		});
	}

	click (callback)
	{
		this.$element.click(callback);
	}
}
FAB.OPTIONS  =
{
	color:
	{
		primary: '#7575FF'
	}
};
FAB.TEMPLATE = 
`
<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
	<i class="glyphicon glyphicon-plus"/>
</button>
`;

class ChatBox
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, ChatBox.OPTIONS, options);
		this.$element = $(ChatBox.TEMPLATE);

		this.$heading = this.$element.find('.frappe-chatbox-heading');
		this.$heading.css({
			'background-color': this.options.color.primary,
					   'color': '#FEFEFE' // TODO: This should detect by itself.
		});

		this.$title   = this.$element.find('.frappe-chatbox-title');
		this.$title.html(this.options.title);
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
	ChatBox: ChatBox
};

class Chat
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, Chat.OPTIONS, options);
		this.$element = $(Chat.TEMPLATE);
		this.$element.hide();

		this.$fab     = new ui.FAB({
			color: this.options.color
		});
		this.$chatbox = new ui.ChatBox({
			color: this.options.color
		});

		this.$element.prepend(this.$fab.$element);
		this.$element.find('.dropdown-menu').append(this.$chatbox.$element);

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
<div class="dropdown">
	<div class="dropdown-menu dropdown-menu-left" style=
	"
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
