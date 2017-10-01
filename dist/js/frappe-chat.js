var frappe = (function () {
'use strict';

class Component {
	constructor (options) {
		this.options = Object.assign({ }, Component.OPTIONS, options);
	}

	mount  (selector = null) {
		this.render();
		
		var which    = selector ? selector : 'body';
		$(which).append(this.$element);
	}

	render ( ) {

	}
}
// constants
Component.POSITION = 
{
	   TOP: { LEFT: 'tl', RIGHT: 'tr' },
	BOTTOM: { LEFT: 'bl', RIGHT: 'br' }
};
Component.OPTIONS  = 
{
	color: 
	{
		primary: '#7575FF'
	}
};

class Button extends Component {
	constructor (options) {
		options		  = Object.assign({ }, Button.OPTIONS, options);
		super (options);

		this.$element = $(Button.TEMPLATE);
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

class DropDown extends Component {
	constructor (options) {
		options  	  = Object.assign({ }, DropDown.OPTIONS, options);
		super (options);

		this.button   = new Button();
	}

	init   ( ) {
		this.button.$element.addClass('dropdown-toggle');
		this.button.$element.attr('data-toggle', 'dropdown');

		this.$element = $(DropDown.TEMPLATE);
		
		this.button.mount(this.$element);
	}

	render ( ) {

	}
}
DropDown.OPTIONS  = 
{
	position: Component.POSITION.TOP.LEFT
};
DropDown.TEMPLATE = 
`
<div class="frappe-dropdown dropdown">
	<div class="dropdown-menu">

	</div>
</div>
`;

class FAB extends Button {
	constructor (options) {
		options = Object.assign({ }, FAB.OPTIONS, options);
		super (options);

		this.init();
	}

	init   ( ) {
		this.$element.css({
					width: this.options.size,
				   height: this.options.size,
		  'border-radius': '50%'
		});
	}

	render ( ) {
		
	}
}
FAB.OPTIONS     = 
{
		size: 56,
	    icon: 'glyphicon glyphicon-plus',
	toggable: false
};

class Widget extends Component {
	constructor (options) {
		options          = Object.assign({ }, Widget.OPTIONS, options);
		super (options);

		this.page        = new Widget.Page();
		this.dropdown    = new Widget.DropDown();

		this.$element    = $(Widget.TEMPLATE);
		
		this.dropdown.mount(this.$element);
	}

	render ( ) {
		
	}
}
Widget.OPTIONS   		 =
{
	
};
Widget.TEMPLATE  		 = 
`
<div class="frappe-chat">
	
</div>
`;

Widget.DropDown 		= class extends DropDown {
	constructor (options) {
		options         = Object.assign({ }, Widget.DropDown.OPTIONS, options);
		super (options);

		this.button     = new FAB();

		this.init();
	}
};
Widget.DropDown.OPTIONS = 
{

};

Widget.Page             = class extends Component {
	constructor (options) {
		options         = Object.assign({ }, Widget.Page.OPTIONS, options);
		super (options);
	}
};
Widget.Page.OPTIONS     = 
{

};

const chat  =  { };
chat.Widget = Widget;

const ui     = { };
ui.Component = Component;
ui.chat      = chat;

class Client {
	constructor (url, options) {
		this.url    = url;
		this.socket = io(url);
		this.widget = new ui.chat.Widget();
	}

	mount (selector = null) {
		this.widget.mount(selector);
	}

	on    (event, callback) {
		this.socket.on(event, callback);
	}
}

const Event     = { };
Event.CONNECT   = `${Event.NAMESPACE}.connect`;

const frappe = 
{
	Chat:
	{
		Client: Client,
		 Event: Event
	}
};

return frappe;

}());
