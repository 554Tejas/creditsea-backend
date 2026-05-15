import { Request, Response, NextFunction } from 'express';
import User, { UserRole } from '../models/User';
import Loan, { LoanStatus } from '../models/Loan';

// Sales handles users who registered but haven't applied yet (Lead tracking)
export const getSalesLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Find all borrowers
    const borrowers = await User.find({ role: UserRole.BORROWER }).select('-password');
    
    // Find all loans to check who has already applied
    const appliedBorrowerIds = await Loan.distinct('borrower');
    
    // Filter out borrowers who have an existing loan record
    const leads = borrowers.filter(
      (b) => !appliedBorrowerIds.map(id => id.toString()).includes(b._id.toString())
    );

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// Sanction handles applied loans waiting for approval/rejection
export const getSanctionQueue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loans = await Loan.find({ status: LoanStatus.APPLIED })
      .populate('borrower', 'name email')
      .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans,
    });
  } catch (error) {
    next(error);
  }
};

// Disbursement handles sanctioned loans waiting for funds release
export const getDisbursementQueue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loans = await Loan.find({ status: LoanStatus.SANCTIONED })
      .populate('borrower', 'name email')
      .sort({ updatedAt: 1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans,
    });
  } catch (error) {
    next(error);
  }
};

// Collection handles active (disbursed) loans
export const getCollectionQueue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loans = await Loan.find({ status: LoanStatus.DISBURSED })
      .populate('borrower', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans,
    });
  } catch (error) {
    next(error);
  }
};

// Admin sees everything
export const getAdminOverview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalLoans = await Loan.countDocuments();
    const activeLoans = await Loan.countDocuments({ status: LoanStatus.DISBURSED });
    const totalDisbursed = await Loan.aggregate([
      { $match: { status: { $in: [LoanStatus.DISBURSED, LoanStatus.CLOSED] } } },
      { $group: { _id: null, total: { $sum: "$loanConfig.amount" } } }
    ]);
    
    const recentLoans = await Loan.find()
      .populate('borrower', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalLoans,
        activeLoans,
        totalDisbursedAmount: totalDisbursed[0]?.total || 0,
      },
      recentLoans,
    });
  } catch (error) {
    next(error);
  }
};