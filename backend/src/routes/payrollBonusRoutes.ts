import { Router } from 'express';
import { PayrollBonusController } from '../controllers/payrollBonusController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payroll Bonus
 *   description: One-off bonus payment runs
 */

/**
 * @swagger
 * /api/v1/payroll-bonus/runs:
 *   post:
 *     summary: Create a new payroll bonus run
 *     tags: [Payroll Bonus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * @swagger
 * /api/v1/payroll-bonus/runs:
 *   get:
 *     summary: List all payroll bonus runs
 *     tags: [Payroll Bonus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * @swagger
 * /api/v1/payroll-bonus/runs/{id}:
 *   get:
 *     summary: Get details of a payroll bonus run
 *     tags: [Payroll Bonus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * @swagger
 * /api/v1/payroll-bonus/runs/{id}/status:
 *   patch:
 *     summary: Update status of a payroll bonus run
 *     tags: [Payroll Bonus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * @swagger
 * /api/v1/payroll-bonus/items/bonus:
 *   post:
 *     summary: Add a single bonus item
 *     tags: [Payroll Bonus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * @swagger
 * /api/v1/payroll-bonus/items/bonus/batch:
 *   post:
 *     summary: Add multiple bonus items in batch
 *     tags: [Payroll Bonus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * @swagger
 * /api/v1/payroll-bonus/runs/{payrollRunId}/items:
 *   get:
 *     summary: List all items in a payroll bonus run
 *     tags: [Payroll Bonus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payrollRunId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * @swagger
 * /api/v1/payroll-bonus/items/{itemId}:
 *   delete:
 *     summary: Delete a payroll item
 *     tags: [Payroll Bonus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
/**
 * @swagger
 * /api/v1/payroll-bonus/bonuses/history:
 *   get:
 *     summary: Get history of all bonuses
 *     tags: [Payroll Bonus]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

export default router;
