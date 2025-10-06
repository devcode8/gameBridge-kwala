"use client";

import Image from "next/image";
import { useState } from "react";
import { getBadgeLocalUrl } from "@/utils/ipfs";

interface BadgeProps {
  score: number;
  level: string;
  color: string;
  path: string;
  size?: number;
  showLabel?: boolean;
}

export default function Badge({ score, level, color, path, size = 80, showLabel = true }: BadgeProps) {
  const [imgSrc, setImgSrc] = useState(path);
  const [imgError, setImgError] = useState(false);
  
  const handleImageError = () => {
    if (!imgError && score > 0) {
      // Fallback to local badge if IPFS fails
      const localPath = getBadgeLocalUrl(score);
      setImgSrc(localPath);
      setImgError(true);
    }
  };

  if (!path || score === 0) {
    return (
      <div className="flex flex-col items-center">
        <div 
          className="rounded-full border-4 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <span className="text-gray-400 text-xs">No Badge</span>
        </div>
        {showLabel && (
          <p className="text-xs text-gray-500 mt-2">No Achievement</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Image
          src={imgSrc}
          alt={`${level} Badge - Score ${score}`}
          width={size}
          height={size}
          className="drop-shadow-lg"
          onError={handleImageError}
        />
        {score === 10 && (
          <div className="absolute -top-2 -right-2 animate-pulse">
            <span className="text-2xl">🏆</span>
          </div>
        )}
      </div>
      {showLabel && (
        <div className="text-center mt-2">
          <p className="text-sm font-semibold" style={{ color }}>
            {level}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Score: {score}/10
          </p>
        </div>
      )}
    </div>
  );
}