/**
 * Official British Council & IDP IELTS Scoring Utility
 * 
 * Implements exact raw score conversion tables, criteria weighting,
 * and official IELTS band rounding rules for Listening, Reading, Writing, and Overall Band.
 */

// 1. Official IELTS Listening Raw-to-Band Table (BC / IDP Standard)
export const getOfficialListeningBand = (correctCount: number): number => {
  const correct = Math.max(0, Math.min(40, Math.round(correctCount)));
  if (correct >= 39) return 9.0;
  if (correct >= 37) return 8.5;
  if (correct >= 35) return 8.0;
  if (correct >= 32) return 7.5;
  if (correct >= 30) return 7.0;
  if (correct >= 26) return 6.5;
  if (correct >= 23) return 6.0;
  if (correct >= 18) return 5.5;
  if (correct >= 16) return 5.0;
  if (correct >= 13) return 4.5;
  if (correct >= 10) return 4.0;
  if (correct >= 8) return 3.5;
  if (correct >= 6) return 3.0;
  if (correct >= 4) return 2.5;
  if (correct >= 3) return 2.0;
  if (correct >= 1) return 1.5;
  return 1.0;
};

// 2. Official IELTS Academic Reading Raw-to-Band Table (BC / IDP Standard)
export const getOfficialReadingBand = (correctCount: number): number => {
  const correct = Math.max(0, Math.min(40, Math.round(correctCount)));
  if (correct >= 39) return 9.0;
  if (correct >= 37) return 8.5;
  if (correct >= 35) return 8.0;
  if (correct >= 33) return 7.5;
  if (correct >= 30) return 7.0;
  if (correct >= 27) return 6.5;
  if (correct >= 23) return 6.0;
  if (correct >= 19) return 5.5;
  if (correct >= 15) return 5.0;
  if (correct >= 13) return 4.5;
  if (correct >= 10) return 4.0;
  if (correct >= 8) return 3.5;
  if (correct >= 6) return 3.0;
  if (correct >= 4) return 2.5;
  if (correct >= 3) return 2.0;
  if (correct >= 1) return 1.5;
  return 1.0;
};

// 3. Official IELTS Band Rounding Rule (BC / IDP Standard)
// - Ends in .25 -> rounds UP to .5 (e.g. 6.25 -> 6.5)
// - Ends in .75 -> rounds UP to 1.0 (e.g. 6.75 -> 7.0)
// - Ends in .125 -> rounds DOWN to .0 (e.g. 6.125 -> 6.0)
// - Ends in .375 / .625 -> rounds TO .5 (e.g. 6.375 -> 6.5, 6.625 -> 6.5)
// - Ends in .875 -> rounds UP to 1.0 (e.g. 6.875 -> 7.0)
export const roundOfficialIELTSBand = (score: number): number => {
  if (isNaN(score) || score <= 0) return 1.0;
  if (score >= 9.0) return 9.0;

  const floor = Math.floor(score);
  const decimal = score - floor;

  if (decimal < 0.25) {
    return floor;
  } else if (decimal < 0.75) {
    return floor + 0.5;
  } else {
    return floor + 1.0;
  }
};

// 4. Calculate Official IELTS Writing Overall Band (Task 1: 1/3, Task 2: 2/3)
export const calculateOfficialWritingBand = (
  task1Band: number | null,
  task2Band: number | null
): number => {
  const hasT1 = task1Band !== null && task1Band > 0;
  const hasT2 = task2Band !== null && task2Band > 0;

  if (hasT1 && hasT2) {
    const rawWeighted = (task1Band! * 1 + task2Band! * 2) / 3;
    return roundOfficialIELTSBand(rawWeighted);
  } else if (hasT1) {
    return roundOfficialIELTSBand(task1Band!);
  } else if (hasT2) {
    return roundOfficialIELTSBand(task2Band!);
  }
  return 1.0;
};

// 5. Calculate Official IELTS Overall Band Score
export const calculateOfficialOverallBand = (
  listeningBand: number,
  readingBand: number,
  writingBand: number,
  speakingBand: number
): number => {
  const average = (listeningBand + readingBand + writingBand + speakingBand) / 4;
  return roundOfficialIELTSBand(average);
};
