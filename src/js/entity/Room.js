import Entity from './Entity'
import util   from '../util'

class Room extends Entity {
	constructor (type, ...options) {
		super (Room.OPTIONS, ...options)

		this.ID        = util.getUUID()
		this.timestamp = new Date()
		this.type      = type
	}
}

Room.TYPE    = 
{
	CHANNEL: 'channel',
	 DIRECT: 'direct',
	  GROUP: 'group',
	VISITOR: 'visitor'
}
Room.OPTIONS = 
{

}

export default Room