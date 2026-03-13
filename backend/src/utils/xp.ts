export const XP_PER_SESSION = 50;
export const XP_PER_TASK = 100;
export const XP_PER_DAILY_LOGIN = 20;

export function xpThreshold(level: number): number {
  return 1000 + (level - 1) * 200;
}

interface XpState {
  level: number;
  xpCurrent: number;
  xpToNextLevel: number;
  totalXp: number;
}

export function applyXp(state: XpState, xpGained: number): { state: XpState; leveledUp: boolean } {
  const updated = { ...state, xpCurrent: state.xpCurrent + xpGained, totalXp: state.totalXp + xpGained };
  let leveledUp = false;

  while (updated.xpCurrent >= updated.xpToNextLevel) {
    updated.xpCurrent -= updated.xpToNextLevel;
    updated.level += 1;
    updated.xpToNextLevel = xpThreshold(updated.level);
    leveledUp = true;
  }

  return { state: updated, leveledUp };
}
