import { Router } from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';
import { upload } from '../middlewares/uploadMiddleware';
import {
  checkEligibility,
  uploadSalarySlip,
  applyForLoan,
  approveLoan,
  rejectLoan,
  disburseLoan
} from '../controllers/loanController';

const router = Router();

// All loan routes require authentication
router.use(protect);

// ----------------------------------------------------
// Borrower Routes
// ----------------------------------------------------
router.post('/bre-check', authorize(UserRole.BORROWER), checkEligibility);
router.post('/upload', authorize(UserRole.BORROWER), upload.single('salarySlip'), uploadSalarySlip);
router.post('/apply', authorize(UserRole.BORROWER), applyForLoan);

// ----------------------------------------------------
// Dashboard / Executive Routes
// ----------------------------------------------------
router.patch('/:id/approve', authorize(UserRole.SANCTION, UserRole.ADMIN), approveLoan);
router.patch('/:id/reject', authorize(UserRole.SANCTION, UserRole.ADMIN), rejectLoan);
router.patch('/:id/disburse', authorize(UserRole.DISBURSEMENT, UserRole.ADMIN), disburseLoan);

export default router;