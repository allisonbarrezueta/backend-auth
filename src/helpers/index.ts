import crypto from "crypto";
export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (
    salt: string,
    password: string,
    secretPhrase: string
) => {
    const combinedPassword = `${password}${secretPhrase}`;
    return crypto
        .pbkdf2Sync(combinedPassword, salt, 10000, 64, "sha512")
        .toString("base64");
};
