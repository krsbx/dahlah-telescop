import dayjs from 'dayjs';

export /**
 * @param {{timestamp: string; SKY: number; AMB:number; WIND: number; HUM: number; ADAY: number}[]} stats
 * @param {number} maxHour
 * @returns {Record<string, {timestamp: string; SKY: number; AMB:number; WIND: number; HUM: number; ADAY: number}[]>}
 */
function groupStatsByHour(stats, maxHour = 24) {
  return stats.reduce((acc, curr) => {
    const date = dayjs(curr.timestamp);
    const hour = date.hour();

    if (hour > maxHour) return acc;

    acc[hour] = acc[hour] || [];
    acc[hour].push(curr);

    return acc;
  }, {});
}

/**
 * @param {Record<string, {timestamp: string; SKY: number; AMB:number; WIND: number; HUM: number; ADAY: number}[]>} stats
 * @returns {Record<string, {timestamp: string; SKY: number; AMB:number; WIND: number; HUM: number; ADAY: number}>}
 */
export function avgStatsByHour(stats) {
  const results = {};

  Object.keys(stats).forEach((hour) => {
    results[hour] = stats[hour].reduce(
      (acc, curr) => {
        acc.SKY += curr.SKY;
        acc.AMB += curr.AMB;
        acc.WIND += curr.WIND;
        acc.HUM += curr.HUM;
        acc.ADAY += curr.ADAY;
        acc.count++;

        return acc;
      },
      {
        SKY: 0,
        AMB: 0,
        WIND: 0,
        HUM: 0,
        ADAY: 0,
        count: 0,
      }
    );
    results[hour].SKY /= results[hour].count;
    results[hour].AMB /= results[hour].count;
    results[hour].WIND /= results[hour].count;
    results[hour].HUM /= results[hour].count;
    results[hour].ADAY /= results[hour].count;
  });

  return results;
}
