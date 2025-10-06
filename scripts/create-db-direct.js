const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration using the provided connection string
const connectionString = 'postgresql://postgres.trlmccnvaeqrtzqeggbd:6allm0vNdXmiPtij@aws-1-us-east-2.pooler.supabase.com:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Test connection
    const client = await pool.connect();
    console.log('Connected successfully!');
    
    // Create quiz_results table
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
    
    console.log('Creating quiz_results table...');
    await client.query(createTableQuery);
    console.log('✅ Table created successfully!');
    
    // Create indexes
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_quiz_results_player_address ON quiz_results(player_address);',
      'CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_id ON quiz_results(quiz_id);',
      'CREATE INDEX IF NOT EXISTS idx_quiz_results_player_quiz ON quiz_results(player_address, quiz_id);'
    ];
    
    console.log('Creating indexes...');
    for (const query of indexQueries) {
      await client.query(query);
    }
    console.log('✅ Indexes created successfully!');
    
    // Test the table
    const testQuery = 'SELECT COUNT(*) FROM quiz_results;';
    const result = await client.query(testQuery);
    console.log(`✅ Table is working! Current row count: ${result.rows[0].count}`);
    
    client.release();
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

createDatabase();