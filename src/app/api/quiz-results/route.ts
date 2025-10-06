import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { initializeDatabase } from '@/lib/init-db';

// GET /api/quiz-results?playerAddress=0x123...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerAddress = searchParams.get('playerAddress');
    
    if (!playerAddress) {
      return NextResponse.json({ error: 'Player address is required' }, { status: 400 });
    }
    
    const query = `
      SELECT * FROM quiz_results 
      WHERE player_address = $1 
      ORDER BY completed_at DESC
    `;
    
    const result = await executeQuery(query, [playerAddress.toLowerCase()]);
    
    // Convert to frontend format
    const quizResults = result.rows.map(row => ({
      quizId: row.quiz_id,
      playerAddress: row.player_address,
      score: row.score,
      totalPossible: row.total_possible,
      percentage: row.percentage,
      completedAt: row.completed_at,
      badge: {
        level: row.badge_level,
        color: row.badge_color,
        path: row.badge_path
      }
    }));
    
    return NextResponse.json(quizResults);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz results' }, { status: 500 });
  }
}

// POST /api/quiz-results
export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    await initializeDatabase();
    const body = await request.json();
    const { quizId, playerAddress, score, totalPossible, percentage, completedAt, badge } = body;
    
    if (!quizId || !playerAddress || score === undefined || !totalPossible || !percentage || !completedAt || !badge) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const query = `
      INSERT INTO quiz_results (
        quiz_id, player_address, score, total_possible, percentage,
        completed_at, badge_level, badge_color, badge_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      quizId,
      playerAddress.toLowerCase(),
      score,
      totalPossible,
      percentage,
      completedAt,
      badge.level,
      badge.color,
      badge.path
    ];
    
    const result = await executeQuery(query, values);
    
    return NextResponse.json({ 
      success: true, 
      id: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return NextResponse.json({ error: 'Failed to save quiz result' }, { status: 500 });
  }
}

// DELETE /api/quiz-results?playerAddress=0x123...
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerAddress = searchParams.get('playerAddress');
    
    if (!playerAddress) {
      return NextResponse.json({ error: 'Player address is required' }, { status: 400 });
    }
    
    const query = 'DELETE FROM quiz_results WHERE player_address = $1';
    await executeQuery(query, [playerAddress.toLowerCase()]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing quiz results:', error);
    return NextResponse.json({ error: 'Failed to clear quiz results' }, { status: 500 });
  }
}