import Entity from './Entity'

class User extends Entity {
	constructor (...options) {
		super (User.OPTIONS, ...options)
	}
}
User.OPTIONS = 
{

}

export default User