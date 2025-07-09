/**
 * 패스워드 해시 암호화 (SHA-256)
 */
export const hashPassword = async (password) => {
  try {
    const secretKey = import.meta.env.VITE_PASSWORD_SECRET_KEY || 'default-secret-key';

    const message = password + secretKey;

    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16)
      .padStart(2, '0'))
      .join('');

    return hashHex;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * 패스워드 일치 비교
 */
export const verifyPassword = async (password, storedHash) => {
  try {
    const hashedPassword = await hashPassword(password);
    return hashedPassword === storedHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};
