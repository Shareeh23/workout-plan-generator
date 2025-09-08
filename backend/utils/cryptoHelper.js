require('dotenv').config();
const crypto = require('crypto');

class CryptoHelper {
  constructor() {
    if (!process.env.CRYPTO_ENCRYPTION_KEY) {
      throw new Error('CRYPTO_ENCRYPTION_KEY is not defined in environment variables');
    }
    
    this.ENCRYPTION_KEY = process.env.CRYPTO_ENCRYPTION_KEY.trim();
    this.IV_LENGTH = 16; // AES block size

    // Convert hex string to buffer and check length
    const keyBuffer = Buffer.from(this.ENCRYPTION_KEY, 'hex');
    if (keyBuffer.length !== 32) {
      throw new Error(`Invalid CRYPTO_ENCRYPTION_KEY. Expected 32 bytes (64 hex chars), got ${keyBuffer.length} bytes`);
    }
  }

  /**
   * Encrypts a string using AES-256-CBC
   * @param {string} text - The text to encrypt
   * @returns {string} Encrypted string in format 'iv:encryptedText'
   */
  encrypt(text) {
    if (text === undefined || text === null) return null;
    
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const keyBuffer = Buffer.from(this.ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      keyBuffer,
      iv
    );
    
    let encrypted = cipher.update(text.toString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypts a string encrypted with encrypt()
   * @param {string} text - The encrypted text in format 'iv:encryptedText'
   * @returns {string|null} Decrypted string or null if decryption fails
   */
  decrypt(text) {
    if (!text) return null;
    
    try {
      const [ivHex, encryptedText] = text.split(':');
      if (!ivHex || !encryptedText) return null;
      
      const iv = Buffer.from(ivHex, 'hex');
      const keyBuffer = Buffer.from(this.ENCRYPTION_KEY, 'hex');
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        keyBuffer,
        iv
      );
      
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err) {
      console.error('Decryption error:', err);
      return null;
    }
  }

  /**
   * Mongoose setter function for string fields
   */
  get encryptString() {
    return (value) => this.encrypt(value);
  }

  /**
   * Mongoose getter function for string fields
   */
  get decryptString() {
    return (value) => this.decrypt(value);
  }

  /**
   * Mongoose setter for number fields (converts to string and encrypts)
   */
  get encryptNumber() {
    return (value) =>
      value !== undefined && value !== null
        ? this.encrypt(value.toString())
        : undefined;
  }

  /**
   * Mongoose getter for number fields (decrypts and parses to number)
   */
  get decryptNumber() {
    return (value) => {
      const decrypted = this.decrypt(value);
      return decrypted !== null ? parseFloat(decrypted) : null;
    };
  }
}

// Export a singleton instance
module.exports = new CryptoHelper();