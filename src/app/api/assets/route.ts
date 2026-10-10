import { NextResponse } from 'next/server';
import { waterpointRepo } from '@/db/repositories/waterpoint.repo';

export async function GET() {
  try {
    // Correctly passing the tenant identifier parameter requested by your repository method
    const assets = await waterpointRepo.getAll("turkana");
    return NextResponse.json({ success: true, data: assets }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve water infrastructure dataset' }, 
      { status: 500 }
    );
  }
}