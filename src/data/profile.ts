import type { Profile } from '@/types/preferences';

/**
 * Static local profile fixture. Not persisted — this stands in for a real
 * user record once authentication is added.
 */
export const profile: Profile = {
  name: 'Jordan Rivera',
};

export const profileAvatar = require('../../assets/profile/avatar.png');
