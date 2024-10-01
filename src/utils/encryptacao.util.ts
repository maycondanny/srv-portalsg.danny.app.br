import CryptoJS from "crypto-js";

const chave = process.env.CHAVE_ENCRIPTACAO;

function encriptar(text) {
  const cipherText = CryptoJS.AES.encrypt(text, chave).toString();
  return cipherText;
}

function descriptar(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, chave);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

export default {
  encriptar,
  descriptar,
};
