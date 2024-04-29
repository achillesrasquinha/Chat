/**
 * @description Python-inspired format extension for string objects.
 *
 * @param  {string} string - A string with placeholders.
 * @param  {object} object - An object with placeholder, value pairs.
 *
 * @return {string}        - The formatted string.
 *
 * @example
 * format('{foo} {bar}', { bar: 'foo', foo: 'bar' })
 * // returns "bar foo"
 */
export const format = (string, object) => {
	for (const key in object)
		string  = string.replace(`{${key}}`, object[key])
	return string
}