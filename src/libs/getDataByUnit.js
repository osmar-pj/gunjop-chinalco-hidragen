const wialon = require('wialon')

export const getDataByUnit = async (unitId) => {
    try {
        const session = await wialon().session
        await session.start({
            token: process.env.ORF_TOKEN
        })

        console.log(unitId)
        const paramsExecReport = {
            reportResourceId: 9878,
            reportTemplateId: 7,
            reportObjectId: unitId,
            reportObjectSecId: 0,
            reportObjectIdList: 0,
            interval: {
                from: Math.floor((new Date().getTime() - 1000*60*3)/1000),
                to: Math.floor(new Date().getTime()/1000),
                flags: 0
            }
        }
    
        const reports = await session.request('report/exec_report', paramsExecReport)
        const paramsGetResultRows = {
            tableIndex: 0,
            indexFrom: 0,
            indexTo: reports.reportResult.tables[0].rows,
        }
        
        const rows = await session.request('report/get_result_rows', paramsGetResultRows)
        // await session.request('core/logout', {})

        return rows
    } catch (error) {
        console.error(error);
    }
}