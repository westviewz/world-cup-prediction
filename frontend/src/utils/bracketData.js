/**
 * FIFA World Cup 2026 – Quarterfinal Bracket Data
 *
 * Updated after Round of 16 results.
 * 8 remaining teams split into two finalist halves.
 *
 * Half 1 → Semifinal 1 side:
 *   Morocco, France, Spain, Belgium
 *
 * Half 2 → Semifinal 2 side:
 *   Norway, England, Argentina, Switzerland
 *
 * NOTE: Team names must exactly match the keys in teamCodes (teams.js)
 *       so that flag images load correctly.
 */

// ── Half 1: Semifinal 1 side ───────────────────────────────────
export const BRACKET_HALF_1 = [
  'Belgium',
  'France',
  'Morocco',
  'Spain',
].sort();

// ── Half 2: Semifinal 2 side ───────────────────────────────────
export const BRACKET_HALF_2 = [
  'Argentina',
  'England',
  'Norway',
  'Switzerland',
].sort();

// ── All 8 remaining qualified teams ───────────────────────────
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
