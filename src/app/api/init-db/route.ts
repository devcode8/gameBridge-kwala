import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}