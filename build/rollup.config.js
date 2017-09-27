import path    from 'path'
import resolve from 'rollup-plugin-node-resolve'

import config  from '../config'

export default {
	  input: config.path.source.js.main,
	 output: 
	 {
		   file: path.join(config.path.distribution.js, `${config.name}.js`),
		 format: 'iife',
		   name: 'frappe'
	 },
	plugins:
	[
		resolve()
	]
}