import dayjs from 'dayjs'
import {
    ImportError
} from '../error'

/**
 * @description datetime object. (Inspired by Python's datetime object).
 *
 * @example
 * const datetime = new datetime.datetime()
 */

export class datetime {
	/**
	 * @description datetime Class's constructor.
	 */
	constructor (instance, format = null) {
		if ( typeof dayjs === 'undefined' )
			throw new ImportError(`Day.js not installed.`)

		this.dayjs = instance ? dayjs(instance, format) : dayjs()
	}

	/**
	 * @description Returns a formatted string of the datetime object.
	 */
	format (format = null) {
		const  formatted = this.dayjs.format(format)
		return formatted
	}
};

/**
 * @description Returns the current datetime.
 *
 * @example
 * const dnow = new datetime.now()
 */
datetime.now = () => new datetime()

/**
 * @description daterange object.
 *
 * @example
 * const range = new datetime.range(datetime.now(), datetime.now())
 * range.contains(datetime.now())
 */
class range {
	constructor (start, end) {
		if ( typeof dayjs === undefined )
			throw new ImportError(`Day.js not installed.`)

		this.start = start
		this.end   = end
	}

	contains (datetime) {
		const  contains = datetime.dayjs.isBetween(this.start.dayjs, this.end.dayjs)
		return contains
	}
}

const equal = (a, b, type) => {
	a = a.dayjs
	b = b.dayjs

	const equal = a.isSame(b, type)

	return equal
}

/**
 * @description Compares two datetime.datetime objects.
 *
 * @param   {datetime.datetime} a - A datetime.datetime/dayjs object.
 * @param   {datetime.datetime} b - A datetime.datetime/dayjs object.
 *
 * @returns {number} 0 (if a and b are equal), 1 (if a is before b), -1 (if a is after b).
 *
 * @example
 * datetime.compare(datetime.now(), datetime.now())
 * // returns 0
 * const then = datetime.now()
 *
 * datetime.compare(then, datetime.now())
 * // returns 1
 */
const compare = (a, b) => {
	a = a.dayjs
	b = b.dayjs

	if ( a.isBefore(b) )
		return  1
	else
	if ( b.isBefore(a) )
		return -1
	else
		return  0
}

export default {
    datetime
}