import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";

export const encryption = (text, secretKey) => {
  try {
    if (!text || !secretKey)
      throw new Error("Missing text or secret key for encryption.");

    const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();
    return encryptedText;
  } catch (error) {
    console.error("Encryption error:", error.message);
    return null;
  }
};

export const decryption = (encryptedText, secretKey) => {
  try {
    if (!encryptedText || !secretKey)
      throw new Error("Missing text or secret key for decryption.");

    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Decryption failed. Invalid key or corrupted data.");
    }

    return decryptedText;
  } catch (error) {
    console.error("Decryption error:", error.message);
    return null;
  }
};

export const hashing = async (text, saltRounds = 10) => {
  try {
    if (!text) throw new Error("Missing text for hashing.");
    return await bcrypt.hash(text, saltRounds);
  } catch (error) {
    console.error("Hashing error:", error.message);
    return null;
  }
};

export const comparing = async (text, hashedText) => {
  try {
    if (!text || !hashedText)
      throw new Error("Missing text or hashed text for comparison.");
    return await bcrypt.compare(text, hashedText);
  } catch (error) {
    console.error("Comparison error:", error.message);
    return false;
  }
};
