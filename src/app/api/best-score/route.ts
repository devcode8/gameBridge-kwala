import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { initializeDatabase } from '@/lib/init-db';

// GET /api/best-score?quizId=1&playerAddress=0x123...
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    const playerAddress = searchParams.get('playerAddress');
    
    if (!quizId || !playerAddress) {
      return NextResponse.json({ error: 'Quiz ID and player address are required' }, { status: 400 });
    }
    
    const query = `
      SELECT MAX(score) as best_score 
      FROM quiz_results 
      WHERE quiz_id = $1 AND player_address = $2
    `;
    
    const result = await executeQuery(query, [parseInt(quizId), playerAddress.toLowerCase()]);
    const bestScore = result.rows[0]?.best_score || 0;
    
    return NextResponse.json({ bestScore });
  } catch (error) {
    console.error('Error fetching best score:', error);
    return NextResponse.json({ error: 'Failed to fetch best score' }, { status: 500 });
  }
}