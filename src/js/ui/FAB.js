class FAB
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, FAB.OPTIONS, options)
		this.$element = $(FAB.TEMPLATE)

		this.$element.css({
		  	   'border-radius': '50%',
			'background-color': this.options.color.primary,
					   'color': '#FEFEFE', // TODO: This should detect based on color.primary
			      'box-shadow': '0px 0px 12px 3px rgba(0,0,0,0.25)'
		})
		this.$element.css({
			width: this.options.size, height: this.options.size
		})

		this.$icon    = this.$element.find('.fab-icon')
		this.$icon.addClass(this.options.icon)
	}

	click (callback)
	{
		this.$element.click(callback)
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
}
FAB.TEMPLATE = 
`
<button class="btn btn-default">
	<i class="fab-icon"/>
</button>
`;

export default FAB