import {
    isEmpty
} from './type';

/**
 * @description Returns the first element of an array.
 *
 * @param   {array} array - The array.
 *
 * @returns - The first element of an array, undefined elsewise.
 *
 * @example
 * head([1, 2, 3])
 * // returns 1
 * head([])
 * // returns undefined
 */
export const head = arr => isEmpty(arr) ? undefined : arr[0]

/**
 * @description Returns a copy of the given array (shallow).
 *
 * @param   {array} array - The array to be copied.
 *
 * @returns {array}       - The copied array.
 *
 * @example
 * copy(["foobar", "barfoo"])
 * // returns ["foobar", "barfoo"]
 *
 * @todo Add optional deep copy.
 */
export const copy = array => {
	if ( Array.isArray(array) )
		return array.slice()
	else
		throw TypeError(`Expected Array, recieved ${typeof array} instead.`)
}

/**
 * @description Return a singleton if array contains a single element.
 *
 * @param   {array}        list - An array to squash.
 *
 * @returns {array|object}      - Returns an array if there's more than 1 object else the first object itself.
 *
 * @example
 * squash(["foo"])
 * // returns "foo"
 *
 * squash(["foo", "bar"])
 * // returns ["foo", "bar"]
 */
export const squash = list => Array.isArray(list) && list.length === 1 ? list[0] : list

/**
 * @description Removes falsey values from an array.
 *
 * @example
 * compact([1, 2, false, NaN, ''])
 * // returns [1, 2]
 */
export const compact = array => array.filter(Boolean)