import mqtt from 'mqtt'
import { getStats, getUnits } from './libs/orfData'

const socketIO = require('socket.io')

const socket = {}
let io

function connect(server) {
    io = socketIO(server)
    socket.io = io
    let USERS = {}
    io.on('connection', socket => {
        console.log(`${socket.id} se conecto`)
        USERS[socket.id] = socket
    
        socket.on('disconnect', () => {
            console.log(`${socket.id} se desconecto`)
        })
    })

    const options = {
        clientId: 'MQTT-CHINALCO',
        username: 'mqttChinalco',
        password: ''
      }
      
      const connectUrl = process.env.URL_MQTT
      const client = mqtt.connect(connectUrl, options)
      client.on('connect', () => {
        console.log('Client connected by SERVER:')
        // Subscribe
        client.subscribe('gunjop/chinalco/#', { qos: 0 })
      })
      
      let sensors = []
      let datasFiltered = []
      
      client.on('message', async (topic, message) => {
        const data = JSON.parse(message.toString())
        data.createdAt = new Date()
        sensors.push(data)
        if (sensors.length > 10) {
            // reverse sensors
            // borrar ultimo dato
            sensors.shift()
        }
        if (sensors) {
            datasFiltered = sensors.reverse().filter((elem, index, self) => {
                return self.map(item => item.nm.toString()).indexOf(elem.nm.toString()) === index
            })
            // console.log(datasFiltered)
        }
      })

    setInterval(async () => {
        const tags = await getUnits()
        const startHourDay = 7.5
        const endHourDay = 19.5
        const startHourNight = 19.5
        const endHourNight = 7.5
        const nroDays = 6  // en array considerar hasta 7 dias
        let totalData = []
        let totalDataByUnit = []
        let dataWeekNight = []
        let dataWeekDay = []
        const nowHour = new Date().getHours()
        if (tags) {
            for (let j = 0; j < tags.length; j++) {
                totalDataByUnit = []
                dataWeekDay = []
                dataWeekNight = []
                for (let i = 0; i < nroDays + 1; i++) {  /// n = 0 empieza hoy
                    if (nowHour >= startHourDay && nowHour < endHourDay) {
                        const startDateNight = (new Date().setHours(startHourDay, 0, 0, 0) - 1000 * 60 * 60 * 24 * (nroDays - i + 1) + 1000 * 60 * 60 * 12)/1000
                        const endDateNight = (new Date().setHours(endHourDay, 0, 0, 0) - 1000 * 60 * 60 * 24 * (nroDays - i + 1) + 1000 * 60 * 60 * 12)/1000
                        const startDateDay = (new Date().setHours(startHourNight, 0, 0, 0) - 1000 * 60 * 60 * 24 * (nroDays - i + 1) + 1000 * 60 * 60 * 12)/1000
                        const endDateDay = (new Date().setHours(endHourNight, 0, 0, 0) - 1000 * 60 * 60 * 24 * (nroDays - i) + 1000 * 60 * 60 * 12)/1000
                        dataWeekDay.push(await getStats(tags[j].id, startDateDay, endDateDay))
                        dataWeekNight.push(await getStats(tags[j].id, startDateNight, endDateNight))
                    } else if (nowHour >= startHourNight || nowHour < endHourNight) {
                        const startDateDay = (new Date().setHours(startHourDay, 0, 0, 0) - 1000 * 60 * 60 * 24 * (nroDays - i))/1000
                        const endDateDay = (new Date().setHours(endHourDay, 0, 0, 0) - 1000 * 60 * 60 * 24 * (nroDays - i))/1000
                        const startDateNight = (new Date().setHours(startHourNight, 0, 0, 0) - 1000 * 60 * 60 * 24 * (nroDays - i))/1000
                        const endDateNight = (new Date().setHours(endHourNight, 0, 0, 0) - 1000 * 60 * 60 * 24 * (nroDays - i - 1))/1000
                        dataWeekDay.push(await getStats(tags[j].id, startDateDay, endDateDay))
                        dataWeekNight.push(await getStats(tags[j].id, startDateNight, endDateNight))
                    }
                }
                totalData.push({id: tags[j].nm, dataWeekDay, dataWeekNight})
            }
        }
        // console.log(totalData)
        for (let i in USERS) {
            USERS[i].emit('data', {
                totalData
            })
            USERS[i].emit('hidragen', {
                datasFiltered
            })
        }
    }, 30000)
    
    // setInterval(() => {
    //     let data = 9
    //     for (let i in USERS) {
    //         USERS[i].emit('data', data)
    //     }
    // }, 1000)
}

module.exports = {
    connect,
    socket
}

// PARA LLAMAR AL SOCKET DESDE DONDE SEA DEL BACKEND

/*
    const socket = require($route of socket.js$).socket
    const {socket} = require($route of socket.js$)
    socket.io.emit('data', data)
*/
