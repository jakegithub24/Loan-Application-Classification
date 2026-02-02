import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface StatusUpdateRequest {
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'under_review';
  approvalReason?: string;
  reviewedBy?: string;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = params.id;
    const body: StatusUpdateRequest = await req.json();

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'under_review'];
    if (!body.approvalStatus || !validStatuses.includes(body.approvalStatus)) {
      return NextResponse.json(
        { error: 'Invalid approval status' },
        { status: 400 }
      );
    }

    // Check if application exists
    const existingApplication = await db.loanApplication.findUnique({
      where: { id: applicationId },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update application
    const updatedApplication = await db.loanApplication.update({
      where: { id: applicationId },
      data: {
        approvalStatus: body.approvalStatus,
        approvalReason: body.approvalReason,
        reviewedBy: body.reviewedBy || 'System',
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
