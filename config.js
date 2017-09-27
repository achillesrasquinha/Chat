import path from 'path'

const config                  = { }

config.name                   = 'frappe-chat'
config.version                = '0.1.0'

config.path                   = { }
config.path.base              = path.resolve('.');
config.path.source            = { }
config.path.source.base       = path.join(config.path.base, 'src')
config.path.distribution      = { }
config.path.distribution.base = path.join(config.path.base, 'dist')

config.path.source.js         = { }
config.path.source.js.base    = path.join(config.path.source.base, 'js')
config.path.source.js.main    = path.join(config.path.source.js.base, 'index.js')

config.path.distribution.js = path.join(config.path.distribution.base, 'js')

export default config