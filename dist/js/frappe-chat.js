var frappe = (function () {
'use strict';

class FrappeError extends Error       { }
class ImportError extends FrappeError { }

class Component {
	constructor (...options) {
		this.options = Object.assign({ }, Component.OPTIONS, ...options);
	}

	init   ( ) {
		
	}

	render ( ) {

	}

	click  (callback) {
		this.$element.click(callback);
	}

	mount  (selector = null) {
		this.render();
		
		var which    = selector ? selector : 'body';
		$(which).append(this.$element);
	}
}

Component.POSITION =
{
	   TOP: { LEFT: 'tl', RIGHT: 'tr' },
	BOTTOM: { LEFT: 'bl', RIGHT: 'br' }
};
Component.OPTIONS  =
{
	color: 
	{
		primary: '#7575FF',
		 accent: '#7575FF'
	}
};

class Button extends Component {
	constructor (...options) {
		super (Button.OPTIONS, ...options);

		this.$element = $(Button.TEMPLATE);
	}

	init   ( ) {
		super.init();

		if ( this.options.icon ) {
			if ( !this.$element.find('i').length ) {
				this.$element.append(`<i class="${this.options.icon}"/>`);
			}
		}
	}

	render ( ) {

	}
}

Button.OPTIONS		  = 
{

};
Button.TEMPLATE 	  = 
`
<button class="frappe-btn btn btn-default">
	
</button>
`;

class Form extends Component {
	constructor (...options) {
		super (Form.OPTIONS, ...options);
		
		this.$element = $(Form.TEMPLATE);

		this.init();
	}

	submit (callback) {
		this.$element.submit((event) => {
			if (!event.isDefaultPrevented() )
				 event.preventDefault();
				 
			callback(event);
		});
	}

	init   ( ) {
		
	}
}

Form.OPTIONS  = 
{

};
Form.TEMPLATE = 
`
<form>
	
</form>
`;

class List extends Component {
	constructor (...options) {
		super (List.OPTIONS, ...options);
	}
}

List.OPTIONS       = 
{

};
List.TEMPLATE      = 
`
<div class="list-group">

</div>
`;

List.Item          = class extends Component {
	constructor (...options) {
		super (List.Item.OPTIONS, ...options);
	}
};
List.Item.OPTIONS  = 
{

};
List.Item.TEMPLATE = 
`
<div class="list-group-item">

</div>
`;

class Tab extends Component {
	constructor (...options) {
		super (Tab.OPTIONS, ...options);
	}
}

Tab.TEMPLATE = 
`
<div>
	<div class="nav nav-pills">

	</div>
</div>
`;

class Panel extends Component {
	constructor (...options) {
		super (Panel.OPTIONS, ...options);

		this.$element = $(Panel.TEMPLATE);

		this.init();
	}

	init   ( ) {
		super.init();
		
		var $heading = this.$element.find('.panel-heading');

		if ( this.options.title ) {
			$heading.find('.panel-title').html(this.options.title);
		} else {
			$heading.hide();
		}

		if ( this.options.color ) {
			$heading.css({
				'background-color': this.options.color.primary,
						     color: '#FEFEFE'
			});
		}
	}

	render ( ) {
		
	}
}

Panel.OPTIONS  = 
{

};

Panel.TEMPLATE = 
`
<div class="panel panel-default">
	<div class="panel-heading">
		<div class="panel-title">
			
		</div>
	</div>
	<div class="panel-body">
		
	</div>
</div>
`;

class DropDown extends Component {
	constructor (...options) {
		super (DropDown.OPTIONS, ...options);

		this.$element = $(DropDown.TEMPLATE);
		this.button   = new Button({
			 icon: this.options.icon
		});
		this.panel    = new Panel({
			title: this.options.title,
			color: this.options.color
		});
	}

	init   ( ) {
		super.init();

		this.button.$element.addClass('dropdown-toggle');
		this.button.$element.attr('data-toggle', 'dropdown');

		var  $menu    = this.$element.find('.dropdown-menu');
		this.panel.mount($menu);

		$menu.css({
			'padding': 0,
			 'border': 0
		});

		$menu.click((e) => {
			e.stopPropagation();
		});

		this.panel.$element.css({
			 'margin': 0
		});

		this.position(this.options.position);
		
		this.button.mount(this.$element);
	}

	position (which) {
		const accepted = [
			DropDown.POSITION.TOP.LEFT,  DropDown.POSITION.BOTTOM.LEFT,
			DropDown.POSITION.TOP.RIGHT, DropDown.POSITION.BOTTOM.RIGHT
		];

		const tokens   = which.split('');
		if ( !accepted.includes(which) ) 
			throw TypeError(`Expected ${accepted}, got ${which} instead for value position.`)

		const css      = { };
		const $menu    = this.$element.find('.dropdown-menu');
		
		if ( tokens.includes('t') ) {
			css.top    = 0;
			this.$element.addClass('dropdown');
			$menu.css({
				   'margin-top': 8
			});
		}
		if ( tokens.includes('b') ) {
			css.bottom = 0;
			this.$element.addClass('dropup');
			$menu.css({
				'margin-bottom': 8
			});
		}

		if ( tokens.includes('l') ) {
			css.left   = 0;
			$menu.addClass('dropdown-menu-left');
		}
		if ( tokens.includes('r') ) {
			css.right  = 0;
			$menu.addClass('dropdown-menu-right');
		}

		this.$element.css(css);
	}

	isOpen ( ) {
		const isOpen =  this.$element.hasClass('open');

		return isOpen
	}

	render ( ) {

	}
}
DropDown.POSITION = Component.POSITION;
DropDown.OPTIONS  = 
{
	position: DropDown.POSITION.TOP.LEFT
};
DropDown.TEMPLATE = 
`
<div class="frappe-dropdown">
	<div class="dropdown-menu">
		
	</div>
</div>
`;

class FAB extends Button {
	constructor (...options) {
		super (FAB.OPTIONS, ...options);

		this.init();
	}

	init   ( ) {
		super.init();
	
		this.$element.css({
					width: this.options.size,
				   height: this.options.size,
		  'border-radius': '50%',
		  	 'box-shadow': '0px 3px 6px 0px rgba(0,0,0,.25)'
		});

		if ( this.options.color ) {
			this.$element.css({
				'background-color': this.options.color.accent,
						     color: '#FEFEFE'
			});
		}

		if ( this.options.toggable ) {
			const $icon = this.$element.find('i');

			this.$element.click(() => {
				$icon.toggleClass(`${this.options.icon}`);
				$icon.toggleClass("glyphicon glyphicon-remove");
			});
		}
	}

	render ( ) {
		
	}

	position (which) {
		const accepted = [
			FAB.POSITION.TOP.LEFT,  FAB.POSITION.BOTTOM.LEFT,
			FAB.POSITION.TOP.RIGHT, FAB.POSITION.BOTTOM.RIGHT
		];

		const tokens   = which.split('');
		if ( !accepted.includes(which) ) 
			throw TypeError(`Expected ${accepted}, got ${which} instead for value position.`)

		const css      = { position: 'absolute' };
		
		if ( tokens.includes('t') ) {
			css.top    = 0;
			this.$element.css({
				   'margin-top': 8
			});
		}
		if ( tokens.includes('b') ) {
			css.bottom = 0;
			this.$element.css({
				'margin-bottom': 8
			});
		}

		if ( tokens.includes('l') ) {
			css.left   = 0;
			this.$element.css({
				  'margin-left': 8
			});
		}
		if ( tokens.includes('r') ) {
			css.right  = 0;
			this.$element.css({
				 'margin-right': 8
			});
		}

		this.$element.css(css);
	}
}

FAB.POSITION    = Component.POSITION;
FAB.OPTIONS     = 
{
		size: 56,
	    icon: 'glyphicon glyphicon-plus',
	toggable: false
};

class EmojiPicker extends DropDown {
	constructor (...options) {
		super (EmojiPicker.OPTIONS, ...options);

		this.init();
	}

	init ( ) {
		super.init();
	}
}

EmojiPicker.OPTIONS  = 
{
	icon: 'glyphicon glyphicon-thumbs-up'
};

class Page extends Component {
	constructor (...options) {
		super (Page.OPTIONS, ...options);

		this.$element = $(Page.TEMPLATE);

		this.init();
	}

	init ( ) {
		super.init();

		const className = `container${this.options.fluid ? '-fluid' : ''}`;
		this.$element.addClass(className);
	}
}

Page.OPTIONS  = 
{
	fluid: false
};

Page.TEMPLATE = 
`
<div>

</div>
`;

class Widget extends Component {
	constructor (...options) {
		super (Widget.OPTIONS, ...options);

		this.$element   = $(Widget.TEMPLATE);
		this.dropdown   = new Widget.DropDown({
			color: this.options.color
		});

		this.init();
	}

	init   ( ) {
		super.init();
		
		this.dropdown.mount(this.$element);
	}

	render ( ) {
		
	}
}
Widget.LAYOUT           =
{
	COLLAPSIBLE: 'collapsible'
};
Widget.OPTIONS   		=
{
		 layout: Widget.LAYOUT.COLLAPSIBLE
};
Widget.TEMPLATE  		= 
`
<div class="frappe-chat">
	
</div>
`;

Widget.DropDown 		= class extends DropDown {
	constructor (...options) {
		super (Widget.DropDown.OPTIONS, ...options);

		this.button     = new FAB({
				icon: 'glyphicon glyphicon-comment',
			toggable: true
		});
		this.fab        = new FAB({
				size: 48,
				icon: 'glyphicon glyphicon-pencil'
		});
		this.fab.position(FAB.POSITION.BOTTOM.RIGHT);

		this.init();
	}

	init ( ) {
		super.init();

		this.$element.css({
			position: 'absolute',
			  margin: 20
		});

		this.panel.$element.find('.panel-body').append(this.fab.$element);
	}
};
Widget.DropDown.OPTIONS =
{
	position: DropDown.POSITION.BOTTOM.RIGHT,
	   title: 
	   `
		<div class="text-center">
			<h5>Chat</h5>
		</div>
		`
};

Widget.Page             = class extends Page {
	constructor (...options) {
		super (Widget.Page.OPTIONS, ...options);
	}
};
Widget.Page.OPTIONS     = 
{
	
};

const chat  =  { };
chat.Widget = Widget;

const ui       = { };

ui.Component   = Component;

ui.Button      = Button;
ui.Form        = Form;
ui.List        = List;
ui.Tab         = Tab;
ui.Panel       = Panel;
ui.DropDown    = DropDown;

ui.FAB         = FAB;
ui.EmojiPicker = EmojiPicker;
ui.chat        = chat;

class Client {
	constructor (url = null, options = { }) {
		this.url     = url;
		this.options = Object.assign({ }, Client.OPTIONS, options);

		this.socket  = io(url);
		
		this.widget  = new ui.chat.Widget({
			layout: this.options.layout,
			 color: this.options.color
		});
	}

	mount (selector = null) {
		this.widget.mount(selector);
	}

	on    (event, callback) {
		this.socket.on(event, callback);
	}
}
Client.LAYOUT  = ui.chat.Widget.LAYOUT;
Client.OPTIONS = 
{
	layout: Client.LAYOUT.COLLAPSIBLE,
	 color: 
	 {
		primary: '#7575FF',
		 accent: '#7575FF'
	 }
};

const NAMESPACE = 'frappe.chat.event';

const Event     = { };
Event.CONNECT   = `${NAMESPACE}.connect`;

if ( typeof $  === 'undefined' )
	throw new ImportError(`Frappé Chat requires jQuery. Kindly include jQuery before using Frappé Chat.`)

if ( typeof io === 'undefined' )
	throw new ImportError(`Frappé Chat requires the Socket.IO Client API. Visit https://socket.io to know more.`)

const frappe = 
{
	Chat:
	{
		Client: Client,
		 Event: Event
	}, ui: ui
};

return frappe;

}());
