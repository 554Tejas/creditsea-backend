import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';
import {
  getSalesLeads,
  getSanctionQueue,
  getDisbursementQueue,
  getCollectionQueue,
  getAdminOverview,
} from '../controllers/dashboardController';

const router = Router();

// All dashboard routes strictly require authentication
router.use(protect);

// RBAC Protected Routes (Admin automatically has access to all via the authorize middleware logic)
router.get('/sales', authorize(UserRole.SALES), getSalesLeads);
router.get('/sanction', authorize(UserRole.SANCTION), getSanctionQueue);
router.get('/disbursement', authorize(UserRole.DISBURSEMENT), getDisbursementQueue);
router.get('/collection', authorize(UserRole.COLLECTION), getCollectionQueue);
router.get('/admin', authorize(UserRole.ADMIN), getAdminOverview);

export default router;