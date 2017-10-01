// ui
import Form    from './Form'

// entity
import Message from '../entity/Message'

class ChatForm extends Form {
	constructor (options) {
		options = Object.assign({ }, ChatForm.OPTIONS, options)
		super (options)
	}
}

export default ChatForm