/**
 * @description Check whether an array|string|object|jQuery is empty.
 *
 * @param   {any}     value - The value to be checked on.
 *
 * @returns {boolean}       - Returns if the object is empty.
 *
 * @example
 * isEmpty([])      // returns true
 * isEmpty(["foo"]) // returns false
 *
 * isEmpty("")      // returns true
 * isEmpty("foo")   // returns false
 *
 * isEmpty({ })            // returns true
 * isEmpty({ foo: "bar" }) // returns false
 *
 * isEmpty($('.papito'))   // returns false
 *
 * @todo Handle other cases.
 */
export const isEmpty = value => {
	let empty = false

	if ( value === undefined || value === null )
		empty = true
	else
	if ( Array.isArray(value) || typeof value === 'string' || value instanceof $ )
		empty = value.length === 0
	else
	if ( typeof value === 'object' )
		empty = Object.keys(value).length === 0

	return empty
}

/**
 * @description Converts a singleton to an array, if required.
 *
 * @param {object} item - An object
 *
 * @example
 * toArray("foo")
 * // returns ["foo"]
 *
 * toArray(["foo"])
 * // returns ["foo"]
 *
 * @see https://docs.oracle.com/javase/8/docs/api/java/util/Arrays.html#asList-T...-
 */
export const toArray = item => Array.isArray(item) ? item : [item]