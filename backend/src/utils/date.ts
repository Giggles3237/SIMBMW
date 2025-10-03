import { GAME_CONSTANTS } from '@dealership-sim/shared';

export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function advanceDate(
  currentDay: number,
  currentMonth: number,
  currentYear: number,
  daysToAdvance: number
): { day: number; month: number; year: number } {
  let day = currentDay + daysToAdvance;
  let month = currentMonth;
  let year = currentYear;

  while (day > GAME_CONSTANTS.DAYS_IN_MONTH) {
    day -= GAME_CONSTANTS.DAYS_IN_MONTH;
    month++;
    if (month > GAME_CONSTANTS.MONTHS_IN_YEAR) {
      month = 1;
      year++;
    }
  }

  return { day, month, year };
}

export function isNewMonth(oldMonth: number, newMonth: number): boolean {
  return oldMonth !== newMonth;
}
