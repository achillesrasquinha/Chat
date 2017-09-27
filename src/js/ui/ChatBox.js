class ChatBox
{
	constructor (options = { })
	{
		this.options  = Object.assign({ }, ChatBox.OPTIONS, options)
		this.$element = $(ChatBox.TEMPLATE)

		this.$heading = this.$element.find('.frappe-chatbox-heading')
		this.$heading.css({
			'background-color': this.options.color.primary,
					   'color': '#FEFEFE' // TODO: This should detect by itself.
		})

		this.$title   = this.$element.find('.frappe-chatbox-title')
		this.$title.html(this.options.title)
	}
}
ChatBox.OPTIONS  =
{
	color:
	{
		primary: '#7575FF'
	},
	title: 'Chats'
}
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

export default ChatBox