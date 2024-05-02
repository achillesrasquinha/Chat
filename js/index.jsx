// Chat
// Author - Achilles Rasquinha <achillesrasquinha@gmail.com>

/* eslint semi: "never" */
// Fuck semicolons - https://mislav.net/2010/05/semicolons

import { h, Component, render } from 'preact'
import moment from 'moment';

// import request from './request';
import {
	pluralize,
	nl2br,
	linkify
} from './util/string'
import {
	head,
	copy as copyArray,
	squash,
	compact
} from './util/array'
import {
	isEmpty,
	toArray
} from './util/type'
import {
	isMobile
} from './util/device'
import datetime from './util/datetime'
import { __ } from './util/i18n'
import Logger from './log'

import iconThreeDots from './assets/three-dots.svg';

import Fuse   from 'fuse.js'

import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'

// import './socketio_client'

// import './ui/dialog'
// import './ui/capture'

// import './utils/user'

import './App.scss'
import '../scss/Chat.scss';

const Chat   = window.Chat = {}
const logger = Logger.get('Chat', Logger.ERROR);

Chat.provide = (key, value = {}) => {
	const keys   = key.split(".")
	const length = keys.length;

	let lvl      = Chat

	for ( let i = 0 ; i < length ; ++i ) {
		const key = keys[i];

		if ( !(key in lvl) ) {
			if ( i === length - 1 ) {
				lvl[key] = value
			} else {
				lvl[key] = {}
			}
		}

		lvl = lvl[key]
	}
};

const CACHE = {
	"room": []
};

Chat.call = (method, data = null, cb = null) => {
	const MOCK = {
		"Chat.chat.website.token": "TOKEN",
		"Chat.chat.doctype.chat_profile.chat_profile.create": {
			
		},
		"Chat.chat.doctype.chat_room.chat_room.create": {
			"name": "Guest Room"
		},
		"Chat.chat.doctype.chat_room.chat_room.history":
			d => {
				const { room } = d;

				if ( !(room in CACHE.room) ) {
					CACHE.room[room] = [];
				}

				return CACHE.room[room];
			},
		"Chat.chat.doctype.chat_message.chat_message.send":
			d => {
				const { room } = d;

				if ( !(room in CACHE.room) ) {
					CACHE.room[room] = [];
				}

				const message = { ...d, creation: new datetime.datetime(),
					seen: [] };
				CACHE.room[room].push(message);

				Chat.realtime.publish("Chat.chat.message:create", message);
				Chat.realtime.publish("Chat.chat.room:update", {
					room: room,
					messages: CACHE.room[room],
					last_message: message,
					// type: "Visitor", // TODO: configure
					// room_name: "Hi, I'm Alfred!"
				});
			}
	}

	logger.info(`Calling Method: ${method}: ${JSON.stringify(data)}`);

	if ( method in MOCK ) {
		let response = MOCK[method]

		if ( typeof response === "function" ) {
			response = response(data)
		}

		if ( cb ) {
			cb({ message: response });
		}
	} else {
		throw new Error(`No response found for method ${method}.`);
	}
}

Chat.provide('realtime');
Chat.realtime.publish = (channel, data) => {
	logger.info(`Publishing to Channel '${channel}': ${JSON.stringify(data)}`);
	const event = document.createEvent('Event');
	event.initEvent(channel, true, true);

	event.data  = data;

	document.dispatchEvent(event);
}

Chat.provide('user');
Chat.user.full_name = user => user;
Chat.user.image     = user => '';

// Chat.quick_edit
Chat.quick_edit      = (doctype, docname, fn) => {
	return new Promise(resolve => {
		Chat.model.with_doctype(doctype, () => {
			Chat.db.get_doc(doctype, docname).then(doc  => {
				const meta     = Chat.get_meta(doctype)
				const fields   = meta.fields
				const required = fields.filter(f => f.reqd || f.bold && !f.read_only)

				required.map(f => {
					if(f.fieldname == 'content' && doc.type == 'File') {
						f['read_only'] = 1;
					}
				})

				const dialog   = new Chat.ui.Dialog({
					 title: __(`Edit ${doctype} (${docname})`),
					fields: required,
					action: {
						primary: {
							   label: __("Save"),
							onsubmit: (values) => {
								Chat.call('Chat.client.save',
									{ doc: { doctype: doctype, docname: docname, ...doc, ...values } })
									  .then(r => {
										if ( fn )
											fn(r.message)

										resolve(r.message)
									  })

								dialog.hide()
							}
						},
						secondary: {
							label: __("Discard")
						}
					}
				})
				dialog.set_values(doc)

				const $element = $(dialog.body)
				$element.append(`
					<div class="qe-fp" style="padding-top: '15px'; padding-bottom: '15px'; padding-left: '7px'">
						<button class="btn btn-default btn-sm">
							${__("Edit in Full Page")}
						</button>
					</div>
				`)
				$element.find('.qe-fp').click(() => {
					dialog.hide()
					Chat.set_route(`Form/${doctype}/${docname}`)
				})

				dialog.show()
			})
		})
	})
}

// Chat._
// Chat's utility namespace.
Chat.provide('_')

// String Utilities

/**
 * @description Fuzzy Search a given query within a dataset.
 *
 * @param  {string} query   - A query string.
 * @param  {array}  dataset - A dataset to search within, can contain singletons or objects.
 * @param  {object} options - Options as per fuze.js
 *
 * @return {array}          - The fuzzy matched index/object within the dataset.
 *
 * @example
 * Chat._.fuzzy_search("foobar", ["foobar", "bartender"])
 * // returns [0, 1]
 *
 * @see http://fusejs.io
 */
Chat._.fuzzy_search = (query, dataset, options) => {
	const DEFAULT     = {
				shouldSort: true,
				 threshold: 0.6,
				  location: 0,
				  distance: 100,
		minMatchCharLength: 1,
		  maxPatternLength: 32
	}
	options       = { ...DEFAULT, ...options }

	const fuse    = new Fuse(dataset, options)
	const result  = fuse.search(query)

	return result
}

// Array Utilities

// extend utils to base.
Chat.utils       = { ...Chat.utils, ...Chat._ }

// Chat extensions

// Chat.user extensions
/**
 * @description Returns the first name of a User.
 *
 * @param {string} user - User
 *
 * @returns The first name of the user.
 *
 * @example
 * Chat.user.first_name("Rahul Malhotra")
 * // returns "Rahul"
 */
Chat.provide('user')
Chat.user.first_name = user => head(Chat.user.full_name(user).split(" "))

Chat.provide('ui.keycode')
Chat.ui.keycode = { RETURN: 13 }

/**
 * @description Chat's Store Class
 */
 // Chat.stores  - A registry for Chat stores.
Chat.provide('stores')
Chat.stores = [ ]
Chat.Store  = class
{
	/**
	 * @description Chat's Store Class's constructor.
	 *
	 * @param {string} name - Name of the logger.
	 */
	constructor (name) {
		if ( typeof name !== 'string' )
			throw new TypeError(`Expected string for name, got ${typeof name} instead.`)
		this.name = name
	}

	/**
	 * @description Get instance of Chat.Store (return registered one if declared).
	 *
	 * @param {string} name - Name of the store.
	 */
	static get (name) {
		if ( !(name in Chat.stores) )
			Chat.stores[name] = new Chat.Store(name)
		return Chat.stores[name]
	}

	set (key, value) { localStorage.setItem(`${this.name}:${key}`, value) }
	get (key, value) { return localStorage.getItem(`${this.name}:${key}`) }
}

// Chat.chat
Chat.provide('chat')

// Chat.chat.profile
Chat.provide('chat.profile')

/**
 * @description Create a Chat Profile.
 *
 * @param   {string|array} fields - (Optional) fields to be retrieved after creating a Chat Profile.
 * @param   {function}     fn     - (Optional) callback with the returned Chat Profile.
 *
 * @returns {Promise}
 *
 * @example
 * Chat.chat.profile.create(console.log)
 *
 * Chat.chat.profile.create("status").then(console.log) // { status: "Online" }
 */
Chat.chat.profile.create = (fields, fn) => {
	if ( typeof fields === "function" ) {
		fn     = fields
		fields = null
	} else
	if ( typeof fields === "string" )
		fields = toArray(fields)

	return new Promise(resolve => {
		Chat.call("Chat.chat.doctype.chat_profile.chat_profile.create",
			{ user: Chat.session.user, exists_ok: true, fields: fields },
				response => {
					if ( fn )
						fn(response.message)

					resolve(response.message)
				})
	})
}

/**
 * @description Updates a Chat Profile.
 *
 * @param   {string} user   - (Optional) Chat Profile User, defaults to session user.
 * @param   {object} update - (Required) Updates to be dispatched.
 *
 * @example
 * Chat.chat.profile.update(Chat.session.user, { "status": "Offline" })
 */
Chat.chat.profile.update = (user, update, fn) => {
	return new Promise(resolve => {
		Chat.call("Chat.chat.doctype.chat_profile.chat_profile.update",
			{ user: user || Chat.session.user, data: update },
				response => {
					if ( fn )
						fn(response.message)

					resolve(response.message)
				})
	})
}

