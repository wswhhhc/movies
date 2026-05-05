import type { Session } from "next-auth";

export const PREMIUM_POPULARITY_THRESHOLD = 150;
export const PREMIUM_VOTE_AVERAGE_THRESHOLD = 8.5;

const EMPTY_SESSION = { user: { role: "FREE" as const, subscriptionEndsAt: null } };

/**
 * 判断电影是否为「付费专属」
 */
export function isPremiumMovie(movie: {
  popularity?: number | null;
  voteAverage?: number | null;
}): boolean {
  return (
    (movie.popularity ?? 0) > PREMIUM_POPULARITY_THRESHOLD ||
    (movie.voteAverage ?? 0) > PREMIUM_VOTE_AVERAGE_THRESHOLD
  );
}

/**
 * 获取用户的等效角色，考虑会员过期
 */
export function getEffectiveRole(
  session: Session | null
): "FREE" | "PREMIUM" {
  const s = session ?? EMPTY_SESSION;
  if (s.user.role !== "PREMIUM") return "FREE";
  if (s.user.subscriptionEndsAt) {
    const expiry = new Date(s.user.subscriptionEndsAt);
    if (expiry < new Date()) return "FREE";
  }
  return "PREMIUM";
}

/**
 * 电影对该用户是否锁定
 */
export function isMovieLockedForUser(
  movie: { popularity?: number | null; voteAverage?: number | null },
  session: Session | null
): boolean {
  if (getEffectiveRole(session) === "PREMIUM") return false;
  return isPremiumMovie(movie);
}
