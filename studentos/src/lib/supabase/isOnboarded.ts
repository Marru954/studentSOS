/**
 * Single source of truth for the "is this user onboarded?" predicate.
 *
 * Before this helper the check was spelled three different ways across the app
 * (FirstRunGate: presetId + yearOfStudy; AuthCallback: preset_id + programme;
 * CruscottoTour: presetId alone), so a half-configured profile could pass one
 * gate and be bounced by another. The rule is now defined exactly once here:
 * a user is onboarded only when ALL THREE of ateneo (preset_id), corso
 * (programme) and anno (year_of_study) are present.
 *
 * Pure and framework-free: the `Profile` shape is structural so both the cloud
 * `RemoteProfile` (snake_case, the authoritative source) and a settings-derived
 * object can be passed without conversion ceremony.
 */

/** Minimal profile fields needed to decide onboarding completion. */
export interface Profile {
  preset_id?: string | null;
  programme?: string | null;
  year_of_study?: number | null;
}

/**
 * True only when ateneo, corso and anno are all set. Empty strings count as
 * "not set" (preserves the previous `Boolean(presetId)` behaviour); a year of
 * `0` is treated as present (`!= null`) since valid years are 1+ anyway.
 */
export function isOnboarded(profile: Profile | null | undefined): boolean {
  if (!profile) return false;
  return (
    Boolean(profile.preset_id) &&
    Boolean(profile.programme) &&
    profile.year_of_study != null
  );
}
