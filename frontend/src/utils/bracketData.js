/**
 * FIFA World Cup 2026 – Semifinal Bracket Data
 *
 * Updated after Quarterfinal results.
 * 4 remaining semifinalists split into their fixed paths.
 *
 * Half 1 → Semifinal 1: France vs Spain
 * Half 2 → Semifinal 2: England vs Argentina
 *
 * NOTE: Team names must exactly match the keys in teamCodes (teams.js)
 *       so that flag images load correctly.
 */

// ── Half 1: Semifinal 1 (France vs Spain) ─────────────────────
export const BRACKET_HALF_1 = [
  'France',
  'Spain',
].sort();

// ── Half 2: Semifinal 2 (England vs Argentina) ────────────────
export const BRACKET_HALF_2 = [
  'Argentina',
  'England',
].sort();

// ── All 4 remaining teams ──────────────────────────────────────
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
