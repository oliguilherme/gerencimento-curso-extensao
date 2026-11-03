import { Router } from 'express'
import { DashboardController } from './dashboard.controller.js'
import { authMiddleware } from '../../middlewares/auth.middleware.js'
import { checkRole } from '../../middlewares/authorization.middleware.js'

const router = Router()

router.get(
  '/admin',
  authMiddleware,
  checkRole('ADMIN_DEPPI'),
  DashboardController.getAdminDashboard,
);

export { router as DashboardRoutes }