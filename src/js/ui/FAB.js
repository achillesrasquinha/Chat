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
			width: 64, height: 64
		})
		this.$element.css({
			// position: 'absolute',
			  bottom: 0,
			   right: 0,
			  margin: 20
		})
	}

	click (callback)
	{
		this.$element.click(callback)
	}
}
FAB.OPTIONS  =
{
	color:
	{
		primary: '#7575FF'
	}
}
FAB.TEMPLATE = 
`
<button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
	<i class="glyphicon glyphicon-plus"/>
</button>
`;

export default FAB