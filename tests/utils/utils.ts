export const defaultPass: string = "!Test123";

export const bonusHistoryRange = (
  rangeInDays = 30,
): { start: number; end: number } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfDay = today.getTime();
  const dayRangeInMs = rangeInDays * 24 * 60 * 60 * 1000;
  const startOfRange = endOfDay - dayRangeInMs;

  return {
    start: startOfRange,
    end: endOfDay,
  };
};
