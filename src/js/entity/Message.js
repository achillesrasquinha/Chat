import Entity from './Entity'

class Message extends Entity {
	constructor (...options) {
		super (Message.OPTIONS, ...options)
	}
}

Message.OPTIONS = 
{
	
}

export default Message