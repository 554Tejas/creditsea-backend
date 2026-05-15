import { Router } from 'express';
import authRoutes from './authRoutes';
import dashboardRoutes from './dashboardRoutes';
import loanRoutes from './loanRoutes';
import paymentRoutes from './paymentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/loans', loanRoutes);
router.use('/payments', paymentRoutes);

export default router;