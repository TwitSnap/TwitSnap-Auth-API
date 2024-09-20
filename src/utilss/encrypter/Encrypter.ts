export interface Encrypter{
    encryptString(string: string): string;

    compareEncryptedString(encrypted: string, nonEncrypted: string): boolean;
}