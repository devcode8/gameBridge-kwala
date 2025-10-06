const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Database configuration using the provided credentials
const supabaseUrl = 'https://trlmccnvaeqrtzqeggbd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRybG1jY252YWVxcnR6cWVnZ2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMTg0NjIsImV4cCI6MjA0MzY5NDQ2Mn0.Y3URGgqoqfJrLb7bCVQFJ4O5CjRGMEFjF2W2J8jOhkg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL commands
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return;
    }
    
    console.log('Database initialized successfully!');
    console.log('Created tables and policies for quiz_results');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Alternative method: Create table directly via JavaScript
async function createTableDirectly() {
  try {
    console.log('Creating table using JavaScript...');
    
    const { data, error } = await supabase
      .from('quiz_results')
      .select('id')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('Table does not exist. Creating manually...');
      console.log('Please run the SQL commands manually in your Supabase dashboard:');
      console.log('\n--- COPY THE FOLLOWING SQL TO SUPABASE DASHBOARD ---\n');
      
      const sqlPath = path.join(__dirname, 'create-tables.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      console.log(sql);
      console.log('\n--- END OF SQL ---\n');
      
    } else if (error) {
      console.error('Error checking table:', error);
    } else {
      console.log('Table already exists!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the initialization
createTableDirectly();