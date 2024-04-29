/**
 * @description The base class for all Errors.
 *
 * @example
 * try
 *      throw new ChatError("foobar")
 * catch (e)
 *      console.log(e.name)
 * // returns "ChatError"
 *
 * @see  https://stackoverflow.com/a/32749533
 * @todo Requires "transform-builtin-extend" for Babel 6
 */
export class ChatError extends Error {
	constructor (message) {
		super (message)

		this.name = 'ChatError'

		if ( typeof Error.captureStackTrace === 'function' )
			Error.captureStackTrace(this, this.constructor)
		else
			this.stack = (new Error(message)).stack
	}
}

/**
 * @description TypeError
 */
export class TypeError extends ChatError {
	constructor (message) {
		super (message)

		this.name = this.constructor.name
	}
}

/**
 * @description ValueError
 */
export class ValueError extends ChatError {
	constructor (message) {
		super (message)

		this.name = this.constructor.name
	}
}

/**
 * @description ImportError
 */
export class ImportError extends ChatError {
	constructor (message) {
		super (message)

		this.name  = this.constructor.name
	}
}