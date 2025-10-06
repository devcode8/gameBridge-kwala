import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.jfhidzjpymzztzfwnuld:L6pnHBFsI9VXkmZg@aws-1-us-east-2.pooler.supabase.com:5432/postgres';

// Create a single pool instance with proper timeout configuration
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum number of clients in the pool
  min: 5, // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  query_timeout: 30000, // Query timeout after 30 seconds
  statement_timeout: 30000, // Statement timeout after 30 seconds
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Utility function to execute queries with retry logic
export async function executeQuery<T = any>(
  text: string, 
  params?: any[], 
  retries: number = 3
): Promise<{ rows: T[]; rowCount: number }> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`Query attempt ${attempt} failed:`, error);
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}

// Export the pool for direct use if needed
export { pool };

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, closing database pool...');
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, closing database pool...');
  pool.end(() => {
    console.log('Database pool closed.');
    process.exit(0);
  });
});