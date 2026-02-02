# Status Management Guide

## Overview

The loan application system now includes complete **status management** functionality. Reviewers can view application details and manually update approval status with decision notes.

---

## Status Types

| Status | Description | When Used |
|--------|-------------|-----------|
| **Pending** | Initial state after submission | Application submitted, awaiting processing |
| **Under Review** | Requires manual review | AI classification flagged as borderline |
| **Approved** | Application accepted | Auto-approved by AI or manually approved |
| **Rejected** | Application declined | Auto-rejected by AI or manually rejected |

---

## How to Handle Status

### 1. View Application Details

From the Dashboard:
1. Go to the **Dashboard** tab
2. Locate the application in the table
3. Click the **View** button (👁️) in the Actions column

This opens a detailed modal showing:
- Applicant information (name, email, phone, ID)
- Loan information (amount, type, purpose)
- Financial information (income, debt, DTI, credit score)
- Risk assessment (level, score, AI analysis)
- Employment information
- Current status and review history

---

### 2. Update Application Status

In the Application Detail modal:

**Step 1:** Select New Status
- Click the **New Status** dropdown
- Choose from: Pending, Approved, Rejected, Under Review

**Step 2:** Add Decision Notes (Optional)
- Enter your reasoning in the **Decision Notes** textarea
- This will be visible to other reviewers
- Required when manually approving/rejecting

**Step 3:** Click **Update Status**
- The status will be updated immediately
- The dashboard will refresh automatically
- A success toast notification will appear

---

### 3. Status Change Rules

#### Auto-Approval (by AI)
Application is automatically approved if:
- Credit score ≥ 750
- DTI < 30%
- Risk score < 30

#### Auto-Rejection (by AI)
Application is automatically rejected if:
- Credit score < 580
- DTI > 50%
- Risk score > 80

#### Manual Review Required
Applications marked as **Under Review** require human evaluation. Reviewers should:
1. Review all application details
2. Consider the AI analysis
3. Check for special circumstances
4. Make an informed decision
5. Document the reasoning in decision notes

---

## API Reference

### Update Application Status

**Endpoint:** `PUT /api/loan/[id]/update-status`

**Request:**
```json
{
  "approvalStatus": "approved",
  "approvalReason": "Strong credit history, stable income, low DTI",
  "reviewedBy": "Admin"
}
```

**Response:**
```json
{
  "success": true,
  "application": {
    "id": "...",
    "approvalStatus": "approved",
    "approvalReason": "...",
    "reviewedBy": "Admin",
    "reviewedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Valid Status Values:**
- `pending`
- `approved`
- `rejected`
- `under_review`

---

## Best Practices

### When Approving
✅ **Do:**
- Verify all financial information
- Check DTI ratio is acceptable (< 43%)
- Ensure credit score meets minimum (≥ 600)
- Add clear decision notes

❌ **Don't:**
- Approve incomplete applications
- Ignore red flags in AI analysis
- Skip decision notes

### When Rejecting
✅ **Do:**
- Provide specific reasons
- Reference failing criteria
- Offer guidance if appropriate
- Document thoroughly

❌ **Don't:**
- Reject without explanation
- Be vague in decision notes
- Ignore potential for reconsideration

### When Sending to Under Review
✅ **Do:**
- Mark clearly what needs verification
- Set expectations for review timeline
- Prioritize based on risk level

---

## Status Change History

Each status change is recorded with:
- **Reviewer:** Who made the change
- **Timestamp:** When it was changed
- **Previous Status:** What it was before
- **New Status:** What it is now
- **Reason:** Why it was changed

This creates an audit trail for compliance and transparency.

---

## Example Workflow

### Scenario 1: Auto-Approved Application
1. Applicant submits → Status: **Pending**
2. AI processes → Status: **Approved** (automatic)
3. No manual review needed
4. Applicant notified of approval

### Scenario 2: Application Requiring Review
1. Applicant submits → Status: **Pending**
2. AI processes → Status: **Under Review** (borderline case)
3. Reviewer clicks "View" button
4. Reviewer evaluates details and AI analysis
5. Reviewer changes status to **Approved** with notes
6. Status updated with reviewer name and timestamp

### Scenario 3: Manual Override
1. Application auto-approved by AI
2. Reviewer suspects fraud
3. Reviewer opens detail modal
4. Changes status to **Under Review**
5. Adds notes about fraud suspicion
6. Status updated with override reason

---

## Filtering by Status

From the Dashboard, use the **Status Filter** dropdown to:
- View all applications (All)
- See only pending applications (Pending)
- Review under_review cases (Under Review)
- Check approved applications (Approved)
- Audit rejected applications (Rejected)

---

## Error Handling

### Common Issues

**"Invalid approval status"**
- Ensure you're using one of the valid status values
- Check for typos in status name

**"Application not found"**
- Verify the application ID is correct
- Check if application was deleted

**"Failed to update status"**
- Check network connection
- Ensure you have permission to update
- Try refreshing and retrying

---

## Troubleshooting

**Status not updating?**
1. Refresh the page
2. Check browser console for errors
3. Verify API endpoint is accessible
4. Try opening a new browser session

**Decision notes not saving?**
1. Ensure notes are not too long (max 5000 chars)
2. Check for special characters that might cause issues
3. Try shorter notes to test

---

## Summary

- ✅ **View** full application details
- ✅ **Update** status to Approved, Rejected, Under Review, or Pending
- ✅ **Add** decision notes for audit trail
- ✅ **Track** who reviewed and when
- ✅ **Filter** applications by status
- ✅ **Maintain** complete status history

For questions or issues, refer to the main README or check the console for error messages.
