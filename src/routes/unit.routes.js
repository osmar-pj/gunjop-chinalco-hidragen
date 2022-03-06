import { Router } from 'express'
const router = Router()

import * as UnitsController from '../controllers/unit.controller'

router.get('/', UnitsController.getUnidades)

export default router