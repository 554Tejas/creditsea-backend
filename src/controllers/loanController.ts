import { Request, Response, NextFunction } from 'express';
import Loan, { LoanStatus } from '../models/Loan';
import { runBRE } from '../utils/bre';
import { calculateSimpleInterest, calculateTotalRepayment } from '../utils/loanCalculator';
import { AppError } from '../utils/AppError';

// ==========================================
// BORROWER ACTIONS
// ==========================================

export const checkEligibility = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dob, monthlySalary, pan, employmentMode } = req.body;
    
    const breResult = runBRE(dob, monthlySalary, pan, employmentMode);
    
    if (!breResult.passed) {
      res.status(400).json({ success: false, message: breResult.reason });
      return;
    }

    res.status(200).json({ success: true, message: 'Eligibility check passed' });
  } catch (error) {
    next(error);
  }
};

export const uploadSalarySlip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }

    // Return the relative URL to access the file
    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      fileUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const applyForLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { personalDetails, salarySlipUrl, loanConfig } = req.body;

    // 1. Double check BRE on server side to prevent API bypassing
    const breResult = runBRE(
      personalDetails.dob, 
      personalDetails.monthlySalary, 
      personalDetails.pan, 
      personalDetails.employmentMode
    );

    if (!breResult.passed) {
      return next(new AppError(`Application rejected: ${breResult.reason}`, 400));
    }

    // 2. Server-side validation of math (never trust the client)
    const fixedInterestRate = 12; // 12% p.a.
    const calculatedInterest = calculateSimpleInterest(loanConfig.amount, fixedInterestRate, loanConfig.tenureDays);
    const calculatedTotal = calculateTotalRepayment(loanConfig.amount, calculatedInterest);

    // 3. Create the Loan application
    const loan = await Loan.create({
      borrower: req.user?.id,
      personalDetails,
      salarySlipUrl,
      loanConfig: {
        amount: loanConfig.amount,
        tenureDays: loanConfig.tenureDays,
        interestRate: fixedInterestRate,
        simpleInterest: calculatedInterest,
        totalRepayment: calculatedTotal,
      },
      status: LoanStatus.APPLIED,
    });

    res.status(201).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXECUTIVE ACTIONS
// ==========================================

export const approveLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return next(new AppError('Loan not found', 404));
    }

    if (loan.status !== LoanStatus.APPLIED) {
      return next(new AppError(`Cannot approve loan in ${loan.status} status`, 400));
    }

    loan.status = LoanStatus.SANCTIONED;
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
};

export const rejectLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reason } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return next(new AppError('Loan not found', 404));
    }

    if (loan.status !== LoanStatus.APPLIED) {
      return next(new AppError(`Cannot reject loan in ${loan.status} status`, 400));
    }

    if (!reason) {
      return next(new AppError('Rejection reason is required', 400));
    }

    loan.status = LoanStatus.REJECTED;
    loan.rejectionReason = reason;
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
};

export const disburseLoan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return next(new AppError('Loan not found', 404));
    }

    if (loan.status !== LoanStatus.SANCTIONED) {
      return next(new AppError(`Cannot disburse loan in ${loan.status} status`, 400));
    }

    loan.status = LoanStatus.DISBURSED;
    await loan.save();

    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
};