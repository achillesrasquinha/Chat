class Room extends Entity {
	constructor (name, ...options) {
		super (Room.OPTIONS, ...options)

		this.timestamp = new Date()
		this.name      = name
	}
}

Room.OPTIONS = 
{

}

export default Room