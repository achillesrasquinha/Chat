import FAB from './FAB'

class ChatList
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, ChatList.OPTIONS, options)
		this.$element = $(ChatList.TEMPLATE)
		
		this.fab      = new FAB({
			 size: 56,
			color: this.options.color
		})
		this.fab.$element.css({
			position: 'absolute',
			  bottom: 0,
			   right: 0,
			  margin: 20
		})

		this.$element.append(this.fab.$element)
	}
}
ChatList.OPTIONS       = 
{
	color:
	{
		primary: '#7575FF'
	}
}
ChatList.TEMPLATE      = 
`
<div class="list-group">
	
</div>
`;

ChatList.Item          = class
{
	constructor (options = { })
	{
		this.options   = Object.assign({ }, ChatList.Item.OPTIONS, options)
		this.$element  = $(ChatList.Item.TEMPLATE)
	}
}
ChatList.Item.OPTIONS  = 
{

}
ChatList.Item.TEMPLATE = 
`
<div class="list-group-item">

</div>
`;

export default ChatList