// Chat.chat.profile.on
Chat.provide('chat.profile.on')

/**
 * @description Triggers on a Chat Profile update of a user (Only if there's a one-on-one conversation).
 *
 * @param   {function} fn - (Optional) callback with the User and the Chat Profile update.
 *
 * @returns {Promise}
 *
 * @example
 * Chat.chat.profile.on.update(function (user, update)
 * {
 *      // do stuff
 * })
 */
Chat.chat.profile.on.update = function (fn) {
	Chat.realtime.on("Chat.chat.profile:update", r => fn(r.user, r.data))
}
Chat.chat.profile.STATUSES
=
[
	{
		name: "Online",
	   color: "green"
	},
	{
		 name: "Away",
		color: "yellow"
	},
	{
		 name: "Busy",
		color: "red"
	},
	{
		 name: "Offline",
		color: "darkgrey"
	}
]

// Chat.chat.room
Chat.provide('chat.room')

/**
 * @description Creates a Chat Room.
 *
 * @param   {string}       kind  - (Required) "Direct", "Group" or "Visitor".
 * @param   {string}       owner - (Optional) Chat Room owner (defaults to current user).
 * @param   {string|array} users - (Required for "Direct" and "Visitor", Optional for "Group") User(s) within Chat Room.
 * @param   {string}       name  - Chat Room name.
 * @param   {function}     fn    - callback with created Chat Room.
 *
 * @returns {Promise}
 *
 * @example
 * Chat.chat.room.create("Direct", Chat.session.user, "foo@bar.com", function (room) {
 *      // do stuff
 * })
 * Chat.chat.room.create("Group",  Chat.session.user, ["santa@gmail.com", "banta@gmail.com"], "Santa and Banta", function (room) {
 *      // do stuff
 * })
 */
Chat.chat.room.create = function (kind, owner, users, name, fn) {
	if ( typeof name === "function" ) {
		fn   = name
		name = null
	}

	users    = toArray(users)

	return new Promise(resolve => {
		Chat.call("Chat.chat.doctype.chat_room.chat_room.create",
			{ kind: kind, owner: owner || Chat.session.user, users: users, name: name },
			r => {
				let room = r.message
				room     = { ...room, creation: new datetime.datetime(room.creation) }

				if ( fn )
					fn(room)

				resolve(room)
			})
	})
}

/**
 * @description Returns Chat Room(s).
 *
 * @param   {string|array} names   - (Optional) Chat Room(s) to retrieve.
 * @param   {string|array} fields  - (Optional) fields to be retrieved for each Chat Room.
 * @param   {function}     fn      - (Optional) callback with the returned Chat Room(s).
 *
 * @returns {Promise}
 *
 * @example
 * Chat.chat.room.get(function (rooms) {
 *      // do stuff
 * })
 * Chat.chat.room.get().then(function (rooms) {
 *      // do stuff
 * })
 *
 * Chat.chat.room.get(null, ["room_name", "avatar"], function (rooms) {
 *      // do stuff
 * })
 *
 * Chat.chat.room.get("CR00001", "room_name", function (room) {
 *      // do stuff
 * })
 *
 * Chat.chat.room.get(["CR00001", "CR00002"], ["room_name", "last_message"], function (rooms) {
 *
 * })
 */
Chat.chat.room.get = function (names, fields, fn) {
	if ( typeof names === "function" ) {
		fn     = names
		names  = null
		fields = null
	}
	else
	if ( typeof names === "string" ) {
		names  = toArray(names)

		if ( typeof fields === "function" ) {
			fn     = fields
			fields = null
		}
		else
		if ( typeof fields === "string" )
			fields = toArray(fields)
	}

	return new Promise(resolve => {
		Chat.call("Chat.chat.doctype.chat_room.chat_room.get",
			{ user: Chat.session.user, rooms: names, fields: fields },
				response => {
					let rooms = response.message
					if ( rooms ) { // Chat.api BOGZ! (emtpy arrays are falsified, not good design).
						rooms = toArray(rooms)
						rooms = rooms.map(room => {
							return { ...room, creation: new datetime.datetime(room.creation),
								last_message: room.last_message ? {
									...room.last_message,
									creation: new datetime.datetime(room.last_message.creation)
								} : null
							}
						})
						rooms = squash(rooms)
					}
					else
						rooms = [ ]

					if ( fn )
						fn(rooms)

					resolve(rooms)
				})
	})
}

/**
 * @description Subscribe current user to said Chat Room(s).
 *
 * @param {string|array} rooms - Chat Room(s).
 *
 * @example
 * Chat.chat.room.subscribe("CR00001")
 */
Chat.chat.room.subscribe = function (rooms) {
	Chat.realtime.publish("Chat.chat.room:subscribe", rooms)
}

/**
 * @description Get Chat Room history.
 *
 * @param   {string} name - Chat Room name
 *
 * @returns {Promise}     - Chat Message(s)
 *
 * @example
 * Chat.chat.room.history(function (messages)
 * {
 *      // do stuff.
 * })
 */
Chat.chat.room.history = function (name, fn) {
	return new Promise(resolve => {
		Chat.call("Chat.chat.doctype.chat_room.chat_room.history",
			{ room: name, user: Chat.session.user },
				r => {
					let messages = r.message ? toArray(r.message) : [ ] // Chat.api BOGZ! (emtpy arrays are falsified, not good design).
					messages     = messages.map(m => {
						return { ...m,
							creation: new datetime.datetime(m.creation)
						}
					})

					if ( fn )
						fn(messages)

					resolve(messages)
				})
	})
}

/**
 * @description Searches Rooms based on a query.
 *
 * @param   {string} query - The query string.
 * @param   {array}  rooms - A list of Chat Rooms.
 *
 * @returns {array}        - A fuzzy searched list of rooms.
 */
Chat.chat.room.search = function (query, rooms) {
	const dataset = rooms.map(r => {
		if ( r.room_name )
			return r.room_name
		else
			if ( r.owner === Chat.session.user )
				return Chat.user.full_name(squash(r.users))
			else
				return Chat.user.full_name(r.owner)
	})
	const results = Chat._.fuzzy_search(query, dataset)
	rooms         = results.map(i => rooms[i])

	return rooms
}

/**
 * @description Sort Chat Room(s) based on Last Message Timestamp or Creation Date.
 *
 * @param {array}   - A list of Chat Room(s)
 * @param {compare} - (Optional) a comparision function.
 */
Chat.chat.room.sort = function (rooms, compare = null) {
	compare = compare || function (a, b) {
		if ( a.last_message && b.last_message )
			return datetime.compare(a.last_message.creation, b.last_message.creation)
		else
		if ( a.last_message )
			return datetime.compare(a.last_message.creation, b.creation)
		else
		if ( b.last_message )
			return datetime.compare(a.creation, b.last_message.creation)
		else
			return datetime.compare(a.creation, b.creation)
	}
	rooms.sort(compare)

	return rooms
}

// Chat.chat.room.on
Chat.provide('chat.room.on')

/**
 * @description Triggers on Chat Room updated.
 *
 * @param {function} fn - callback with the Chat Room and Update.
 */
Chat.chat.room.on.update = function (fn) {
	Chat.realtime.on("Chat.chat.room:update", e => {
		let { data } = e

		if ( data.last_message )
			// creation to datetime.datetime (easier to manipulate).
			data = { ...data, last_message: { ...data.last_message, creation: new datetime.datetime(data.last_message.creation) } }
		
		fn(data.room, data)
	})
}

/**
 * @description Triggers on Chat Room created.
 *
 * @param {function} fn - callback with the created Chat Room.
 */
Chat.chat.room.on.create = function (fn) {
	Chat.realtime.on("Chat.chat.room:create", r =>
		fn({ ...r, creation: new datetime.datetime(r.creation) })
	)
}

/**
 * @description Triggers when a User is typing in a Chat Room.
 *
 * @param {function} fn - callback with the typing User within the Chat Room.
 */
Chat.chat.room.on.typing = function (fn) {
	Chat.realtime.on("Chat.chat.room:typing",
		({ data }) => fn(data.room, data.user))
}

// Chat.chat.message
Chat.provide('chat.message')

Chat.chat.message.typing = function (room, user) {
	Chat.realtime.publish("Chat.chat.message:typing", { user: user || Chat.session.user, room: room });
	
	Chat.realtime.publish("Chat.chat.room:typing", {
		user: user || Chat.session.user,
		room: room
	});
}

Chat.chat.message.send   = function (room, message, { type = "Content",
	user = null, prompts = null, links = null } = { }) {
	Chat.call("Chat.chat.doctype.chat_message.chat_message.send",
		{ user: user || Chat.session.user, room: room, content: message, type, prompts, links })
}

Chat.chat.message.update = function (message, update, fn) {
	return new Promise(resolve => {
		Chat.call('Chat.chat.doctype.chat_message.chat_message.update',
			{ user: Chat.session.user, message: message, update: update },
			r =>  {
				if ( fn )
					fn(response.message)

				resolve(response.message)
			})
	})
}

