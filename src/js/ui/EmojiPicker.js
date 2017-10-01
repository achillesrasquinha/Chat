class EmojiPicker
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, EmojiPicker.OPTIONS, options)
		this.$element = $(EmojiPicker.TEMPLATE)

		// this.position(this.options.position)
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
}

EmojiPicker.POSITION  = { TOP: { LEFT: 'tl', RIGHT: 'tr' }, BOTTOM: { LEFT: 'bl', RIGHT: 'br' } }
EmojiPicker.OPTIONS   =
{
	position: EmojiPicker.POSITION.BOTTOM.LEFT
}
EmojiPicker.TEMPLATE  = 
`
	<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
		<i class="glyphicon glyphicon-thumbs-up"/>
	</button>
	<ul class="dropdown-menu">
		
	</ul>
`;

export default EmojiPicker