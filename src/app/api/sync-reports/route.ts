import { NextRequest, NextResponse } from 'next/server';
import { createPublicIncidentAction } from '@/actions/incidents';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reports } = body;

    if (!Array.isArray(reports) || reports.length === 0) {
      return NextResponse.json({ success: true, message: 'No reports to sync' });
    }

    const results = [];
    for (const report of reports) {
      const result = await createPublicIncidentAction({
        waterpointId: report.waterpointId,
        waterpointName: report.waterpointName,
        issueType: report.issueType,
        description: report.description,
      });
      results.push(result);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${results.filter(r => r.success).length} reports.` 
    });
  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json({ success: false, message: 'Failed to sync reports' }, { status: 500 });
  }
}