Chat.chat.message.sort   = (messages) => {
	if ( !isEmpty(messages) )
		messages.sort((a, b) => datetime.compare(b.creation, a.creation))

	return messages
}

/**
 * @description Add user to seen (defaults to session.user)
 */
Chat.chat.message.seen   = (mess, user) => {
	Chat.call('Chat.chat.doctype.chat_message.chat_message.seen',
		{ message: mess, user: user || Chat.session.user })
}

Chat.provide('chat.message.on')
Chat.chat.message.on.create = function (fn) {
	Chat.realtime.on("Chat.chat.message:create", r =>
		fn({ ...r, creation: new datetime.datetime(r.creation) })
	)
}

Chat.chat.message.on.update = function (fn) {
	Chat.realtime.on("Chat.chat.message:update", r => fn(r.message, r.data))
}

Chat.chat.pretty_datetime   = function (date) {
	const today    = moment()
	const instance = date.moment

	if ( today.isSame(instance, "d") )
		return instance.format("hh:mm A")
	else
	if ( today.isSame(instance, "week") )
		return instance.format("dddd")
	else
		return instance.format("DD/MM/YYYY")
}

// Chat.chat.sound
Chat.provide('chat.sound')

/**
 * @description Plays a given registered sound.
 *
 * @param {value} - The name of the registered sound.
 *
 * @example
 * Chat.chat.sound.play("message")
 */
Chat.chat.sound.play  = function (name, volume = 0.1) {
	// Chat._.play_sound(`chat-${name}`)
	const $audio = $(`<audio class="chat-audio"/>`)
	$audio.attr('volume', volume)

	if  ( isEmpty($audio) )
		$(document).append($audio)

	if  ( !$audio.paused ) {
		logger.info('Stopping sound playing.')
		$audio[0].pause()
		$audio.attr('currentTime', 0)
	}

	logger.info('Playing sound.')
	$audio.attr('src', `${Chat.chat.sound.PATH}/chat-${name}.mp3`)
	$audio[0].play()
}
Chat.chat.sound.PATH  = '/assets/Chat/sounds'

// Chat.chat.emoji
Chat.chat.emojis = [ ]
Chat.chat.emoji  = function (fn) {
	return new Promise(resolve => {
		if ( !isEmpty(Chat.chat.emojis) ) {
			if ( fn )
				fn(Chat.chat.emojis)

			resolve(Chat.chat.emojis)
		}
		else
			$.get('https://cdn.rawgit.com/frappe/emoji/master/emoji', (data) => {
				Chat.chat.emojis = JSON.parse(data)

				if ( fn )
					fn(Chat.chat.emojis)

				resolve(Chat.chat.emojis)
			})
	})
}

// Website Settings
Chat.provide('chat.website.settings')
Chat.chat.website.settings = (fields, fn) =>
{
	if ( typeof fields === "function" ) {
		fn     = fields
		fields = null
	} else
	if ( typeof fields === "string" )
		fields = toArray(fields)

	return new Promise(resolve => {
		Chat.call("Chat.chat.website.settings",
			{ fields: fields })
			.then(response => {
				var message = response.message

				if ( message.enable_from )
					message   = { ...message, enable_from: new datetime.datetime(message.enable_from, 'HH:mm:ss') }
				if ( message.enable_to )
					message   = { ...message, enable_to:   new datetime.datetime(message.enable_to,   'HH:mm:ss') }

				if ( fn )
					fn(message)

				resolve(message)
			})
	})
}

Chat.chat.website.token    = (fn) =>
{
	// return new Promise(resolve => {
	// 	Chat.call("Chat.chat.website.token")
	// 		.then(response => {
	// 			if ( fn )
	// 				fn(response.message)

	// 			resolve(response.message)
	// 		})
	// })
	return new Promise(resolve => resolve("TOKEN"));
}

// Chat.components
// Chat's component namespace.
Chat.provide('components')

Chat.provide('chat.component')

/**
 * @description Button Component
 *
 * @prop {string}  type  - (Optional) "default", "primary", "info", "success", "warning", "danger" (defaults to "default")
 * @prop {boolean} block - (Optional) Render a button block (defaults to false).
 */
Chat.components.Button
=
class extends Component {
	render ( ) {
		const { props } = this
		const size      = Chat.components.Button.SIZE[props.size]

		return (
			h("button", { ...props, class: `btn ${size && size.class} btn-${props.type} ${props.block ? "btn-block" : ""} ${props.class ? props.class : ""}` },
				props.children
			)
		)
	}
}
Chat.components.Button.SIZE
=
{
	small: {
		class: "btn-sm"
	},
	large: {
		class: "btn-lg"
	}
}

Chat.components.Button.defaultProps
=
{
	 type: "default",
	block: false
}

/**
 * @description FAB Component
 *
 * @extends Chat.components.Button
 */
Chat.components.FAB
=
class extends Chat.components.Button {
	render ( ) {
		const { props } = this
		const size      = Chat.components.FAB.SIZE[props.size]

		return (
			h(Chat.components.Button, { ...props, class: `${props.class} ${size && size.class}`},
				h("i", { class: props.icon })
			)
		)
	}
}
Chat.components.FAB.defaultProps
=
{
	icon: "glyphicon glyphicon-plus"
}
Chat.components.FAB.SIZE
=
{
	small:
	{
		class: "Chat-fab-sm"
	},
	large:
	{
		class: "Chat-fab-lg"
	}
}

/**
 * @description Octicon Component
 *
 * @prop color - (Required) color for the indicator
 */
Chat.components.Indicator
=
class extends Component {
	render ( ) {
		const { props } = this

		return props.color ? h("span", { ...props, class: `indicator ${props.color}` }) : null
	}
}

/**
 * @description FontAwesome Component
 */
Chat.components.FontAwesome
=
class extends Component {
	render ( ) {
		const { props } = this

		return props.type ? h("i", { ...props, class: `fa ${props.fixed ? "fa-fw" : ""} fa-${props.type} ${props.class}` }) : null
	}
}
Chat.components.FontAwesome.defaultProps
=
{
	fixed: false
}

/**
 * @description Octicon Component
 *
 * @extends Chat.Component
 */
Chat.components.Octicon
=
class extends Component {
	render ( ) {
		const { props } = this

		return props.type ? h("i", { ...props, class: `octicon octicon-${props.type}` }) : null
	}
}

/**
 * @description Avatar Component
 *
 * @prop {string} title - (Optional) title for the avatar.
 * @prop {string} abbr  - (Optional) abbreviation for the avatar, defaults to the first letter of the title.
 * @prop {string} size  - (Optional) size of the avatar to be displayed.
 * @prop {image}  image - (Optional) image for the avatar, defaults to the first letter of the title.
 */
Chat.components.Avatar
=
class extends Component {
	render ( ) {
		const { props } = this
		const abbr      = props.abbr || (props.title || "").substr(0, 1)
		const size      = Chat.components.Avatar.SIZE[props.size] || Chat.components.Avatar.SIZE.medium

		return (
			h("span", { class: `avatar ${size.class} ${props.class ? props.class : ""}` },
				props.image ?
					h("img", { class: "media-object", src: props.image })
					:
					h("div", { class: "standard-image" }, abbr)
			)
		)
	}
}
Chat.components.Avatar.SIZE
=
{
	small:
	{
		class: "avatar-small"
	},
	large:
	{
		class: "avatar-large"
	},
	medium:
	{
		class: "avatar-medium"
	}
}

/**
 * @description Chat Chat Object.
 *
 * @example
 * const chat = new Chat.Chat(options) // appends to "body"
 * chat.render()
 * const chat = new Chat.Chat(".selector", options)
 * chat.render()
 *
 * const chat = new Chat.Chat()
 * chat.set_wrapper('.selector')
 *     .set_options(options)
 *     .render()
 */
Chat.Chat
=
class {
	/**
	 * @description Chat Chat Object.
	 *
	 * @param {string} selector - A query selector, HTML Element or jQuery object.
	 * @param {object} options  - Optional configurations.
	 */
	constructor (selector, options) {
		if ( !(typeof selector === "string" || selector instanceof $ || selector instanceof HTMLElement) ) {
			options  = selector
			selector = null
		}

		this.options = Chat.Chat.OPTIONS

		this.set_wrapper(selector ? selector : "body")
		this.set_options(options)

		// Load Emojis.
		Chat.chat.emoji()
	}

	/**
	 * Set the container on which the chat widget is mounted on.
	 * @param   {string|HTMLElement} selector - A query selector, HTML Element or jQuery object.
	 *
	 * @returns {Chat.Chat}                 - The instance.
	 *
	 * @example
	 * const chat = new Chat.Chat()
	 * chat.set_wrapper(".selector")
	 */
	set_wrapper (selector) {
		this.$wrapper = $(selector)

		return this
	}

	/**
	 * Set the configurations for the chat interface.
	 * @param   {object}      options - Optional Configurations.
	 *
	 * @returns {Chat.Chat}         - The instance.
	 *
	 * @example
	 * const chat = new Chat.Chat()
	 * chat.set_options({ layout: Chat.Chat.Layout.PAGE })
	 */
	set_options (options) {
		this.options = { ...this.options, ...options }

		return this
	}

