import List from './base/List'

class ChatList extends List {
	constructor (...options) {
		super (ChatList.OPTIONS, ...options)
	}
}
ChatList.OPTIONS      = 
{
	
}

ChatList.Item         = class extends List.Item {
	constructor (...options) {
		super (ChatList.Item.OPTIONS, ...options)
	}
}
ChatList.Item.OPTIONS = 
{
	
}

export default ChatList