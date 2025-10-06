import { useContractEvents } from "thirdweb/react";
import { quizProgressContract, CONTRACT_EVENTS } from "../utils/contract";

export interface QuizCompletedEvent {
  user: string;
  quizId: bigint;
  score: bigint;
  totalQuestions: bigint;
  badgeLevel: string;
  timestamp: bigint;
  isHighScore: boolean;
}

export interface HighScoreAchievedEvent {
  user: string;
  quizId: bigint;
  newScore: bigint;
  previousScore: bigint;
  badgeLevel: string;
  timestamp: bigint;
}

export interface PerfectScoreAchievedEvent {
  user: string;
  quizId: bigint;
  timestamp: bigint;
  specialBadge: string;
}

export interface BadgeEarnedEvent {
  user: string;
  quizId: bigint;
  score: bigint;
  badgeLevel: string;
  isNewHighScore: boolean;
  isFirstAttempt: boolean;
  timestamp: bigint;
}

export interface KwalaBadgeRequestEvent {
  user: string;
  quizId: bigint;
  score: bigint;
  totalQuestions: bigint;
  badgeLevel: string;
  isHighScore: boolean;
  isFirstAttempt: boolean;
  timestamp: bigint;
}

export const useQuizProgressEvents = () => {
  // Listen for QuizCompleted events
  const { data: quizCompletedEvents } = useContractEvents({
    contract: quizProgressContract,
    events: [
      {
        signature: "event QuizCompleted(address indexed user, uint256 indexed quizId, uint256 score, uint256 totalQuestions, string badgeLevel, uint256 timestamp, bool isHighScore)",
      }
    ]
  });

  // Listen for HighScoreAchieved events
  const { data: highScoreEvents } = useContractEvents({
    contract: quizProgressContract,
    events: [
      {
        signature: "event HighScoreAchieved(address indexed user, uint256 indexed quizId, uint256 newScore, uint256 previousScore, string badgeLevel, uint256 timestamp)",
      }
    ]
  });

  // Listen for PerfectScoreAchieved events
  const { data: perfectScoreEvents } = useContractEvents({
    contract: quizProgressContract,
    events: [
      {
        signature: "event PerfectScoreAchieved(address indexed user, uint256 indexed quizId, uint256 timestamp, string specialBadge)",
      }
    ]
  });

  // Listen for BadgeEarned events
  const { data: badgeEarnedEvents } = useContractEvents({
    contract: quizProgressContract,
    events: [
      {
        signature: "event BadgeEarned(address indexed user, uint256 indexed quizId, uint256 score, string badgeLevel, bool isNewHighScore, bool isFirstAttempt, uint256 timestamp)",
      }
    ]
  });

  // Listen for KwalaBadgeRequest events (main event for Kwala integration)
  const { data: kwalaBadgeRequestEvents } = useContractEvents({
    contract: quizProgressContract,
    events: [
      {
        signature: "event KwalaBadgeRequest(address indexed user, uint256 indexed quizId, uint256 score, uint256 totalQuestions, string badgeLevel, bool isHighScore, bool isFirstAttempt, uint256 timestamp)",
      }
    ]
  });

  return {
    quizCompletedEvents,
    highScoreEvents,
    perfectScoreEvents,
    badgeEarnedEvents,
    kwalaBadgeRequestEvents,
    
    // Helper functions to process events for Kwala
    processKwalaBadgeRequests: (callback: (event: KwalaBadgeRequestEvent) => void) => {
      kwalaBadgeRequestEvents?.forEach((event) => {
        const parsedEvent = {
          user: event.args.user,
          quizId: event.args.quizId,
          score: event.args.score,
          totalQuestions: event.args.totalQuestions,
          badgeLevel: event.args.badgeLevel,
          isHighScore: event.args.isHighScore,
          isFirstAttempt: event.args.isFirstAttempt,
          timestamp: event.args.timestamp,
        } as KwalaBadgeRequestEvent;
        
        callback(parsedEvent);
      });
    },

    // Get latest events
    getLatestQuizCompletion: () => {
      return quizCompletedEvents?.[quizCompletedEvents.length - 1];
    },

    getLatestKwalaBadgeRequest: () => {
      return kwalaBadgeRequestEvents?.[kwalaBadgeRequestEvents.length - 1];
    },

    // Event counts for monitoring
    getEventCounts: () => ({
      quizCompleted: quizCompletedEvents?.length || 0,
      highScore: highScoreEvents?.length || 0,
      perfectScore: perfectScoreEvents?.length || 0,
      badgeEarned: badgeEarnedEvents?.length || 0,
      kwalaBadgeRequest: kwalaBadgeRequestEvents?.length || 0,
    })
  };
};