	/**
	 * @description Destory the chat widget.
	 *
	 * @returns {Chat.Chat} - The instance.
	 *
	 * @example
	 * const chat = new Chat.Chat()
	 * chat.render()
	 *     .destroy()
	 */
	destroy ( ) {
		const $wrapper = this.$wrapper
		$wrapper.remove(".Chat-chat")

		return this
	}

	/**
	 * @description Render the chat widget component onto destined wrapper.
	 *
	 * @returns {Chat.Chat} - The instance.
	 *
	 * @example
	 * const chat = new Chat.Chat()
	 * chat.render()
	 */
	render (props = { }) {
		this.destroy()

		const $wrapper   = this.$wrapper
		const options    = this.options

		const component  = h(Chat.Chat.Widget, {
			layout: options.layout,
			target: options.target,
			...props
		})

		render(component, $wrapper[0])

		return this
	}
}
Chat.Chat.Layout
=
{
	PAGE: "page", POPPER: "popper"
}
Chat.Chat.OPTIONS
=
{
	layout: Chat.Chat.Layout.POPPER
}

/**
 * @description The base Component for Chat Chat
 */
Chat.Chat.Widget
=
class extends Component {
	constructor (props) {
		super (props)

		this.setup(props)
		this.make()
	}

	setup (props) {
		// room actions
		this.room           = { }
		this.room.add       = rooms => {
			rooms           = toArray(rooms)
			const names     = rooms.map(r => r.name)

			logger.info(`Subscribing ${Chat.session.user} to Chat Rooms ${names.join(", ")}.`)
			Chat.chat.room.subscribe(names)

			const state     = [ ]

			for (const room of rooms)
				  if ( ["Group", "Visitor"].includes(room.type) || room.owner === Chat.session.user || room.last_message || room.users.includes(Chat.session.user)) {
					logger.info(`Adding ${room.name} to component.`)
					state.push(room)
				}

			this.setState({ rooms: [ ...this.state.rooms, ...state ] })
		}
		this.room.update    = (room, update) => {
			const { state } = this
			var   exists    = false
			const rooms     = state.rooms.map(r => {
				if ( r.name === room ) {
					exists  = true
					if ( update.typing ) {
						if ( !isEmpty(r.typing) ) {
							const usr = update.typing
							if ( !r.typing.includes(usr) ) {
								update.typing = copyArray(r.typing)
								update.typing.push(usr)
							}
						}
						else
							update.typing = toArray(update.typing)
					}

					return { ...r, ...update }
				}

				return r
			})

			if ( Chat.session.user !== 'Guest' ) {
				if ( !exists )
					Chat.chat.room.get(room, (room) => this.room.add(room))
				else {
					this.setState({ rooms })
				}
			}

			if ( state.room.name === room ) {
				if ( update.typing ) {
					if ( !isEmpty(state.room.typing) ) {
						const usr = update.typing
						if ( !state.room.typing.includes(usr) ) {
							update.typing = copyArray(state.room.typing)
							update.typing.push(usr)
						}
					} else
						update.typing = toArray(update.typing)
				}

				const room  = { ...state.room, ...update }

				this.setState({ room })
			}
		}
		this.room.select    = (name) => {
			Chat.chat.room.history(name, (messages) => {
				const  { state } = this
				const room       = state.rooms.find(r => r.name === name)

				this.setState({
					room: { ...state.room, ...room, messages: messages }
				})
			})
		}

		this.state = { ...Chat.Chat.Widget.defaultState, ...props }
	}

	make ( ) {
		if ( Chat.session.user !== 'Guest' ) {
			Chat.chat.profile.create([
				"status", "message_preview", "notification_tones", "conversation_tones"
			]).then(profile => {
				this.setState({ profile })

				Chat.chat.room.get(rooms => {
					rooms = toArray(rooms)
					logger.info(`User ${Chat.session.user} is subscribed to ${rooms.length} ${pluralize('room', rooms.length)}.`)

					if ( !isEmpty(rooms) )
						this.room.add(rooms)
				})

				this.bind()
			})
		} else {
			this.bind()
		}
	}

	bind ( ) {
		Chat.chat.profile.on.update((user, update) => {
			logger.warn(`TRIGGER: Chat Profile update ${JSON.stringify(update)} of User ${user}.`)

			if ( 'status' in update ) {
				if ( user === Chat.session.user ) {
					this.setState({
						profile: { ...this.state.profile, status: update.status }
					})
				} else {
					const status = Chat.chat.profile.STATUSES.find(s => s.name === update.status)
					const color  = status.color

					const alert  = `<span class="indicator ${color}"/> ${Chat.user.full_name(user)} is currently <b>${update.status}</b>`
					Chat.show_alert(alert, 3)
				}
			}
		})

		Chat.chat.room.on.create((room) => {
			logger.warn(`TRIGGER: Chat Room ${room.name} created.`)
			this.room.add(room)
		})

		Chat.chat.room.on.update((room, update) => {
			logger.warn(`TRIGGER: Chat Room ${room} update ${JSON.stringify(update)} recieved.`)
			this.room.update(room, update)
		})

		Chat.chat.room.on.typing((room, user) => {
			if ( user !== Chat.session.user ) {
				logger.warn(`User ${user} typing in Chat Room ${room}.`)
				this.room.update(room, { typing: user })
				setTimeout(() => this.room.update(room, { typing: null }), 1000)
			}
		})

		Chat.chat.message.on.create((r) => {
			const { state } = this

			// play sound.
			if ( state.room.name )
				state.profile.conversation_tones && Chat.chat.sound.play('message')
			else
				state.profile.notification_tones && Chat.chat.sound.play('notification')

			if ( r.user !== Chat.session.user && state.profile.message_preview && !state.toggle ) {
				const $element = $('body').find('.Chat-chat-alert')
				$element.remove()

				const  alert   = // TODO: ellipses content
				`
				<span data-action="show-message" class="cursor-pointer">
					<span class="indicator yellow"/>
						<span class="avatar avatar-small">
							<span class="avatar-frame" style="background-image: url(${Chat.user.image(r.user)})"></span>
						</span>
						<b>${Chat.user.first_name(r.user)}</b>: ${r.content}
				</span>
				`
				Chat.show_alert(alert, 15, {
					"show-message": function (r) {
						this.room.select(r.room)
						this.base.firstChild._component.toggle()
					}.bind(this, r)
				})
				Chat.notify(`${Chat.user.first_name(r.user)}`, {
					body: r.content,
					icon: Chat.user.image(r.user),
					tag: r.user
				})
			}

			if ( r.room === state.room.name ) {
				const mess  = copyArray(state.room.messages)
				mess.push(r)

				this.setState({ room: { ...state.room, messages: mess } })
			}
		})

		Chat.chat.message.on.update((message, update) => {
			logger.warn(`TRIGGER: Chat Message ${message} update ${JSON.stringify(update)} recieved.`)
		})
	}

