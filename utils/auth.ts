import {  compare } from 'bcryptjs';
import { Cipher, createCipheriv, createDecipheriv, randomBytes } from "crypto";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface EncryptedText {
    iv: string;
    encryptedData: string;
}

interface User {
    name: string;
    id: string;
    userName: string;
}

const iv = randomBytes(16);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

const decrypt = async (text: EncryptedText) => {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    let decipher = createDecipheriv(
        process.env.CRYPTO_ENCRYPT_DECRYPT_ALGORITHM!,
        Buffer.from(process.env.CRYPTO_ENCRYPT_DECRYPT_KEY!),
        iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

const encrypt = async (text: string) => {
    let cipher = createCipheriv(
        process.env.CRYPTO_ENCRYPT_DECRYPT_ALGORITHM!,
        Buffer.from(process.env.CRYPTO_ENCRYPT_DECRYPT_KEY!),
        iv
    );

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString("hex"),
        encryptedData: encrypted.toString("hex"),
    };
};

const generateEncryptedVarifyLink = async (user: User) => {
    const userDetails = {
        id: user.id,
        name: user.userName,
        expireIn: dayjs(),
    };
    try {
        const string = await JSON.stringify(userDetails);
        var encryptedStr = await encrypt(string);
        return encryptedStr;
    } catch (error: any) {
        throw NextResponse.json({
            success: false,
            message: "Failed to generate encrypted link",
            error: error.message,
        });
    }
};

const sendEmailWithVarifyLink = async (
    email: string,
    link: string,
    text: string,
    subject: string
) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text + " " + link,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw NextResponse.json({
                success: false,
                message: "Failed to send email",
                error: error.message,
            });
        }
    });
};

const isPasswordCorrect = async({password,dbPassword}:{password:string,dbPassword:string})=>{
    return await compare(password,dbPassword)
}

export {
    generateEncryptedVarifyLink,
    sendEmailWithVarifyLink,
    encrypt,
    decrypt,
    isPasswordCorrect
};
