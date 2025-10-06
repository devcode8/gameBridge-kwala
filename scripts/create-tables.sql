-- Create quiz_results table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_results_player_address ON quiz_results(player_address);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_player_quiz ON quiz_results(player_address, quiz_id);

-- Create RLS policies for security
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own quiz results
CREATE POLICY "Users can view own quiz results" ON quiz_results
    FOR SELECT USING (true);

-- Policy: Users can insert their own quiz results
CREATE POLICY "Users can insert own quiz results" ON quiz_results
    FOR INSERT WITH CHECK (true);

-- Policy: Users can update their own quiz results
CREATE POLICY "Users can update own quiz results" ON quiz_results
    FOR UPDATE USING (true);

-- Policy: Users can delete their own quiz results
CREATE POLICY "Users can delete own quiz results" ON quiz_results
    FOR DELETE USING (true);