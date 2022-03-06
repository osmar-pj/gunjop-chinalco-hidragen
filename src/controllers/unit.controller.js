import { getUnits } from '../libs/orfData'

export const getUnidades = async (req, res) => {
    try {
        const units = await getUnits()
        res.status(200).json({
            status: 'success',
            data: {
                units
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}