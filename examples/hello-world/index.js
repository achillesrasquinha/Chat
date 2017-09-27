import path    from 'path'
import express from 'express'

import config  from '../../config'

const app  = express();
const port = 5000

app.use('/static', express.static(config.path.distribution.base))
app.use('/assets', express.static(__dirname))
app.get('/', (req, res) => {
	const filepath = path.join(__dirname, 'index.html');
	
	res.sendFile(filepath);
});

app.listen(port, () => {
	console.log(`Running on http://localhost:${port}`)
});