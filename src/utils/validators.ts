/**
 * Validates if the given string is a valid Gmail address
 * @param email - Email address to validate
 * @returns true if valid Gmail address
 */
export function isValidGmail(email: string): boolean {
    const trimmedEmail = email.trim().toLowerCase();
    return trimmedEmail.endsWith('@gmail.com') && trimmedEmail.length > 10;
}

/**
 * Validates if the given string is a valid Indian phone number
 * Accepts: 9876543210, +919876543210, 09876543210
 * @param phone - Phone number to validate
 * @returns true if valid Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
    const trimmedPhone = phone.trim();

    // Remove +91 or 0 prefix if present
    const normalized = normalizePhone(trimmedPhone);

    // Must be exactly 10 digits and start with 6-9
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(normalized);
}

/**
 * Normalizes Indian phone number by removing country code and leading zero
 * @param phone - Phone number to normalize
 * @returns Normalized 10-digit phone number
 */
export function normalizePhone(phone: string): string {
    let normalized = phone.trim();

    // Remove +91 prefix
    if (normalized.startsWith('+91')) {
        normalized = normalized.substring(3);
    }

    // Remove 0 prefix
    if (normalized.startsWith('0')) {
        normalized = normalized.substring(1);
    }

    return normalized;
}

/**
 * Validates if the given string is either a valid Gmail or valid Indian phone
 * @param identity - Email or phone number to validate
 * @returns true if valid identity
 */
export function isValidIdentity(identity: string): boolean {
    return isValidGmail(identity) || isValidIndianPhone(identity);
}

/**
 * Determines the type of identity (email or phone)
 * @param identity - Identity string
 * @returns 'email' or 'phone' or 'unknown'
 */
export function getIdentityType(identity: string): 'email' | 'phone' | 'unknown' {
    if (isValidGmail(identity)) return 'email';
    if (isValidIndianPhone(identity)) return 'phone';
    return 'unknown';
}

/**
 * Gets error message for invalid identity format
 */
export function getIdentityErrorMessage(identity: string): string {
    if (!identity.trim()) {
        return 'Please enter an email or phone number';
    }

    const type = getIdentityType(identity);
    if (type !== 'unknown') {
        return ''; // Valid
    }

    // Check if it looks like an email
    if (identity.includes('@')) {
        if (!isValidGmail(identity)) {
            return 'Only Gmail addresses (@gmail.com) are allowed';
        }
    } else {
        // Looks like a phone number
        return 'Please enter a valid 10-digit Indian phone number';
    }

    return 'Please enter a valid Gmail address or phone number';
}
