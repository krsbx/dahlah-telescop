const timeStampRegex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{2})/;
const dataRegex =
  // eslint-disable-next-line no-useless-escape
  /~D \d+ \d+ \d+ \d+ \d+ \d+\s+([-\d\.]+)\s+([-\d\.]+)\s+([-\d\.]+)\s+N N\s+(\d+)\s+([-\d\.]+).*?(\d+)\s*~/;

/**
 * @param {string} logs
 * @returns {Promise<{timestamp: string; SKY: number; AMB:number; WIND: number; HUM: number; ADAY: number}[]>}
 */
async function parseClarityIILog(logs) {
  /**
   * @type {{timestamp: string; SKY: number; AMB:number; WIND: number; HUM: number; ADAY: number}[]}
   */
  const results = [];

  const lines = logs.split('\n');

  lines.forEach((line) => {
    if (!line.trim()) return;

    const withTimeStamp = line.match(timeStampRegex);

    if (!withTimeStamp) return;

    const withMinutesDayTag = line.includes('M  ~D');

    if (!withMinutesDayTag) return;

    let timestamp;

    try {
      timestamp = new Date(withTimeStamp[1]);
      if (Number.isNaN(timestamp.getTime())) {
        throw new Error('Invalid date format');
      }

      timestamp = timestamp.toISOString();
    } catch (err) {
      return;
    }

    const dataParts = line.match(dataRegex);

    if (!dataParts) return;

    results.push({
      timestamp,
      SKY: parseFloat(dataParts[1]),
      AMB: parseFloat(dataParts[2]),
      WIND: parseFloat(dataParts[3]),
      HUM: parseInt(dataParts[4], 10),
      ADAY: parseInt(dataParts[6], 10),
    });
  });

  return results;
}

module.exports = {
  parseClarityIILog,
};
