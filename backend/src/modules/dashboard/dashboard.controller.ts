import { type Request, type Response } from 'express'
import { DashboardService } from './dashboard.service.js'

export class DashboardController {
  static async getAdminDashboard(_req: Request, res: Response) {
    const result = await DashboardService.getAdminDashboard()

    return res.status(200).json(result)
  }
}