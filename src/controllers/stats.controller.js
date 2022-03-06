import { getUnits, getStats } from '../libs/orfData';

export const getData = async (req, res) => {
    try {
        const tags = await getUnits()
        const startHourDay = 8
        const endHourDay = 20
        const startHourNight = 20
        const endHourNight = 8
        const nroDays = 1  // en array consider hasta 7 dias
        let totalData = []
        let dataWeekNight = []
        let dataWeekDay = []
        const nowHour = new Date().getHours()
        for (let j = 0; j < tags.length; j++) {
            dataWeekDay = []
            dataWeekNight = []
            for (let i = 0; i < nroDays + 1; i++) {
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
        res.status(200).json({
            status: 'success',
            data: {
                totalData
            }
        })
    } catch (err) {
        res.status(404).json({
        status: 'fail',
        message: err
        })
    }
}

export const getDataByPeriod = async (req, res) => {
    try {
        const start = req.start
        const end = req.end
        const tags = await getUnits()
        const startHourDay = 8
        const endHourDay = 20
        const startHourNight = 20
        const endHourNight = 8
        const nroDays = 7  // en array consider hasta 7 dias
        let totalData = []
        let dataWeekNight = []
        let dataWeekDay = []
        const nowHour = new Date().getHours()
        for (let j = 0; j < tags.length; j++) {
            dataWeekDay = []
            dataWeekNight = []
            for (let i = 0; i < nroDays + 1; i++) {
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
        res.status(200).json({
        status: 'success',
        results: stats.length,
        data: {
            totalData
        }
        })
    } catch (err) {
        res.status(404).json({
        status: 'fail',
        message: err
        })
    }
}