	render () {
		const me = this;
		const { props, state } = this
		const { onQuery, roomName, botName, active, welcomeMessage, samplePrompts,
			roomFooter, inputPlaceholder } = props;

		const ActionBar        = h(Chat.Chat.Widget.ActionBar, {
			placeholder: __("Search or Create a New Chat"),
				  class: "level",
				 layout: props.layout,
				actions:
			compact([
				{
					  label: __("New"),
					onclick: function ( ) {
						const dialog = new Chat.ui.Dialog({
							  title: __("New Chat"),
							 fields: [
								 {
										 label: __("Chat Type"),
									 fieldname: "type",
									 fieldtype: "Select",
									   options: ["Group", "Direct Chat"],
									   default: "Group",
									  onchange: () =>  {
											const type     = dialog.get_value("type")
											const is_group = type === "Group"

											dialog.set_df_property("group_name", "reqd",  is_group)
											dialog.set_df_property("user",       "reqd", !is_group)
									  }
								 },
								 {
										 label: __("Group Name"),
									 fieldname: "group_name",
									 fieldtype: "Data",
										  reqd: true,
									depends_on: "eval:doc.type == 'Group'"
								 },
								 {
										 label: __("Users"),
									 fieldname: "users",
									 fieldtype: "MultiSelect",
									   options: Chat.user.get_emails(),
									depends_on: "eval:doc.type == 'Group'"
								 },
								 {
										 label: __("User"),
									 fieldname: "user",
									 fieldtype: "Link",
									   options: "User",
									depends_on: "eval:doc.type == 'Direct Chat'"
								 }
							 ],
							action: {
								primary: {
									   label: __('Create'),
									onsubmit: (values) => {
										if ( values.type === "Group" ) {
											if ( !isEmpty(values.users) ) {
												const name  = values.group_name
												const users = dialog.fields_dict.users.get_values()

												Chat.chat.room.create("Group",  null, users, name)
											}
										} else {
											const user      = values.user

											Chat.chat.room.create("Direct", null, user)
										}
										dialog.hide()
									}
								}
							}
						})
						dialog.show()
					}
				},
				isMobile() && {
					   icon: "octicon octicon-x",
					   class: "Chat-chat-close",
					onclick: () => this.setState({ toggle: false })
				}
			], Boolean),
			change: query => { me.setState({ query }) },
			  span: span  => { me.setState({ span  }) },
		})

		var   contacts   = [ ]
		if ( 'user_info' in Chat.boot ) {
			const emails = Chat.user.get_emails()
			for (const email of emails) {
				var exists = false

				for (const room of state.rooms) {
					if ( room.type === 'Direct' ) {
						if ( room.owner === email || squash(room.users) === email )
							exists = true
					}
				}

				if ( !exists )
					contacts.push({ owner: Chat.session.user, users: [email] })
			}
		}
		const rooms      = state.query ? Chat.chat.room.search(state.query, state.rooms.concat(contacts)) : Chat.chat.room.sort(state.rooms)

		const layout     = state.span  ? Chat.Chat.Layout.PAGE : Chat.Chat.Layout.POPPER

		const RoomList   = isEmpty(rooms) && !state.query ?
			h("div", { class: "vcenter" },
				h("div", { class: "text-center text-extra-muted" },
					h("p","",__("You don't have any messages yet."))
				)
			)
			:
			h(Chat.Chat.Widget.RoomList, { rooms: rooms, click: room =>  {
				if ( room.name )
					this.room.select(room.name)
				else
					Chat.chat.room.create("Direct", room.owner, squash(room.users), ({ name }) => this.room.select(name))
			}})
		const Room       = h(Chat.Chat.Widget.Room, { ...state.room, onQuery, welcomeMessage, samplePrompts,
			inputPlaceholder, roomName, botName, roomFooter, layout: layout, destroy: () => {
			this.setState({
				room: { name: null, messages: [ ] }
			})
		}})

		const component  = layout === Chat.Chat.Layout.POPPER ?
			h(Chat.Chat.Widget.Popper, { active, heading: ActionBar, page: state.room.name && Room, target: props.target,
				toggle: (t) => this.setState({ toggle: t }) },
				RoomList
			)
			:
			h("div", { class: "Chat-chat-popper" },
				h("div", { class: "Chat-chat-popper-collapse" },
					h("div", { class: "panel panel-default panel-span", style: { width: "25%" } },
						h("div", { class: "panel-heading" },
							ActionBar
						),
						RoomList
					),
					Room
				)
			)

		return (
			h("div", { class: "Chat-chat" },
				component
			)
		)
	}
}
Chat.Chat.Widget.defaultState =  {
	  query: "",
	profile: { },
	  rooms: [ ],
	   room: { name: null, messages: [ ], typing: [ ] },
	 toggle: false,
	   span: false
}
Chat.Chat.Widget.defaultProps = {
	layout: Chat.Chat.Layout.POPPER
}

/**
 * @description Chat Widget Popper HOC.
 */
Chat.Chat.Widget.Popper
=
class extends Component {
	constructor (props) {
		super (props)
		this.setup(props);
	}

	setup (props) {
		const { active } = props;

		this.toggle = this.toggle.bind(this)

		this.state  = {
			...Chat.Chat.Widget.Popper.defaultState,
			active
		}

		if ( props.target )
			$(props.target).click(() => this.toggle())

		Chat.chat.widget = this
	}

	toggle  (active) {
		let toggle
		if ( arguments.length === 1 )
			toggle = active
		else
			toggle = this.state.active ? false : true

		this.setState({ active: toggle })

		this.props.toggle(toggle)
	}

	componentDidMount ( ) {
		$(document.body).on('click', '.page-container, .Chat-chat-close', ({ currentTarget }) => {
			this.toggle(false)
		})
	}

	render  ( )  {
		const { props, state } = this

		return !state.destroy ?
		(
			h("div", { class: "Chat-chat-popper", style: !props.target ? { "margin-bottom": "90px" } : null },
				!props.target ?
					h(Chat.components.FAB, {
						  class: "Chat-fab",
						   icon: state.active ? "fa fa-fw fa-times" : "font-heavy fa fa-fw fa-comment",
						   size: isMobile() ? null : "large",
						   type: "brand",
						onclick: () => this.toggle(),
					}) : null,
				state.active ?
					h("div", { class: "Chat-chat-popper-collapse" },
						props.page ? props.page : (
							h("div", { class: `panel panel-default ${isMobile() ? "panel-span" : ""}` },
								h("div", { class: "panel-heading" },
									props.heading
								),
								props.children
							)
						)
				) : null
			)
		) : null
	}
}
Chat.Chat.Widget.Popper.defaultState
=
{
	 active: false,
	destroy: false
}

/**
 * @description Chat.Chat.Widget ActionBar Component
 */
Chat.Chat.Widget.ActionBar
=
class extends Component {
	constructor (props) {
		super (props)

		this.change = this.change.bind(this)
		this.submit = this.submit.bind(this)

		this.state  = Chat.Chat.Widget.ActionBar.defaultState
	}

	change (e) {
		const { props, state } = this

		this.setState({
			[e.target.name]: e.target.value
		})

		props.change(state.query)
	}

	submit (e) {
		const { props, state } = this

		e.preventDefault()

		props.submit(state.query)
	}

	render ( ) {
		const me               = this
		const { props, state } = this
		const { actions }      = props

		return (
			h("div", { class: `Chat-chat-action-bar ${props.class ? props.class : ""}` },
				h("form", { oninput: this.change, onsubmit: this.submit },
					h("input", { autocomplete: "off", class: "form-control input-sm", name: "query", value: state.query, placeholder: props.placeholder || "Search" }),
				),
				!isEmpty(actions) ?
					actions.map(action => h(Chat.Chat.Widget.ActionBar.Action, { ...action })) : null,
				!isMobile() ?
					h(Chat.Chat.Widget.ActionBar.Action, {
						icon: `octicon octicon-screen-${state.span ? "normal" : "full"}`,
						onclick: () => {
							const span = !state.span
							me.setState({ span })
							props.span(span)
						}
					})
					:
					null
			)
		)
	}
}
Chat.Chat.Widget.ActionBar.defaultState
=
{
	query: null,
	 span: false
}

/**
 * @description Chat.Chat.Widget ActionBar's Action Component.
 */
Chat.Chat.Widget.ActionBar.Action
=
class extends Component {
	render ( ) {
		const { props } = this

		return (
			h(Chat.components.Button, { size: "small", class: "btn-action", ...props },
				props.icon ? h("i", { class: props.icon }) : null,
				`${props.icon ? " " : ""}${props.label ? props.label : ""}`
			)
		)
	}
}

/**
 * @description Chat.Chat.Widget RoomList Component
 */
Chat.Chat.Widget.RoomList
=
class extends Component {
	render ( ) {
		const { props } = this
		const rooms     = props.rooms

		return !isEmpty(rooms) ? (
			h("ul", { class: "Chat-chat-room-list nav nav-pills nav-stacked" },
				rooms.map(room => h(Chat.Chat.Widget.RoomList.Item, { ...room, click: props.click }))
			)
		) : null
	}
}

/**
 * @description Chat.Chat.Widget RoomList's Item Component
 */
Chat.Chat.Widget.RoomList.Item
=
class extends Component {
	render ( ) {
		const { props }    = this
		const item         = { }

		if ( props.type === "Group" ) {
			item.title     = props.room_name
			item.image     = props.avatar

			if ( !isEmpty(props.typing) ) {
				props.typing  = toArray(props.typing) // HACK: (BUG) why does typing return a string?
				const names   = props.typing.map(user => Chat.user.first_name(user))
				item.subtitle = `${names.join(", ")} typing...`
			} else
			if ( props.last_message ) {
				const message = props.last_message
				const content = message.content

				if ( message.type === "File" ) {
					item.subtitle = `📁 ${content.name}`
				} else {
					item.subtitle = props.last_message.content
				}
			}
		} else {
			const user     = props.owner === Chat.session.user ? squash(props.users) : props.owner

			item.title     = Chat.user.full_name(user)
			item.image     = Chat.user.image(user)
			item.abbr      = Chat.user.abbr(user)

			if ( !isEmpty(props.typing) )
				item.subtitle = 'typing...'
			else
			if ( props.last_message ) {
				const message = props.last_message
				const content = message.content

				if ( message.type === "File" ) {
					item.subtitle = `📁 ${content.name}`
				} else {
					item.subtitle = props.last_message.content
				}
			}
		}

		let is_unread = false
		if ( props.last_message ) {
			item.timestamp = Chat.chat.pretty_datetime(props.last_message.creation)
			is_unread = !props.last_message.seen.includes(Chat.session.user)
		}

		return (
			h("li", null,
				h("a", { class: props.active ? "active": "", onclick: () => {
					if (props.last_message) {
						Chat.chat.message.seen(props.last_message.name);
					}
					props.click(props)
				} },
					h("div", { class: "row" },
						h("div", { class: "col-xs-9" },
							h(Chat.Chat.Widget.MediaProfile, { ...item })
						),
						h("div", { class: "col-xs-3 text-right" },
							[
								h("div", { class: "text-muted", style: { "font-size": "9px" } }, item.timestamp),
								is_unread ? h("span", { class: "indicator red" }) : null
							]
						),
					)
				)
			)
		)
	}
}

