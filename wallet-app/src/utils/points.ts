/**
 * Gets the number of days since the start of the current season.
 * Seasons:
 * Spring: March 1
 * Summer: June 1
 * Autumn: September 1
 * Winter: December 1
 */
export const getDaysSinceSeasonStart = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed

  let seasonStart: Date;

  if (month >= 2 && month <= 4) {
    // Spring: March, April, May
    seasonStart = new Date(year, 2, 1);
  } else if (month >= 5 && month <= 7) {
    // Summer: June, July, August
    seasonStart = new Date(year, 5, 1);
  } else if (month >= 8 && month <= 10) {
    // Autumn: September, October, November
    seasonStart = new Date(year, 8, 1);
  } else {
    // Winter: December, January, February
    const seasonYear = month === 11 ? year : year - 1;
    seasonStart = new Date(seasonYear, 11, 1);
  }

  const diffTime = Math.abs(date.getTime() - seasonStart.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

/**
 * Calculates daily points based on the day of the season.
 * Day 1: 2 points
 * Day 2: 3 points
 * Day 3+: 100% of P(n-2) + 60% of P(n-1)
 */
export const calculateDailyPoints = (day: number): number => {
  if (day <= 0) return 0;
  if (day === 1) return 2;
  if (day === 2) return 3;

  let prevPrev = 2; // Day 1
  let prev = 3;     // Day 2
  let current = 0;

  for (let i = 3; i <= day; i++) {
    current = (prevPrev * 1.0) + (prev * 0.6);
    prevPrev = prev;
    prev = current;
  }
  
  return Math.round(current);
};

/**
 * Formats points for display. If points > 1000, returns in K format (rounded to nearest K).
 */
export const formatPoints = (points: number): string => {
  if (points >= 1000) {
    const kValue = Math.round(points / 1000);
    return `${kValue}K`;
  }
  return points.toString();
};
