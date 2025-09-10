/**
 * Profile model based on the data-model.md specification
 */

/**
 * @typedef {Object} Contact
 * @property {string} email - Professional email address
 * @property {string} [phone] - Contact phone number
 * @property {string} [linkedIn] - LinkedIn profile URL
 * @property {string} [github] - GitHub profile URL
 */

/**
 * @typedef {Object} Profile
 * @property {string} name - Full name
 * @property {string} title - Professional title
 * @property {string} [location] - Current location
 * @property {Contact} contact - Contact information
 * @property {string} [about] - About me section
 * @property {string} [photo] - Profile photo URL
 * @property {string} [objective] - Professional objective
 */

/**
 * Default profile with placeholder values
 * @type {Profile}
 */
export const defaultProfile = {
  name: 'Suduli Kumar Balabantaray',
  title: 'Embedded Test Engineer',
  location: 'Bengaluru, India',
  contact: {
    email: 'suduli.office@gmail.com',
    phone: '+91 9500097614',
    linkedIn: 'https://www.linkedin.com/in/suduli/',
    github: 'https://github.com/suduli'
  },
  about: 'Experienced professional with 7+ years in Independent Verification & Validation for Critical Systems in the automotive domain...',
  photo: '/assets/images/profile.jpg',
  objective: 'To work in a professional atmosphere that would give a scope to display my skills request for a challenging position. Where I can use my skills to grow me and my organization.'
};

/**
 * Creates a new Profile instance
 * @param {Partial<Profile>} profileData - Partial profile data to initialize with
 * @returns {Profile} A new profile instance
 */
export const createProfile = (profileData = {}) => {
  return {
    ...defaultProfile,
    ...profileData,
    contact: {
      ...defaultProfile.contact,
      ...(profileData.contact || {})
    }
  };
};

/**
 * Validates a profile object to ensure required fields are present
 * @param {Profile} profile - The profile to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isProfileValid = (profile) => {
  // Check required fields
  if (!profile.name || !profile.title) {
    return false;
  }
  
  // Check required contact fields
  if (!profile.contact || !profile.contact.email) {
    return false;
  }
  
  return true;
};

/**
 * Gets a formatted display name (e.g., first name, last initial)
 * @param {Profile} profile - The profile to format name for
 * @returns {string} The formatted name
 */
export const getFormattedName = (profile) => {
  if (!profile.name) return '';
  
  const nameParts = profile.name.split(' ');
  if (nameParts.length <= 1) return profile.name;
  
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  return `${firstName} ${lastName.charAt(0)}.`;
};

/**
 * Gets social media links in a standardized format
 * @param {Profile} profile - The profile to get social links from
 * @returns {Array<{platform: string, url: string, icon: string}>} Formatted social links
 */
export const getSocialLinks = (profile) => {
  const links = [];
  
  if (profile.contact.linkedIn) {
    links.push({
      platform: 'LinkedIn',
      url: profile.contact.linkedIn,
      icon: 'linkedin'
    });
  }
  
  if (profile.contact.github) {
    links.push({
      platform: 'GitHub',
      url: profile.contact.github,
      icon: 'github'
    });
  }
  
  return links;
};

/**
 * Creates a contact link with proper formatting (tel: or mailto:)
 * @param {string} type - The type of contact ('email' or 'phone')
 * @param {string} value - The contact value
 * @returns {string} Properly formatted contact link
 */
export const formatContactLink = (type, value) => {
  if (!value) return '';
  
  switch (type) {
  case 'email':
    return `mailto:${value}`;
  case 'phone':
    // Remove non-numeric characters for tel: links
    const numericOnly = value.replace(/[^\d+]/g, '');
    return `tel:${numericOnly}`;
  default:
    return value;
  }
};

/**
 * Creates a profile from JSON data
 * @param {string} jsonData - JSON string containing profile data
 * @returns {Profile|null} The created profile or null if invalid JSON
 */
export const profileFromJson = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    return createProfile(data);
  } catch (error) {
    // Tests intentionally pass invalid JSON; keep debug-level logs to reduce noise
    console.debug('Failed to parse profile JSON:', error);
    return null;
  }
};

/**
 * Converts a profile to a JSON string
 * @param {Profile} profile - The profile to convert
 * @returns {string} JSON string representation of the profile
 */
export const profileToJson = (profile) => {
  return JSON.stringify(profile);
};
