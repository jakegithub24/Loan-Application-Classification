import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

interface LoanFormData {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  loanAmount: string;
  loanPurpose: string;
  annualIncome: string;
  creditScore: string;
  employmentStatus: string;
  employmentDuration: string;
  monthlyDebt: string;
}

// AI Classification Function
async function classifyLoanApplication(data: {
  loanPurpose: string;
  loanAmount: number;
  annualIncome: number;
  creditScore: number;
  employmentStatus: string;
  employmentDuration?: number;
  monthlyDebt: number;
}) {
  try {
    const zai = await ZAI.create();

    const prompt = `You are a loan classification and risk assessment expert. Analyze this loan application and provide a JSON response.

Application Details:
- Loan Purpose: ${data.loanPurpose}
- Loan Amount: $${data.loanAmount.toLocaleString()}
- Annual Income: $${data.annualIncome.toLocaleString()}
- Credit Score: ${data.creditScore}
- Employment Status: ${data.employmentStatus}
- Employment Duration: ${data.employmentDuration || 'Not specified'} years
- Monthly Debt: $${data.monthlyDebt.toLocaleString()}

Calculate:
1. Debt-to-Income Ratio (DTI) = (Monthly Debt / (Annual Income / 12)) * 100

Provide a JSON response with this structure:
{
  "loanType": "personal|business|education|mortgage|auto|other",
  "riskLevel": "low|medium|high",
  "riskScore": <number between 0-100>,
  "analysis": "<detailed analysis in 2-3 sentences>",
  "factors": {
    "dti": <calculated DTI>,
    "creditScoreFactor": "excellent|good|fair|poor",
    "incomeFactor": "high|medium|low",
    "employmentFactor": "stable|unstable|retired|student"
  }
}

Classification Rules:
- loanType: Classify based on loan purpose (mortgage for home, business for startup, education for school, auto for car, personal for general use)
- riskLevel: low (credit 700+, DTI < 35%), medium (credit 600-699 or DTI 35-43%), high (credit < 600 or DTI > 43%)
- riskScore: Calculate based on credit score (40% weight), DTI (30% weight), employment (20% weight), income (10% weight)

Respond ONLY with valid JSON.`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a loan classification and risk assessment expert. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No AI response');
    }

    // Parse JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI Classification Error:', error);
    // Fallback to rule-based classification
    return classifyLoanFallback(data);
  }
}

// Fallback classification if AI fails
function classifyLoanFallback(data: {
  loanPurpose: string;
  loanAmount: number;
  annualIncome: number;
  creditScore: number;
  employmentStatus: string;
  monthlyDebt: number;
}) {
  const purpose = data.loanPurpose.toLowerCase();

  // Determine loan type
  let loanType = 'personal';
  if (purpose.includes('home') || purpose.includes('house') || purpose.includes('mortgage') || purpose.includes('property')) {
    loanType = 'mortgage';
  } else if (purpose.includes('school') || purpose.includes('college') || purpose.includes('university') || purpose.includes('education') || purpose.includes('study')) {
    loanType = 'education';
  } else if (purpose.includes('business') || purpose.includes('startup') || purpose.includes('company') || purpose.includes('enterprise')) {
    loanType = 'business';
  } else if (purpose.includes('car') || purpose.includes('vehicle') || purpose.includes('auto')) {
    loanType = 'auto';
  }

  // Calculate DTI
  const monthlyIncome = data.annualIncome / 12;
  const dti = (data.monthlyDebt / monthlyIncome) * 100;

  // Determine risk level
  let riskLevel = 'medium';
  if (data.creditScore >= 700 && dti < 35) {
    riskLevel = 'low';
  } else if (data.creditScore < 600 || dti > 43) {
    riskLevel = 'high';
  }

  // Calculate risk score
  let riskScore = 50; // baseline
  // Credit score factor (0-40 points)
  if (data.creditScore >= 750) riskScore -= 20;
  else if (data.creditScore >= 700) riskScore -= 15;
  else if (data.creditScore >= 650) riskScore -= 5;
  else if (data.creditScore >= 600) riskScore += 5;
  else riskScore += 20;

  // DTI factor (0-30 points)
  if (dti < 20) riskScore -= 15;
  else if (dti < 35) riskScore -= 10;
  else if (dti > 43) riskScore += 15;
  else if (dti > 35) riskScore += 5;

  // Employment factor (0-20 points)
  if (data.employmentStatus === 'employed') riskScore -= 10;
  else if (data.employmentStatus === 'self-employed') riskScore -= 5;
  else if (data.employmentStatus === 'unemployed') riskScore += 15;

  riskScore = Math.max(0, Math.min(100, riskScore));

  return {
    loanType,
    riskLevel,
    riskScore,
    analysis: `Based on credit score of ${data.creditScore} and debt-to-income ratio of ${dti.toFixed(1)}%, the application presents a ${riskLevel} risk profile.`,
    factors: {
      dti,
      creditScoreFactor: data.creditScore >= 700 ? (data.creditScore >= 750 ? 'excellent' : 'good') : data.creditScore >= 600 ? 'fair' : 'poor',
      incomeFactor: data.annualIncome >= 100000 ? 'high' : data.annualIncome >= 50000 ? 'medium' : 'low',
      employmentFactor: data.employmentStatus === 'employed' ? 'stable' : data.employmentStatus === 'unemployed' ? 'unstable' : data.employmentStatus,
    },
  };
}

