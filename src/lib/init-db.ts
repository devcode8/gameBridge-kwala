import { executeQuery } from './db';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create quiz_results table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS quiz_results (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          quiz_id INTEGER NOT NULL,
          player_address TEXT NOT NULL,
          score INTEGER NOT NULL,
          total_possible INTEGER NOT NULL,
          percentage INTEGER NOT NULL,
          completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
          badge_level TEXT NOT NULL,
          badge_color TEXT NOT NULL,
          badge_path TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    await executeQuery(createTableQuery);
    console.log('Quiz results table created/verified');

    // Create indexes for better performance
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_quiz_results_player_address ON quiz_results(player_address);',
      'CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_id ON quiz_results(quiz_id);',
      'CREATE INDEX IF NOT EXISTS idx_quiz_results_player_quiz ON quiz_results(player_address, quiz_id);'
    ];

    for (const query of indexQueries) {
      await executeQuery(query);
    }
    console.log('Database indexes created/verified');

    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Call this function when the application starts
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().catch(console.error);
}