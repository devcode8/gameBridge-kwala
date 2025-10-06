import React, { useState, useEffect } from 'react';
import { useActiveAccount } from "thirdweb/react";
import SubmitQuizResult from './SubmitQuizResult';
import MarkBadgeAsMinted from './MarkBadgeAsMinted';
import SetBadgeMinterContract from './SetBadgeMinterContract';
import { useQuizProgressEvents } from '../hooks/useQuizProgressEvents';
import { BADGE_MINTER_CONTRACT_ADDRESS } from '../utils/contract';

export default function QuizProgressEventDemo() {
  const account = useActiveAccount();
  const [quizId, setQuizId] = useState(1);
  const [score, setScore] = useState(8);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [badgeLevel, setBadgeLevel] = useState("Great");
  const [resultIndex, setResultIndex] = useState(0);
  const [badgeMinterAddress, setBadgeMinterAddress] = useState(BADGE_MINTER_CONTRACT_ADDRESS);

  const {
    quizCompletedEvents,
    highScoreEvents,
    perfectScoreEvents,
    badgeEarnedEvents,
    kwalaBadgeRequestEvents,
    processKwalaBadgeRequests,
    getEventCounts,
    getLatestKwalaBadgeRequest
  } = useQuizProgressEvents();

  // Process Kwala badge requests automatically
  useEffect(() => {
    processKwalaBadgeRequests((event) => {
      console.log("🎖️ Kwala Badge Request Detected:", {
        user: event.user,
        quizId: Number(event.quizId),
        score: Number(event.score),
        totalQuestions: Number(event.totalQuestions),
        badgeLevel: event.badgeLevel,
        isHighScore: event.isHighScore,
        isFirstAttempt: event.isFirstAttempt,
        timestamp: new Date(Number(event.timestamp) * 1000).toISOString()
      });
      
      // Here you would trigger the actual Kwala badge minting process
      // This could be an API call to your backend service
      console.log("🚀 Triggering Kwala badge minting workflow...");
    });
  }, [kwalaBadgeRequestEvents, processKwalaBadgeRequests]);

  const handleQuizSuccess = () => {
    console.log("✅ Quiz result submitted successfully!");
    console.log("📊 Events that will be triggered:");
    console.log("- QuizCompleted: Always emitted");
    console.log("- BadgeEarned: Always emitted"); 
    console.log("- KwalaBadgeRequest: Always emitted (for Kwala integration)");
    console.log("- HighScoreAchieved: If this is a new high score");
    console.log("- PerfectScoreAchieved: If score equals total questions");
  };

  const handleBadgeMarkSuccess = () => {
    console.log("✅ Badge marked as minted successfully!");
  };

  const handleContractSetSuccess = () => {
    console.log("✅ Badge minter contract set successfully!");
  };

  const handleError = (error: Error) => {
    console.error("❌ Transaction failed:", error.message);
  };

  const eventCounts = getEventCounts();
  const latestKwalaBadgeRequest = getLatestKwalaBadgeRequest();

  if (!account) {
    return (
      <div className="p-6 border border-gray-300 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Quiz Progress Event Demo</h2>
        <p className="text-gray-600">Please connect your wallet to use the event demo.</p>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-300 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">🎮 Quiz Progress Event Demo</h2>
      
      {/* Event Statistics */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">📊 Event Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>Quiz Completed: {eventCounts.quizCompleted}</div>
          <div>High Score: {eventCounts.highScore}</div>
          <div>Perfect Score: {eventCounts.perfectScore}</div>
          <div>Badge Earned: {eventCounts.badgeEarned}</div>
          <div>Kwala Requests: {eventCounts.kwalaBadgeRequest}</div>
        </div>
      </div>

      {/* Latest Kwala Badge Request */}
      {latestKwalaBadgeRequest && (
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🎖️ Latest Kwala Badge Request</h3>
          <div className="text-sm space-y-1">
            <div>User: {latestKwalaBadgeRequest.args.user}</div>
            <div>Quiz ID: {Number(latestKwalaBadgeRequest.args.quizId)}</div>
            <div>Score: {Number(latestKwalaBadgeRequest.args.score)}/{Number(latestKwalaBadgeRequest.args.totalQuestions)}</div>
            <div>Badge Level: {latestKwalaBadgeRequest.args.badgeLevel}</div>
            <div>High Score: {latestKwalaBadgeRequest.args.isHighScore ? "Yes" : "No"}</div>
            <div>First Attempt: {latestKwalaBadgeRequest.args.isFirstAttempt ? "Yes" : "No"}</div>
          </div>
        </div>
      )}

      {/* Submit Quiz Result */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">📝 Submit Quiz Result</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quiz ID</label>
            <input
              type="number"
              value={quizId}
              onChange={(e) => setQuizId(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Score</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Questions</label>
            <input
              type="number"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Badge Level</label>
            <select
              value={badgeLevel}
              onChange={(e) => setBadgeLevel(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Perfect Score">Perfect Score</option>
              <option value="Excellent">Excellent</option>
              <option value="Great">Great</option>
              <option value="Good">Good</option>
              <option value="Above Average">Above Average</option>
              <option value="Average">Average</option>
            </select>
          </div>
        </div>
        <SubmitQuizResult
          quizId={quizId}
          score={score}
          totalQuestions={totalQuestions}
          badgeLevel={badgeLevel}
          onSuccess={handleQuizSuccess}
          onError={handleError}
        />
      </div>

      {/* Mark Badge as Minted */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">🎖️ Mark Badge as Minted</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">User Address</label>
            <input
              type="text"
              value={account.address}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Result Index</label>
            <input
              type="number"
              value={resultIndex}
              onChange={(e) => setResultIndex(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <MarkBadgeAsMinted
          userAddress={account.address}
          resultIndex={resultIndex}
          onSuccess={handleBadgeMarkSuccess}
          onError={handleError}
        />
      </div>

      {/* Set Badge Minter Contract */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">⚙️ Set Badge Minter Contract</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Badge Minter Address</label>
          <input
            type="text"
            value={badgeMinterAddress}
            onChange={(e) => setBadgeMinterAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="0x..."
          />
        </div>
        <SetBadgeMinterContract
          badgeMinterAddress={badgeMinterAddress}
          onSuccess={handleContractSetSuccess}
          onError={handleError}
        />
      </div>

      {/* Events Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">ℹ️ Event Information</h3>
        <div className="text-sm space-y-2">
          <p><strong>QuizCompleted:</strong> Emitted every time a quiz is completed</p>
          <p><strong>BadgeEarned:</strong> Emitted every time a badge is earned</p>
          <p><strong>KwalaBadgeRequest:</strong> Special event for Kwala integration - triggers badge minting</p>
          <p><strong>HighScoreAchieved:</strong> Emitted when a new high score is achieved</p>
          <p><strong>PerfectScoreAchieved:</strong> Emitted when a perfect score is achieved</p>
        </div>
      </div>
    </div>
  );
}