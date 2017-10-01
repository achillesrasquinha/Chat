import Component from '../Component'

class Tab extends Component {
	constructor (options) {
		options = Object.assign({ }, Tab.OPTIONS, options)
		super (options)
	}
}

Tab.TEMPLATE = 
`
<div>
	<div class="nav nav-pills">

	</div>
</div>
`

export default Tab