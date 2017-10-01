import Component from '../Component' 

class List extends Component {
	constructor (...options) {
		super (List.OPTIONS, ...options)
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
	constructor (...options) {
		super (List.Item.OPTIONS, ...options)
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