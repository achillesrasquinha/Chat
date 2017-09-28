import FAB from './FAB'

class ChatList
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, ChatList.OPTIONS, options)
		this.$element = $(ChatList.TEMPLATE)
		this.items    = Array()
	}

	fuel  (data)
	{
		data.users.forEach((user) => {
			var item   = new ChatList.Item()
			item.fuel(user)

			this.$element.append(item.$element)
			this.items.push(item)
		})
	}

	snip  (callback)
	{
		this.items.forEach((item) => {
			if ( callback(item) )
				item.hide()
			else
				item.show()
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

	click (callback)
	{
		this.items.forEach((item) => item.click(() => callback(item)))
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
<div class="list-group" style=
"	
	max-height: 475px;
	overflow-y: scroll
">	
</div>
`;

ChatList.Item          = class
{
	constructor (options = { })
	{
		this.options   = Object.assign({ }, ChatList.Item.OPTIONS, options)
		this.$element  = $(ChatList.Item.TEMPLATE)

		this.$heading  = this.$element.find('.frappe-chat-list-item-heading')
		this.$avatar   = this.$element.find('.frappe-chat-list-item-avatar')
	}

	fuel (data)
	{
		const { name, avatar } = data

		this.$heading.html(name)
		this.$avatar .attr('src', avatar)
	}

	show ( )
	{
		this.$element.show()
	}

	hide ( )
	{
		this.$element.hide()
	}

	click (callback)
	{
		this.$element.click(callback)
	}
}
ChatList.Item.OPTIONS  = 
{

}
ChatList.Item.TEMPLATE = 
`
<div class="list-group-item">
	<a href="javascript:void(0);">
		<div class="row">
			<div class="col-xs-3">
				<div class="text-center">
					<img class="frappe-chat-list-item-avatar img-responsive img-circle img-thumbnail" height="48"/>
				</div>
			</div>
			<div class="col-xs-9">
				<h5 class="frappe-chat-list-item-heading"/>
			</div>
		</div>
	</a>
</div>
`;

export default ChatList