import datetime from './util/datetime';
import {
    TypeError
} from './error';
import {
    format as _format
} from './util/string';

// loggers - A registry for loggers.
const LOGGERS = {}

/**
 * @description Logger Class
 *
 * @example
 * const logger = Logger.get('foobar')
 * logger.level = Logger.DEBUG
 *
 * logger.info('foobar')
 * // prints '[timestamp] foobar: foobar'
 */
class Logger {
	/**
	 * @description Logger Class's constructor.
	 *
	 * @param {string} name  - Name of the logger.
     * @param {number} level - Level of the logger (default: Logger.NOTSET).
	 */
	constructor (name, level) {
		if ( typeof name !== 'string' )
			throw new TypeError(`Expected string for name, got ${typeof name} instead.`)

		this.name   = name
		this.level  = level

		if ( !this.level ) {
			if ( false ) // REFACTOR
				this.level = Logger.ERROR
			else
				this.level = Logger.NOTSET
		}

		this.format = Logger.FORMAT
	}

	/**
	 * @description Get instance of Logger (return registered one if declared).
	 *
	 * @param {string} name - Name of the logger.
	 */
	static get (name, level) {
		if ( !(name in LOGGERS) ) {
            LOGGERS[name] = new Logger(name, level)
        }

		return LOGGERS[name]
	}

	debug (message) { this.log(message, Logger.DEBUG) }
	info  (message) { this.log(message, Logger.INFO)  }
	warn  (message) { this.log(message, Logger.WARN)  }
	error (message) { this.log(message, Logger.ERROR) }

	log (message, level) {
		const timestamp   = datetime.datetime.now()

		if ( level.value <= this.level.value ) {
			const format  = _format(this.format, {
				time: timestamp.format('HH:mm:ss'),
				name: this.name
			})

			console.log(`%c ${format}:`, `color: ${level.color}`, message)
		}
	}
}

Logger.DEBUG  = { value: 10, color: '#616161', name: 'DEBUG'  }
Logger.INFO   = { value: 20, color: '#2196F3', name: 'INFO'   }
Logger.WARN   = { value: 30, color: '#FFC107', name: 'WARN'   }
Logger.ERROR  = { value: 40, color: '#F44336', name: 'ERROR'  }
Logger.NOTSET = { value:  0,                   name: 'NOTSET' }

Logger.FORMAT = '{time} {name}'

export default Logger;