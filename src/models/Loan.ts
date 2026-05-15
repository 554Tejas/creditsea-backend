import mongoose, { Document, Schema } from 'mongoose';

export enum EmploymentMode {
  SALARIED = 'Salaried',
  SELF_EMPLOYED = 'Self-Employed',
  UNEMPLOYED = 'Unemployed',
}

export enum LoanStatus {
  APPLIED = 'Applied',         // Application submitted successfully
  SANCTIONED = 'Sanctioned',   // Approved by Sanction Executive
  REJECTED = 'Rejected',       // Rejected by BRE or Sanction Executive
  DISBURSED = 'Disbursed',     // Funds released by Disbursement Executive
  CLOSED = 'Closed',           // Fully repaid
}

export interface ILoan extends Document {
  borrower: mongoose.Types.ObjectId;
  personalDetails: {
    fullName: string;
    pan: string;
    dob: Date;
    monthlySalary: number;
    employmentMode: EmploymentMode;
  };
  salarySlipUrl?: string;
  loanConfig: {
    amount: number;
    tenureDays: number;
    interestRate: number; 
    simpleInterest: number;
    totalRepayment: number;
  };
  amountPaid: number;
  status: LoanStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema: Schema = new Schema(
  {
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    personalDetails: {
      fullName: { type: String, required: true },
      pan: { type: String, required: true, uppercase: true },
      dob: { type: Date, required: true },
      monthlySalary: { type: Number, required: true },
      employmentMode: {
        type: String,
        enum: Object.values(EmploymentMode),
        required: true,
      },
    },
    salarySlipUrl: {
      type: String,
      required: true, // Becomes required in step 3
    },
    loanConfig: {
      amount: { type: Number, required: true, min: 50000, max: 500000 },
      tenureDays: { type: Number, required: true, min: 30, max: 365 },
      interestRate: { type: Number, required: true, default: 12 },
      simpleInterest: { type: Number, required: true },
      totalRepayment: { type: Number, required: true },
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(LoanStatus),
      default: LoanStatus.APPLIED,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILoan>('Loan', LoanSchema);