import Form    from './Form'

import Message from '../entity/Message'

class ChatForm extends Form {
	constructor (...options) {
		super (ChatForm.OPTIONS, ...options)
	}
}

export default ChatForm