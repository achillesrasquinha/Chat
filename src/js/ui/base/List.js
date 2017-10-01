import Component from '../Component' 

class List extends Component {
	constructor (options) {
		options    = Object.assign({ }, List.OPTIONS, options)
		super (options)
	}
}

List.OPTIONS       = 
{

}
List.TEMPLATE      = 
`
<div class="list-group">

</div>
`

List.Item          = class extends Component {
	constructor (options) {
		options    = Object.assign({ }, List.Item.OPTIONS, options)
		super (options)
	}
}
List.Item.OPTIONS  = 
{

}
List.Item.TEMPLATE = 
`
<div class="list-group-item">

</div>
`

export default List