// Approval Decision Logic
function makeApprovalDecision(data: {
  creditScore: number;
  dti: number;
  loanAmount: number;
  annualIncome: number;
  riskScore: number;
  loanType: string;
  riskLevel: string;
}) {
  const { approvalReason, approved, underReview } = (() => {
    // Auto-approve criteria
    if (data.creditScore >= 750 && data.dti < 30 && data.riskScore < 30) {
      return {
        approved: true,
        underReview: false,
        approvalReason: 'Excellent credit score, low debt-to-income ratio, and low risk score qualify for automatic approval.',
      };
    }

    // Auto-reject criteria
    if (data.creditScore < 580 || data.dti > 50 || data.riskScore > 80) {
      return {
        approved: false,
        underReview: false,
        approvalReason: `Application does not meet minimum requirements. ${data.creditScore < 580 ? 'Credit score too low. ' : ''}${data.dti > 50 ? 'Debt-to-income ratio exceeds threshold. ' : ''}${data.riskScore > 80 ? 'Risk score too high. ' : ''}`,
      };
    }

    // Under review for edge cases
    return {
      approved: false,
      underReview: true,
      approvalReason: 'Application requires manual review due to borderline qualification metrics.',
    };
  })();

  let approvalStatus = 'pending';
  if (approved) approvalStatus = 'approved';
  else if (underReview) approvalStatus = 'under_review';
  else approvalStatus = 'rejected';

  return { approvalStatus, approvalReason };
}

export async function POST(req: NextRequest) {
  try {
    const body: LoanFormData = await req.json();

    // Validate required fields
    const required = [
      'applicantName',
      'applicantEmail',
      'applicantPhone',
      'loanAmount',
      'loanPurpose',
      'annualIncome',
      'creditScore',
      'employmentStatus',
      'monthlyDebt',
    ];

    for (const field of required) {
      if (!body[field as keyof LoanFormData]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Parse numeric values
    const loanAmount = parseFloat(body.loanAmount);
    const annualIncome = parseFloat(body.annualIncome);
    const creditScore = parseInt(body.creditScore);
    const monthlyDebt = parseFloat(body.monthlyDebt);
    const employmentDuration = body.employmentDuration ? parseInt(body.employmentDuration) : null;

    // Validate ranges
    if (creditScore < 300 || creditScore > 850) {
      return NextResponse.json({ error: 'Credit score must be between 300 and 850' }, { status: 400 });
    }

    if (loanAmount <= 0) {
      return NextResponse.json({ error: 'Loan amount must be greater than 0' }, { status: 400 });
    }

    if (annualIncome <= 0) {
      return NextResponse.json({ error: 'Annual income must be greater than 0' }, { status: 400 });
    }

    // Calculate DTI
    const monthlyIncome = annualIncome / 12;
    const debtToIncomeRatio = (monthlyDebt / monthlyIncome) * 100;

    // AI Classification
    const classification = await classifyLoanApplication({
      loanPurpose: body.loanPurpose,
      loanAmount,
      annualIncome,
      creditScore,
      employmentStatus: body.employmentStatus,
      employmentDuration: employmentDuration ?? undefined,
      monthlyDebt,
    });

    // Make approval decision
    const { approvalStatus, approvalReason } = makeApprovalDecision({
      creditScore,
      dti: debtToIncomeRatio,
      loanAmount,
      annualIncome,
      riskScore: classification.riskScore,
      loanType: classification.loanType,
      riskLevel: classification.riskLevel,
    });

    // Create loan application record
    const application = await db.loanApplication.create({
      data: {
        applicantName: body.applicantName,
        applicantEmail: body.applicantEmail,
        applicantPhone: body.applicantPhone,
        loanAmount,
        loanPurpose: body.loanPurpose,
        annualIncome,
        creditScore,
        employmentStatus: body.employmentStatus,
        employmentDuration,
        monthlyDebt,
        loanType: classification.loanType,
        riskLevel: classification.riskLevel,
        approvalStatus,
        approvalReason,
        debtToIncomeRatio,
        riskScore: classification.riskScore,
        aiAnalysis: classification.analysis,
      },
    });

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        applicantName: application.applicantName,
        applicantEmail: application.applicantEmail,
        loanAmount: application.loanAmount,
        loanType: application.loanType,
        riskLevel: application.riskLevel,
        approvalStatus: application.approvalStatus,
        riskScore: application.riskScore,
        createdAt: application.createdAt,
        aiAnalysis: application.aiAnalysis,
        approvalReason: application.approvalReason,
      },
    });
  } catch (error) {
    console.error('Loan Application Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
