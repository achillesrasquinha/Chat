import path     from 'path'
import http     from 'http'
import express  from 'express'
import socketio from 'socket.io'

import config   from '../../config'

const app    = express()
const server = http.Server(app)
const io     = socketio.listen(server)

const port   = 5000

app.use('/static', express.static(config.path.distribution.base))
app.use('/assets', express.static(__dirname))

app.get('/', (req, res) => {
	const filepath = path.join(__dirname, 'index.html')
	
	res.sendFile(filepath)
})
server.listen(port, () => {
	console.log(`Running on http://localhost:${port}`)
})

io.on('frappe.event.connect', () => {
	console.log('Server: A connection occured.')
})