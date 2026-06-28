/**
 * FIFA World Cup 2026 – Round of 32 Bracket Data
 *
 * Halves derived directly from the official Round of 32 fixture list.
 * Consecutive fixture pairs feed into the same R16 match:
 *   Fixtures 1–2  → R16-1 ┐
 *   Fixtures 3–4  → R16-2 ┘ QF-A ┐
 *   Fixtures 5–6  → R16-3 ┐      ├─ SF-1 (HALF 1)
 *   Fixtures 7–8  → R16-4 ┘ QF-B ┘
 *
 *   Fixtures 9–10 → R16-5 ┐
 *   Fixtures 11–12→ R16-6 ┘ QF-C ┐
 *   Fixtures 13–14→ R16-7 ┐      ├─ SF-2 (HALF 2)
 *   Fixtures 15–16→ R16-8 ┘ QF-D ┘
 *
 * Official Round of 32 Fixtures:
 *  [1]  South Africa        vs Canada
 *  [2]  Brazil              vs Japan
 *  [3]  Germany             vs Paraguay
 *  [4]  Netherlands         vs Morocco
 *  [5]  Côte d'Ivoire       vs Norway
 *  [6]  France              vs Sweden
 *  [7]  Mexico              vs Ecuador
 *  [8]  England             vs Congo DR
 *  [9]  Belgium             vs Senegal
 *  [10] United States       vs Bosnia and Herzegovina
 *  [11] Spain               vs Austria
 *  [12] Portugal            vs Croatia
 *  [13] Switzerland         vs Algeria
 *  [14] Australia           vs Egypt
 *  [15] Argentina           vs Cabo Verde
 *  [16] Colombia            vs Ghana
 *
 * NOTE: Team names must exactly match the keys in teamCodes (teams.js)
 *       so that flag images load correctly.
 */

// ── Half 1 (SF-1 path): Fixtures 1–8 ──────────────────────────
// South Africa/Canada, Brazil/Japan, Germany/Paraguay,
// Netherlands/Morocco, Côte d'Ivoire/Norway, France/Sweden,
// Mexico/Ecuador, England/Congo DR
export const BRACKET_HALF_1 = [
  'Brazil',
  'Canada',
  "Côte d'Ivoire",
  'Congo DR',
  'Ecuador',
  'England',
  'France',
  'Germany',
  'Japan',
  'Mexico',
  'Morocco',
  'Netherlands',
  'Norway',
  'Paraguay',
  'South Africa',
  'Sweden',
].sort();

// ── Half 2 (SF-2 path): Fixtures 9–16 ─────────────────────────
// Belgium/Senegal, United States/Bosnia, Spain/Austria,
// Portugal/Croatia, Switzerland/Algeria, Australia/Egypt,
// Argentina/Cabo Verde, Colombia/Ghana
export const BRACKET_HALF_2 = [
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Bosnia and Herzegovina',
  'Cabo Verde',
  'Colombia',
  'Croatia',
  'Egypt',
  'Ghana',
  'Portugal',
  'Senegal',
  'Spain',
  'Switzerland',
  'United States',
].sort();

// ── All 32 qualified teams ─────────────────────────────────────
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
