export function updateStreak(streak: number, lastActiveDate: Date | null): { streak: number; lastActiveDate: Date } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastActiveDate) {
    return { streak: 1, lastActiveDate: today };
  }

  const last = new Date(lastActiveDate);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { streak, lastActiveDate: last };
  if (diffDays === 1) return { streak: streak + 1, lastActiveDate: today };
  return { streak: 1, lastActiveDate: today };
}
