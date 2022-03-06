import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
require('dotenv').config()
import { createServer } from 'http'

import UnitRoutes from './routes/unit.routes'
import StatsRoutes from './routes/stats.routes'

const app = express()
const server = createServer(app)
const socket = require('./socket')

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
socket.connect(server)

app.use('/api/units', UnitRoutes)
app.use('/api/stats', StatsRoutes)

server.listen(process.env.PORT, () => {
    console.log(`Server esta conectado en ${process.env.PORT}`)
})

export default app