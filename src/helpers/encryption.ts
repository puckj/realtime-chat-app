import {SC_KEY} from '@env';
import aesjs from 'aes-js';

export const Encryption = async (password: string) => {
  let key: number[] = Array.from(
    SC_KEY.split(',').map((x: string | number) => +x),
  );
  let iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let ksize = 16;
  let input_string = password;
  let expect_len = (Math.floor(input_string.length / ksize) + 1) * ksize;
  let text = input_string.padEnd(
    expect_len,
    aesjs.utils.utf8.fromBytes([ksize - (input_string.length % ksize)]),
  );
  let textBytes = aesjs.utils.utf8.toBytes(text);
  let aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  let encryptedBytes = aesCbc.encrypt(textBytes);
  let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
};
