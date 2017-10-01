var frappe = (function () {
'use strict';

class Component {
	constructor (options) {
		this.options = Object.assign({ }, Component.OPTIONS, options);
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

class Panel extends Component {
	constructor (options) {
		options = Object.assign({ }, Panel.OPTIONS, options);
		super (options);

		this.init();
	}

	init   ( ) {
		this.$element = $(Panel.TEMPLATE);
		
		var $heading = this.$element.find('.panel-heading');
		var $title   = this.$element.find('.panel-title');

		if ( this.options.title ) {
			$heading.find('.panel-title').html(this.options.title);
		} else {
			$heading.hide();
		}

		if ( this.options.color ) {
			$heading.css({
				'background-color': this.options.color.primary,
						     color: '#FEFEFE' // TODO: Automatically detect
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
	constructor (options) {
		options  	  = Object.assign({ }, DropDown.OPTIONS, options);
		super (options);

		this.button   = new Button();
		this.panel    = new Panel({
			title: this.options.title
		});
	}

	init   ( ) {
		this.button.$element.addClass('dropdown-toggle');
		this.button.$element.attr('data-toggle', 'dropdown');

		this.$element = $(DropDown.TEMPLATE);
		var  $menu    = this.$element.find('.dropdown-menu');
		this.panel.mount($menu);

		$menu.css({
			'padding': 0,
			 'border': 0
		});

		this.panel.$element.css({
			 'margin': 0
		});

		this.position(this.options.position);
		
		this.button.mount(this.$element);
	}

	position (which) {
		const accepted = [
			Component.POSITION.TOP.LEFT,  Component.POSITION.BOTTOM.LEFT,
			Component.POSITION.TOP.RIGHT, Component.POSITION.BOTTOM.RIGHT
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

	render ( ) {

	}
}
DropDown.OPTIONS  = 
{
	position: Component.POSITION.TOP.LEFT
};
DropDown.TEMPLATE = 
`
<div class="frappe-dropdown">
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
		  'border-radius': '50%',
		  	 'box-shadow': '0px 3px 6px 0px rgba(0,0,0,.25)'
		});

		if ( this.options.icon ) {
			var $icon = $(`<i class="${this.options.icon}"/>`);
			this.$element.append($icon);

			if ( this.options.toggable ) {
				this.click(() => {
					$icon.toggleClass(this.options.icon);
					$icon.toggleClass("glyphicon glyphicon-remove");
				});
			}
		}

		if ( this.options.color ) {
			this.$element.css({
				'background-color': this.options.color.primary,
						     color: '#FEFEFE' // TODO: Automatically detect
			});
		}
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

		this.button     = new FAB({
			    icon: 'glyphicon glyphicon-comment',
			toggable: true
		});

		this.init();
	}

	init ( ) {
		super.init();

		this.$element.css({
			position: 'absolute',
			  margin: 20
		});
	}
};
Widget.DropDown.OPTIONS = 
{
	position: Component.POSITION.BOTTOM.RIGHT,
	   title: 'Chat'
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
