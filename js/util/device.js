/**
 * @description Returns true, if the current device is a mobile device.
 *
 * @example
 * isMobile()
 * // returns true|false
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
 */
export const isMobile = () => {
	const regex    = new RegExp("Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini", "i")
	const agent    = navigator.userAgent
	const mobile   = regex.test(agent)

	return mobile
}