import { Router } from 'express'
const router = Router()

import * as StatsController from '../controllers/stats.controller'

router.get('/', StatsController.getData)

router.post('/', StatsController.getDataByPeriod)

export default router