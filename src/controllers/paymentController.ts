import { Request, Response, NextFunction } from 'express';
import Payment from '../models/Payment';
import Loan, { LoanStatus } from '../models/Loan';
import { AppError } from '../utils/AppError';

export const recordPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { loanId, utr, amount, paymentDate } = req.body;

    if (!loanId || !utr || !amount) {
      return next(new AppError('Please provide loanId, UTR number, and payment amount.', 400));
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return next(new AppError('Loan not found', 404));
    }

    if (loan.status !== LoanStatus.DISBURSED) {
      return next(new AppError(`Cannot record payment for a loan in ${loan.status} status.`, 400));
    }

    // Check if payment exceeds outstanding balance (rounding to 2 decimals for safety)
    const outstandingBalance = Math.round((loan.loanConfig.totalRepayment - loan.amountPaid) * 100) / 100;
    
    if (amount > outstandingBalance) {
      return next(new AppError(`Payment amount (₹${amount}) exceeds outstanding balance (₹${outstandingBalance}).`, 400));
    }

    // Verify UTR uniqueness manually to give a clean error message
    const existingPayment = await Payment.findOne({ utr });
    if (existingPayment) {
      return next(new AppError(`A payment with UTR ${utr} has already been recorded.`, 400));
    }

    // Create the payment record
    const payment = await Payment.create({
      loan: loan._id,
      utr,
      amount,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      recordedBy: req.user?.id,
    });

    // Update loan's paid amount
    loan.amountPaid += amount;

    // Check for auto-closure (if fully paid)
    if (loan.amountPaid >= loan.loanConfig.totalRepayment) {
      loan.status = LoanStatus.CLOSED;
    }

    await loan.save();

    res.status(201).json({
      success: true,
      data: {
        payment,
        loanStatus: loan.status,
        amountPaid: loan.amountPaid,
        outstandingBalance: Math.round((loan.loanConfig.totalRepayment - loan.amountPaid) * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLoanPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await Payment.find({ loan: req.params.loanId })
      .populate('recordedBy', 'name')
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};