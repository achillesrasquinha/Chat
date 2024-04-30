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

/**
 * @description Pluralizes a given word.
 *
 * @param  {string} word  - The word to be pluralized.
 * @param  {number} count - The count.
 *
 * @return {string}       - The pluralized string.
 *
 * @example
 * pluralize('member',  1)
 * // returns "member"
 * pluralize('members', 0)
 * // returns "members"
 *
 * @todo Handle more edge cases.
 */
export const pluralize = (word, count = 0, suffix = 's') => `${word}${count === 1 ? '' : suffix}`

/**
 * @description Captializes a given string.
 *
 * @param   {word}  - The word to be capitalized.
 *
 * @return {string} - The capitalized word.
 *
 * @example
 * Chat._.capitalize('foobar')
 * // returns "Foobar"
 */
export const capitalize = word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`

export const nl2br = string => string.replace(/\n/g, '<br>');