/**
 * @description Chat.Chat.Widget's MediProfile Component.
 */
Chat.Chat.Widget.MediaProfile
=
class extends Component {
	render ( ) {
		const { props } = this

		const position  = Chat.Chat.Widget.MediaProfile.POSITION[props.position || "left"]
		const avatar    = (
			h("div", { class: `${position.class} media-middle` },
				h(Chat.components.Avatar, { ...props,
					title: props.title,
					image: props.image,
					 size: props.size,
					 abbr: props.abbr
				})
			)
		)

		return (
			h("div", { class: "media", style: position.class === "media-right" ? { "text-align": "right" } : null },
				// position.class === "media-left"  ? avatar : null,
				h("div", { class: "media-body" },
					h("div", { class: "media-heading ellipsis small", style: `font-size: 14px; max-width: ${props.width_title || "100%"} display: inline-block` }, props.title),
					props.content  ? h("div","",h("small","",props.content))  : null,
					props.subtitle ? h("div",{ class: "media-subtitle small" },h("small", { class: "text-muted" }, props.subtitle)) : null
				),
				// position.class === "media-right" ? avatar : null
			)
		)
	}
}
Chat.Chat.Widget.MediaProfile.POSITION
=
{
	left: { class: "media-left" }, right: { class: "media-right" }
}

/**
 * @description Chat.Chat.Widget Room Component
 */
Chat.Chat.Widget.Room
=
class extends Component {
	constructor (props) {
		super (props)

		this.sendMessage = this.sendMessage.bind(this)
		
		this.state = {
			incoming: false
		}
	}

	render ( ) {
		const { props, state } = this
		const { roomFooter, welcomeMessage, samplePrompts,
			inputPlaceholder } = props;
		const { incoming } = state;

		const hints =
		[
			{
				 match: /@(\w*)$/,
				search: function (keyword, callback) {
					if ( props.type === 'Group' ) {
						const query = keyword.slice(1)
						const users = [].concat(toArray(props.owner), props.users)
						const grep  = users.filter(user => user !== Chat.session.user && user.indexOf(query) === 0)

						callback(grep)
					}
				},
				component: function (item) {
					return (
						h(Chat.Chat.Widget.MediaProfile, {
							title: Chat.user.full_name(item),
							image: Chat.user.image(item),
							 size: "small"
						})
					)
				}
			},
			{
				match: /:([a-z]*)$/,
			   search: function (keyword, callback) {
					Chat.chat.emoji(function (emojis) {
						const query = keyword.slice(1)
						const items = [ ]
						for (const emoji of emojis)
							for (const alias of emoji.aliases)
								if ( alias.indexOf(query) === 0 )
									items.push({ name: alias, value: emoji.emoji })

						callback(items)
					})
			   },
				 content: (item) => item.value,
			   component: function (item) {
					return (
						h(Chat.Chat.Widget.MediaProfile, {
							title: item.name,
							 abbr: item.value,
							 size: "small"
						})
					)
			   }
		   }
		]

		const actions = compact([
			!isMobile() && {
				 icon: "camera",
				label: "Camera",
				onclick: ( ) => {
					const capture = new Chat.ui.Capture({
						animate: false,
						  error: true
					})
					capture.show()

					capture.submit(data_url => {
						// data_url
					})
				}
			},
			{
				 icon: "file",
				label: "File",
				onclick: ( ) => {
					new Chat.ui.FileUploader({
						doctype: "Chat Room",
						docname: props.name,
						on_success(file_doc) {
							const { file_url, filename } = file_doc
							Chat.chat.message.send(props.name, { path: file_url, name: filename }, {
								type: "File"
							})
						}
					})
				}
			}
		])

		if ( Chat.session.user !== 'Guest' ) {
			if (props.messages) {
				props.messages = toArray(props.messages)
				for (const message of props.messages)
					if ( !message.seen.includes(Chat.session.user) )
						Chat.chat.message.seen(message.name)
					else
						break
			}
		}

		return (
			h("div", { class: `panel panel-brand
				${props.name ? "panel-bg" : ""}
				${props.layout === Chat.Chat.Layout.PAGE || isMobile() ? "panel-span" : ""}`,
				style: props.layout === Chat.Chat.Layout.PAGE && { width: "75%", left: "25%", "box-shadow": "none" } },
				props.name && h(Chat.Chat.Widget.Room.Header, { ...props, on_back: props.destroy }),
				props.name ?
					!isEmpty(props.messages) || welcomeMessage?
						h(Chat.chat.component.ChatList, {
							messages: props.messages, incoming, welcomeMessage, samplePrompts,
							onClickAction: async action => {
								this.sendMessage(action)
							}
						})
						:
						h("div", { class: "panel-body", style: { "height": "100%" } },
							h("div", { class: "vcenter" },
								h("div", { class: "text-center text-extra-muted" },
									h(Chat.components.Octicon, { type: "comment-discussion", style: "font-size: 48px" }),
									h("p","",__("Start a conversation."))
								)
							)
						)
					:
					h("div", { class: "panel-body", style: { "height": "100%" } },
						h("div", { class: "vcenter" },
							h("div", { class: "text-center text-extra-muted" },
								h(Chat.components.Octicon, { type: "comment-discussion", style: "font-size: 125px" }),
								h("p","",__("Select a chat to start messaging."))
							)
						)
					),
				props.name ?
					h("div", { class: "chat-room-footer" },
						roomFooter ?
							h("div", { class: "chat-room-footer-banner panel panel-default" },
								h("div", { class: "panel-body" },
									h("div", { dangerouslySetInnerHTML: { __html: roomFooter } })
								)
							) : null,
						h(Chat.chat.component.ChatForm, {
							actions,
							inputPlaceholder,
							onchange: () => {
								Chat.chat.message.typing(props.name)
							},
							onsubmit: async (message) => {
								this.sendMessage(message);
							},
							hint: hints
						})
					)
					:
					null
			)
		)
	}

	async sendMessage (message) {
		const { props } = this;
		const { name, onQuery, botName }  = props;

		Chat.chat.message.send(name, message);

		if ( onQuery ) {
			this.setState({ incoming: true });

			const response = await onQuery(message);
			if ( response && response.message ) {
				Chat.chat.message.send(name, response.message, {
					user: botName || "Bot",
					prompts: response.prompts,
					links: response.links
				})
			}

			this.setState({ incoming: false })
		}
	}

}

Chat.Chat.Widget.Room.Header
=
class extends Component {
	render ( ) {
		const { props } = this;
		let { roomName, type } = props;

		const item = { }

		if ( roomName ) {
			type = "Visitor";
		}

		if ( ["Group", "Visitor"].includes(type) ) {
			item.route      = `Form/Chat Room/${props.name}`

			item.title      = roomName || props.room_name
			item.image      = props.avatar

			if ( !isEmpty(props.typing) ) {
				props.typing  = toArray(props.typing) // HACK: (BUG) why does typing return as a string?
				const users   = props.typing.map(user => Chat.user.first_name(user))
				item.subtitle = `${users.join(", ")} typing...`
			} else
				item.subtitle = props.type === "Group" ?
					__(`${props.users.length} ${pluralize('member', props.users.length)}`)
					:
					""
		}
		else {
			const user      = props.owner === Chat.session.user ? squash(props.users) : props.owner

			item.route      = `Form/User/${user}`

			item.title      = Chat.user.full_name(user)
			item.image      = Chat.user.image(user)

			if ( !isEmpty(props.typing) )
				item.subtitle = 'typing...'
		}

		const popper = props.layout === Chat.Chat.Layout.POPPER || isMobile()

		return (
			h("div", { class: "panel-heading", style: { "height": "50px" } }, // sorry. :(
				h("div", { class: "level" },
					popper && Chat.session.user !== "Guest" ?
						h(Chat.components.Button,{class:"btn-back",onclick:props.on_back},
							h(Chat.components.Octicon, { type: "chevron-left" })
						) : null,
					h("div","",
						h("div", { class: "panel-title" },
							h("div", { class: "cursor-pointer", onclick: () => {
								Chat.session.user !== "Guest" ?
									Chat.set_route(item.route) : null;
							}},
								h(Chat.Chat.Widget.MediaProfile, { ...item })
							)
						)
					),
					h("div", { class: popper ? "col-xs-2"  : "col-xs-3" },
						h("div", { class: "text-right" },
							isMobile() && h(Chat.components.Button, { class: "Chat-chat-close", onclick: props.toggle },
								h(Chat.components.Octicon, { type: "x" })
							)
						)
					)
				)
			)
		)
	}
}

/**
 * @description ChatList Component
 *
 * @prop {array} messages - ChatMessage(s)
 */
Chat.chat.component.ChatList
=
class extends Component {
	componentDidMount ( ) {
		this.$element  = $('.Chat-chat').find('.chat-list')
		this.$element.scrollTop(this.$element[0].scrollHeight)
	}

	componentDidUpdate ( ) {
		this.$element.scrollTop(this.$element[0].scrollHeight)
	}

