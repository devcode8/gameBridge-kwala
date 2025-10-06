// IPFS Configuration for Badge Assets
export const IPFS_CONFIG = {
  CID: "bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde",
  BASE_URL: "https://ipfs.io/ipfs/bafybeie3zikearfd4cvobe3gxblwlzlctmgag3lpztooi6r44ncissihde",
  GATEWAY_URL: "https://ipfs.io/ipfs"
} as const;

// Badge file mapping (score to actual file name)
export const BADGE_FILE_MAP = {
  10: "winner.png",  // Perfect Score - Winner badge
  9: "9.png",        // Excellent
  8: "8.png",        // Great
  7: "7.png",        // Good
  6: "6.png",        // Above Average
  5: "5.png",        // Average
  4: "4.png",        // Fair
  3: "3.png",        // Below Average
  2: "2.png",        // Poor
  1: "1.png"         // Basic
} as const;

// Generate IPFS URL for a badge based on score
export const getBadgeIPFSUrl = (score: number): string => {
  const fileName = BADGE_FILE_MAP[score as keyof typeof BADGE_FILE_MAP];
  if (!fileName) return "";
  
  return `${IPFS_CONFIG.BASE_URL}/${fileName}`;
};

// Generate local fallback URL for a badge based on score
export const getBadgeLocalUrl = (score: number): string => {
  const fileName = BADGE_FILE_MAP[score as keyof typeof BADGE_FILE_MAP];
  if (!fileName) return "";
  
  return `/badges/${fileName}`;
};

// Generate IPFS URL for any file in the badges collection
export const getIPFSUrl = (fileName: string): string => {
  return `${IPFS_CONFIG.BASE_URL}/${fileName}`;
};

// Alternative gateways for better performance/availability
export const ALTERNATIVE_GATEWAYS = [
  "https://cloudflare-ipfs.com/ipfs",
  "https://gateway.pinata.cloud/ipfs",
  "https://dweb.link/ipfs"
] as const;

// Get badge URL with fallback gateways
export const getBadgeUrlWithFallback = (score: number, gatewayIndex = 0): string => {
  const fileName = BADGE_FILE_MAP[score as keyof typeof BADGE_FILE_MAP];
  if (!fileName) return "";
  
  const gateway = gatewayIndex < ALTERNATIVE_GATEWAYS.length 
    ? ALTERNATIVE_GATEWAYS[gatewayIndex]
    : IPFS_CONFIG.GATEWAY_URL;
  
  return `${gateway}/${IPFS_CONFIG.CID}/${fileName}`;
};

// Preload badge images for better performance
export const preloadBadgeImages = (): void => {
  Object.values(BADGE_FILE_MAP).forEach(fileName => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = `${IPFS_CONFIG.BASE_URL}/${fileName}`;
    document.head.appendChild(link);
  });
};

// Validate IPFS URL
export const isValidIPFSUrl = (url: string): boolean => {
  return url.includes(IPFS_CONFIG.CID) && url.includes('.png');
};