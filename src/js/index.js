import { ImportError } from './Error.js'

if ( typeof $  === 'undefined' )
	throw new ImportError(`Frappe Chat requires jQuery. Kindly include jQuery before Frappe Chat.`)

if ( typeof io === 'undefined' )
	throw new ImportError(`Frappe Chat requires the Socket.IO Client API. Visit https://socket.io to know more.`)

import Client from './Client'
import Event  from './Event'
import ui     from './ui'

const frappe = 
{
	Chat:
	{
		Client: Client,
		 Event: Event
	}, ui: ui
}

export default frappe