	render ( ) {
		const { props }    = this;
		const { incoming, welcomeMessage, samplePrompts,
			onClickAction } = props;

		var messages = [ ]
		for (var i   = 0 ; i < this.props.messages.length ; ++i) {
			var   message   = this.props.messages[i]
			if ( i === 0 || !datetime.equal(message.creation, this.props.messages[i - 1].creation, 'day') )
				messages.push({ type: "Notification", content: message.creation.format('MMMM D YYYY, hh:mm A'),
					prompts: message.prompts, links: message.links })

			messages.push(message)
		}

		const components = messages
			.map(m => h(Chat.chat.component.ChatList.Item, {...m, onClickAction }))

		return (
			h("div",{class:"chat-list list-group"},
				isEmpty(messages) && welcomeMessage ?
					h(Chat.chat.component.ChatList.Item, {
						type: "Content",
						content: welcomeMessage,
						creation: new datetime.datetime(),
						actions: samplePrompts,
						onClickAction,
					}) : null,
				!isEmpty(messages) ?
					h("span", null,
						components,
						incoming ? h(Chat.chat.component.ChatList.Item, {
							type: "Loader"
						}) : null
					)
					:
					null
			)
		)
	}
}

/**
 * @description ChatList.Item Component
 *
 * @prop {string} name       - ChatMessage name
 * @prop {string} user       - ChatMessage user
 * @prop {string} room       - ChatMessage room
 * @prop {string} room_type  - ChatMessage room_type ("Direct", "Group" or "Visitor")
 * @prop {string} content    - ChatMessage content
 * @prop {datetime.datetime} creation - ChatMessage creation
 *
 * @prop {boolean} groupable - Whether the ChatMessage is groupable.
 */
Chat.chat.component.ChatList.Item
=
class extends Component {
	render ( ) {
		const { props } = this
		const { content, actions, links,
			prompts, user, type, room_type, onClickAction } = props

		const me        = user === Chat.session.user

		return (
			h("div",{class: "chat-list-item list-group-item"},
				type === "Notification" ?
					h("div",{class:"chat-list-notification"},
						h("div",{class:"chat-list-notification-content"},
							content
						)
					)
					:
					h("div",{class:`${me ? "text-right" : ""}`},
						room_type === "Group" && !me ?
							h(Chat.components.Avatar, {
								title: Chat.user.full_name(user),
								image: Chat.user.image(user)
							}) : null,
						h(Chat.chat.component.ChatBubble, {
							...props,
							actions: actions || prompts,
							links,
							onClickAction
						})
					)
			)
		)
	}
}

/**
 * @description ChatBubble Component
 *
 * @prop {string} name       - ChatMessage name
 * @prop {string} user       - ChatMessage user
 * @prop {string} room       - ChatMessage room
 * @prop {string} room_type  - ChatMessage room_type ("Direct", "Group" or "Visitor")
 * @prop {string} content    - ChatMessage content
 * @prop {datetime.datetime} creation - ChatMessage creation
 *
 * @prop {boolean} groupable - Whether the ChatMessage is groupable.
 */
Chat.chat.component.ChatBubble
=
class extends Component {
	constructor (props) {
		super (props)

		this.onclick = this.onclick.bind(this)
	}

	onclick ( ) {
		const { props } = this
		if ( props.user === Chat.session.user ) {
			Chat.quick_edit("Chat Message", props.name, (values) => {

			})
		}
	}

	render  ( ) {
		const { props }  = this;
		let { content, actions, links, onClickAction, type, creation } = props;

		const me        = props.user === Chat.session.user
		const read      = !isEmpty(props.seen) && !props.seen.includes(Chat.session.user)

		if ( type == "Loader" ) {
			content  = `🤔 <img src="${iconThreeDots}" style="width: 25px; height: 25px;"/>`
		} else {
			creation = props.creation.format('hh:mm A')
		}

		return (
			h("div",{class:`chat-bubble ${props.groupable ? "chat-groupable" : ""} chat-bubble-${me ? "r" : "l"}`,
				onclick: this.onclick,
				style: `min-width: ${type == "Loader" ? "0" : "20%"}`},
				// props.room_type === "Group" && !me?
				h("div",{class:"chat-bubble-author"},
					h("a", { onclick: () => { Chat.set_route(`Form/User/${props.user}`) } },
						me ? "You" : Chat.user.full_name(props.user)
					)
				), // : null,
				h("div",{class:"chat-bubble-content",
					style: `margin-bottom: ${type == "Loader" ? "0" : "5px"}`},
						h("small","",
							props.type === "File" ?
								h("a", { class: "no-decoration", href: content.path, target: "_blank" },
									h(Chat.components.FontAwesome, { type: "file", fixed: true }), ` ${content.name}`
								)
								:
								h("div", { dangerouslySetInnerHTML: { __html: linkify(nl2br(content)) } })
						),
						!isEmpty(links) ?
							h("div", { class: "chat-bubble-links" },
								h("hr", { style: `margin: 5px 0; border-color: #fff` }),
								h("ol", { style: "margin: 0px; font-size: 12px"},
									links.map(link => 
										h("li", null, 
											h("a", { href: link.url, target: "_blank" },
												link.title
											)
										)
									)
								)
							) : null,
						!isEmpty(actions) ?
							h("div", null,
								h("hr", { style: `margin: 5px 0; border-color: #fff` }),
								h("div",{class:"chat-bubble-actions btn-group-vertical"},
									actions.map(action => {
										return (
											h(Chat.components.Button, {
												class: "btn-xs",
												onclick: e => {
													e.preventDefault()
													if ( onClickAction ) {
														onClickAction(action)
													}
												}
											},
												h("small", null, action)
											)
										)
									})
								)
							)  : null
				),
				props.type !== "Loader" ?
					h("div",{class:"chat-bubble-meta"},
						h("span",{class:"chat-bubble-creation"},creation),
						me && read ?
							h("span",{class:"chat-bubble-check"},
								h("i",{class:"fa fa-check"})
							) : null
					) : null
			)
		)
	}
}

/**
 * @description ChatForm Component
 */
Chat.chat.component.ChatForm
=
class extends Component {
	constructor (props) {
		super (props)

		this.onchange   = this.onchange.bind(this)
		this.onsubmit   = this.onsubmit.bind(this)

		this.hint        = this.hint.bind(this)

		this.state       = Chat.chat.component.ChatForm.defaultState
	}

	onchange (e) {
		const { props, state } = this
		const value            = e.target.value

		this.setState({
			[e.target.name]: value
		})

		props.onchange(state)

		this.hint(value)
	}

	hint (value) {
		const { props, state } = this

		if ( props.hint ) {
			const tokens =  value.split(" ")
			const sliced = tokens.slice(0, tokens.length - 1)

			const token  = tokens[tokens.length - 1]

			if ( token ) {
				props.hint   = toArray(props.hint)
				const hint   = props.hint.find(hint => hint.match.test(token))

				if ( hint ) {
					hint.search(token, items => {
						const hints = items.map(item => {
							// You should stop writing one-liners! >_>
							const replace = token.replace(hint.match, hint.content ? hint.content(item) : item)
							const content = `${sliced.join(" ")} ${replace}`.trim()
							item = { component: hint.component(item), content: content }

							return item
						}).slice(0, hint.max || 5)

						this.setState({ hints })
					})
				}
				else
					this.setState({ hints: [ ] })
			} else
				this.setState({ hints: [ ] })
		}
	}

	onsubmit (e) {
		e.preventDefault()

		if ( this.state.content ) {
			this.props.onsubmit(this.state.content)

			this.setState({ content: null })
		}
	}

	render ( ) {
		const { props, state } = this
		let { inputPlaceholder } = props;

		if ( !inputPlaceholder ) {
			inputPlaceholder = __("Type a message...")
		}

		return (
			h("div",{class:"chat-form"},
				state.hints.length ?
					h("ul", { class: "hint-list list-group" },
						state.hints.map((item) => {
							return (
								h("li", { class: "hint-list-item list-group-item" },
									h("a", { href: "javascript:void(0)", onclick: () => {
										this.setState({ content: item.content, hints: [ ] })
									}},
										item.component
									)
								)
							)
						})
					) : null,
				h("form", { oninput: this.onchange, onsubmit: this.onsubmit },
					h("div",{class:"input-group input-group-lg"},
						!isEmpty(props.actions) ?
							h("div",{class:"input-group-btn dropup"},
								h(Chat.components.Button,{ class: `${(Chat.session.user === "Guest" ? "disabled" : "dropdown-toggle")} no-border`, "data-toggle": "dropdown"},
									h(Chat.components.FontAwesome, { class: "text-muted", type: "paperclip", fixed: true })
								),
								h("div",{ class:"dropdown-menu dropdown-menu-left", onclick: e => e.stopPropagation() },
									!isEmpty(props.actions) && props.actions.map((action) => {
										return (
											h("li", null,
												h("a",{onclick:action.onclick},
													h(Chat.components.FontAwesome,{type:action.icon,fixed:true}), ` ${action.label}`,
												)
											)
										)
									})
								)
							) : null,
						h("textarea", {
									class: "form-control",
									 name: "content",
									value: state.content,
							  placeholder: inputPlaceholder,
								autofocus: true,
							   onkeypress: (e) => {
									if ( e.which === Chat.ui.keycode.RETURN && !e.shiftKey )
										this.onsubmit(e)
							   }
						}),
						h("div",{class:"input-group-btn"},
							h(Chat.components.Button, { onclick: this.onsubmit, type: "" },
								h(Chat.components.FontAwesome, { class: !isEmpty(state.content) ? "text-primary" : "text-muted", type: "send", fixed: true })
							),
						)
					)
				)
			)
		)
	}
}
Chat.chat.component.ChatForm.defaultState
=
{
	content: null,
	  hints: [ ],
}

