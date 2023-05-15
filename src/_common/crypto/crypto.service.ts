import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { randomBytes, pbkdf2, generateKeyPair, createCipheriv, createDecipheriv, scrypt, randomFill } from 'crypto'

@Injectable()
export class CryptoService {

    /**
     * Hashes password string async
     * @param password password to hash
     * @returns promise which resolves with the combination of hash and salt separated with dot
     */
    async hash(password: string): Promise<string> {
        return new Promise((res, rej) => {
            randomBytes(16, (err, buf) => {
                if (err) rej(err)
                const salt = buf.toString("base64url")

                pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
                    if (err) rej(err)
                    res(`${derivedKey.toString('base64url')}.${salt}`)
                })
            })
        })
    }

    /**
     * Compares given plain password with the combination of hash and salt
     * @param password password to compare
     * @param hash combination of hash and salt separated with dot
     * @returns promise which resolves with `true` or `false`
     */
    async compare(password: string, hash: string): Promise<boolean> {
        const [hashedPassword, salt] = hash.split(".")
        return new Promise((res, rej) => {
            pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
                if (err) rej(new InternalServerErrorException(err))
                if (hashedPassword === derivedKey.toString('base64url'))
                    res(true)
                else res(false)
            })
        })
    }

    /**
     * Generates RCA key pair
     * @returns promise which resolves with the object containing `publicKey` and `privateKey` params
     */
    async generateRCA(): Promise<{ publicKey: string, privateKey: string }> {
        return new Promise((res, rej) => {
            generateKeyPair('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            }, (err, publicKey, privateKey) => {
                if (err) rej(new InternalServerErrorException(err))
                res({ publicKey, privateKey })
            })
        })
    }

    private algorithm = process.env.CRYPTO_ALGORITHM
    private password = process.env.CRYPTO_PASS
    private salt = process.env.CRYPTO_SALT

    /**
     * Encrypts any JSON object
     * @param obj an object to encrypt
     * @returns encrypted string
     */
    async encryptJSON(obj: object): Promise<string> {
        return new Promise((res, rej) => {
            const clearString = JSON.stringify(obj)

            scrypt(this.password, this.salt, 24, (err, key) => {
                if (err) rej(err)

                randomFill(new Uint8Array(16), (err, iv) => {
                    if (err) rej(err)
                    try {
                        const cipher = createCipheriv(this.algorithm, key, iv)

                        let encrypted = cipher.update(clearString, 'utf8', 'base64url')
                        encrypted += cipher.final('base64url')
                        res([encrypted, Buffer.from(iv).toString("base64url")].join("."))
                    } catch (e) {
                        rej(new InternalServerErrorException(e.reason))
                    }
                })
            })
        })
    }

    /**
     * Decrypt the object encrypted with the `encryptJSON` method
     * @param encryptedString encrypted string
     * @returns decrypted JSON object
     */
    async decryptJSON(encryptedString: string): Promise<unknown> {
        return new Promise((res, rej) => {
            const [encrypted, iv] = encryptedString.split(".")

            scrypt(this.password, this.salt, 24, (err, key) => {
                if (err) rej(err)
                try {
                    const decipher = createDecipheriv(this.algorithm, key, Buffer.from(iv, "base64url"))

                    let decrypted = decipher.update(encrypted, 'base64url', 'utf8')
                    decrypted += decipher.final('utf8')
                    res(JSON.parse(decrypted))
                } catch (e) {
                    rej(new InternalServerErrorException(e.reason))
                }
            })
        })
    }

    /**
     * 
     * @returns 
     */
    generateSalt() {
        return randomBytes(16).toString("base64url")
    }
}
