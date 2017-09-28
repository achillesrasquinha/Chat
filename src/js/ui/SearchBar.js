class SearchBar
{
	constructor (options = { })
	{
		this.options    = Object.assign({ }, SearchBar.OPTIONS, options)
		this.$element   = $(SearchBar.TEMPLATE)

		this.$element.find('.input-group-addon').css({
			color: this.options.color.primary
		})

		this.$input     = this.$element.find('.frappe-chat-searchbar-input')
		this.$input.attr('autofocus', this.options.autofocus)

		this.prevQuery  = this.$input.val()

		this.$element.submit((event) => {
			if (!event.isDefaultPrevented())
				 event.preventDefault()
		})
	}

	show ( )
	{
		this.$element.show()
	}

	hide ( )
	{
		this.$element.hide()
	}

	change (callback)
	{
		this.$input.on('change keyup paste', () => {
			const curQuery  = this.$input.val()
			if ( curQuery !== this.prevQuery )
			{
				this.prevQuery = curQuery

				callback(curQuery)
			}
				
		})
	}

	submit (callback)
	{
		this.$element.submit((event) => {
			const curQuery  = this.$input.val()

			callback(curQuery)
		})
	}
}
SearchBar.OPTIONS       = 
{
	color:
	{
		primary: '#7575FF'
	},
	autofocus: false
}
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

export default SearchBar