/**
 * FIFA World Cup 2026 – Round of 16 Bracket Data
 *
 * Updated after Round of 32 results.
 * 16 remaining teams split into two finalist halves.
 *
 * Half 1 → Semifinal 1 side (finalist from this half):
 *   Canada, Morocco, Paraguay, France, Portugal, Spain,
 *   United States, Belgium
 *
 * Half 2 → Semifinal 2 side (finalist from this half):
 *   Brazil, Norway, Mexico, England, Argentina, Egypt,
 *   Switzerland, Colombia
 *
 * NOTE: Team names must exactly match the keys in teamCodes (teams.js)
 *       so that flag images load correctly.
 */

// ── Half 1: Semifinal 1 side ───────────────────────────────────
export const BRACKET_HALF_1 = [
  'Belgium',
  'Canada',
  'France',
  'Morocco',
  'Paraguay',
  'Portugal',
  'Spain',
  'United States',
].sort();

// ── Half 2: Semifinal 2 side ───────────────────────────────────
export const BRACKET_HALF_2 = [
  'Argentina',
  'Brazil',
  'Colombia',
  'Egypt',
  'England',
  'Mexico',
  'Norway',
  'Switzerland',
].sort();

// ── All 16 remaining qualified teams ──────────────────────────
export const qualifiedTeams = [...BRACKET_HALF_1, ...BRACKET_HALF_2].sort();

/**
 * Given a selected champion, returns the list of valid runner-up
 * candidates — only teams from the OPPOSITE bracket half.
 *
 * @param {string} champion - The selected winner team name
 * @returns {string[]} Sorted list of valid runner-up teams
 */
export function getRunnerUpOptions(champion) {
  if (!champion) return qualifiedTeams;
  const inHalf1 = BRACKET_HALF_1.includes(champion);
  return inHalf1 ? BRACKET_HALF_2 : BRACKET_HALF_1;
}