/**
 * @description EmojiPicker Component
 *
 * @todo Under Development
 */
Chat.chat.component.EmojiPicker
=
class extends Component  {
	render ( ) {
		const { props } = this

		return (
			h("div", { class: `Chat-chat-emoji dropup ${props.class}` },
				h(Chat.components.Button, { type: "brand", class: "dropdown-toggle", "data-toggle": "dropdown" },
					h(Chat.components.FontAwesome, { type: "smile-o", fixed: true })
				),
				h("div", { class: "dropdown-menu dropdown-menu-right", onclick: e => e.stopPropagation() },
					h("div", { class: "panel panel-default" },
						h(Chat.chat.component.EmojiPicker.List)
					)
				)
			)
		)
	}
}
Chat.chat.component.EmojiPicker.List
=
class extends Component {
	render ( ) {
		const { props } = this

		return (
			h("div", { class: "list-group" },

			)
		)
	}
}

/**
 * @description Python equivalent to sys.platform
 */
Chat.provide('_')
Chat._.platform   = () => {
	const string    = navigator.appVersion

	if ( string.includes("Win") ) 	return "Windows"
	if ( string.includes("Mac") ) 	return "Darwin"
	if ( string.includes("X11") ) 	return "UNIX"
	if ( string.includes("Linux") ) return "Linux"

	return undefined
}

/**
 * @description Chat's Asset Helper
 */
Chat.provide('assets')
Chat.assets.image = (image, app = 'Chat') => {
	const  path   = `/assets/${app}/images/${image}`
	return path
}

/**
 * @description Notify using Web Push Notifications
 */
Chat.provide('boot')
Chat.provide('browser')
Chat.browser.Notification = 'Notification' in window

Chat.notify = (string, options) => {
	Chat.log = Logger.get('Chat.notify')

	const OPTIONS = {
		icon: Chat.assets.image('favicon.png', 'Chat'),
		lang: Chat.boot.lang || "en"
	}
	options       = Object.assign({ }, OPTIONS, options)

	if ( !Chat.browser.Notification )
		logger.error('ERROR: This browser does not support desktop notifications.')

	Notification.requestPermission(status => {
		if ( status === "granted" ) {
			const notification = new Notification(string, options)
		}
	})
}

Chat.chat.render = ({
	render   = true,
	active   = true,
	force    = false,
	onQuery  = null,

	botName  = null,
	roomName = null,

	welcomeMessage = null,
	samplePrompts  = null,

	roomFooter     = null,

	inputPlaceholder = null,
} = { }) =>
{
	logger.info(`${render ? "Enable" : "Disable"} Chat for User.`);

	const desk = 'desk' in Chat
	if ( desk ) {
		// With the assumption, that there's only one navbar.
		const $placeholder = $('.navbar .Chat-chat-dropdown')

		// Render if Chat-chat-toggle doesn't exist.
		if ( Chat.utils.is_empty($placeholder.has('.Chat-chat-toggle')) ) {
			const $template = $(`
				<a class="dropdown-toggle Chat-chat-toggle" data-toggle="dropdown">
					<div>
						<i class="octicon octicon-comment-discussion"/>
					</div>
				</a>
			`)

			$placeholder.addClass('dropdown hidden')
			$placeholder.html($template)
		}

		if ( render ) {
			$placeholder.removeClass('hidden')
		} else {
			$placeholder.addClass('hidden')
		}
	}

	// Avoid re-renders. Once is enough.
	if ( !Chat.chatter || force ) {
		Chat.chatter = new Chat.Chat({
			target: desk ? '.Chat-chat-toggle' : null
		})

		if ( render ) {
			if ( Chat.session.user === 'Guest' && !desk ) {
				Chat.store = Chat.Store.get('Chat.chat')
				var token  = Chat.store.get('guest_token')

				logger.info(`Local Guest Token - ${token}`)

				const setup_room = (token) =>
				{
					logger.info(`Setting Up Room...`);

					return new Promise(resolve => {
						Chat.chat.room.create("Visitor", token).then(room => {
							logger.info(`Visitor Room Created: ${room.name}`)
							Chat.chat.room.subscribe(room.name)

							var reference = room

							Chat.chat.room.history(room.name).then(messages => {
								const  room = { ...reference, messages: messages }
								return room
							}).then(room => {
								resolve(room)
							})
						})
					})
				}

				const renderArgs = {
					roomName, botName, onQuery, active,
					welcomeMessage, samplePrompts, roomFooter,
					inputPlaceholder
				}

				if ( !token ) {
					Chat.chat.website.token().then(token => {
						logger.info(`Generated Guest Token - ${token}`)
						Chat.store.set('guest_token', token)

						setup_room(token).then(room => {
							Chat.chatter.render({
								...renderArgs,
								room
							});
						})
					})
				} else {
					logger.info(`Using Existing Guest Token - ${token}`)
					setup_room(token).then(room => {
						Chat.chatter.render({
							...renderArgs,
							room
						});
					})
				}
			} else {
				Chat.chatter.render(renderArgs)
			}
		}
	}
}

// stubs
Chat.provide('session.user')
Chat.provide('user.get_emails', () => null);
Chat.provide('ui.Dialog',       class { show () { } });

Chat.session.user = 'Guest';

Chat.realtime.on  = (event, callback) => {
	logger.info(`Recieved Event - ${event}`)
	document.addEventListener(event, callback)
};

const setup = ({
	user     = null,
	active   = true,
	onQuery  = null,

	botName  = null,
	roomName = null,

	welcomeMessage = null,
	samplePrompts  = null,

	roomFooter     = null,
	
	inputPlaceholder = null,
} = { }) => {
	const logger = Logger.get('Chat')
	
	logger.info('Setting up Chat Instance...')

	if ( !user ) {
		// Create/Get Chat Profile for Guest User, retrieve enable_chat
		logger.info('Creating a Chat Profile.')

		Chat.chat.profile.create('enable_chat').then(({ enable_chat }) => {
			logger.info(`Chat Profile created for User ${Chat.session.user}.`)

			if ( 'desk' in Chat && Chat.sys_defaults ) { // same as desk?
				const should_render = Boolean(parseInt(Chat.sys_defaults.enable_chat)) && enable_chat
				Chat.chat.render({ render: should_render })
			}
		})

		// Triggered when a User updates his/her Chat Profile.
		// Don't worry, enable_chat is broadcasted to this user only. No overhead. :)
		Chat.chat.profile.on.update((user, profile) => {
			if ( user === Chat.session.user && 'enable_chat' in profile ) {
				logger.warn(`Chat Profile update (Enable Chat - ${Boolean(profile.enable_chat)})`)
				const should_render = Boolean(parseInt(Chat.sys_defaults.enable_chat)) && profile.enable_chat
				Chat.chat.render({ render: should_render })
			}
		})

		Chat.chat.render({
			render: true,
			active,
			onQuery,

			botName,
			roomName,

			welcomeMessage,
			samplePrompts,

			roomFooter,
			
			inputPlaceholder
		})
	} else {
		// Website Settings
		logger.info('Retrieving Chat Website Settings.')
		Chat.chat.website.settings(["socketio", "enable", "enable_from", "enable_to"])
			.then(settings => {
				logger.info(`Chat Website Setting - ${JSON.stringify(settings)}`)
				logger.info(`Chat Website Setting - ${settings.enable ? "Enable" : "Disable"}`)

				var should_render = settings.enable
				if ( settings.enable_from && settings.enable_to ) {
					logger.info(`Enabling Chat Schedule - ${settings.enable_from.format()} : ${settings.enable_to.format()}`)

					const range   = new datetime.range(settings.enable_from, settings.enable_to)
					should_render = range.contains(datetime.now())
				}

				if ( should_render ) {
					logger.info("Initializing Socket.IO")
					Chat.socketio.init(settings.socketio.port)
				}

				Chat.chat.render({ render: should_render })
		})
	}
}

Chat.init = ({
	user     = null,
	active   = true,
	onQuery  = null,
	botName  = null,
	roomName = null,

	welcomeMessage 	 = null,
	samplePrompts  	 = null,

	roomFooter     	 = null,

	inputPlaceholder = null,
} = { }) => {
	setup({ user, active, onQuery, botName, roomName, welcomeMessage,
		samplePrompts, roomFooter, inputPlaceholder });
};

export default Chat;