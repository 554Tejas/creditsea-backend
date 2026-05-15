import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';
import { recordPayment, getLoanPayments } from '../controllers/paymentController';

const router = Router();

// All payment routes require authentication
router.use(protect);

// Only Collection Executives and Admins can record payments
router.post('/', authorize(UserRole.COLLECTION, UserRole.ADMIN), recordPayment);

// Any dashboard executive involved in the loan might need to see payment history
router.get('/:loanId', authorize(UserRole.SANCTION, UserRole.DISBURSEMENT, UserRole.COLLECTION, UserRole.ADMIN), getLoanPayments);

export default router;