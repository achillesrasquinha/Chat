import Component from '../Component'

class Tab extends Component {
	constructor (...options) {
		super (Tab.OPTIONS, ...options)
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