import Component from '../Component'

class Panel extends Component {
	constructor (options) {
		options = Object.assign({ }, Panel.OPTIONS, options)
		super (options)

		this.init()
	}

	init   ( ) {
		this.$element = $(Panel.TEMPLATE)
		
		var $heading = this.$element.find('.panel-heading')
		var $title   = this.$element.find('.panel-title')

		if ( this.options.title ) {
			$heading.find('.panel-title').html(this.options.title)
		} else {
			$heading.hide()
		}

		if ( this.options.color ) {
			$heading.css({
				'background-color': this.options.color.primary,
						     color: '#FEFEFE' // TODO: Automatically detect
			})
		}
	}

	render ( ) {

	}
}

Panel.OPTIONS  = 
{

}

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
`

export default Panel