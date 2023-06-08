// --------------- JWT options --------------------------------------------------------
export const accessTokenOptions = {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: 60 * 60,
}

export const refreshTokenOptions = {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: 60 * 60 * 24 * 7,
}

export const mailTokenOptions = {
    secret: process.env.JWT_MAIL_SECRET,
    expiresIn: 60 * 5,
}

// --------------- Exeptions ----------------------------------------------------------
export enum Exeption {
    ACCESS_IS_DENIED = 'You don\'t have access to this resource',
    NOT_AUTHORIZED = 'You are not authorized',
    NO_REFRESH_TOKEN = 'No refresh token has been provided',
    BAD_REFRESH_TOKEN = 'Invalid refresh token has been provided',
    REFRESH_TOKEN_EXPIRED = 'Provided refresh token has been expired',
    BAD_TOKEN = 'Invalid access token has been provided',
    NO_FINGERPRINT = 'A fingerprint must be provided',
    UNKOWN_INTERNAL_ERROR = 'Something goes wrong...',
    ERROR_SAVING_TOKEN = 'Token wasnt saved',
    BAD_REQUEST = 'The request contains a syntax error and cannot be processed',
    EMAIL_REJECTED = 'The email has been rejected by your mail server',
}

// --------------- Validation ---------------------------------------------------------

export enum ValidationError {
    CODE_IS_NUMBER = 'только цифры',
    CODE = 'код должен состоять из 5 цифр',
    EMAIL = 'не коррекнтный email',
    PHONE_IS_NUMBER = 'только цифры и +',
    PHONE = 'только 12 символов, включая +7',
    NAME = 'более 2-х, менее 24 букв',
    ADDRESS = 'более 2-х, менее 20 букв',
    POSTAL_CODE = 'должен состоять из 6 цифр',
    PASSWORD = 'более 8 символов, включая цифру, заглавную и строчную буквы и символ'
}

export const MESSAGE_400 = { status: 400, message: Exeption.BAD_REQUEST }

export const AUTH = {
    LOGIN_ERROR_IN: {
        PASSWORD: { ...MESSAGE_400, errors: { ['password']: 'Неверный пароль' } },
        EMAIL: { ...MESSAGE_400, errors: { ['email']: 'Пользователь с таким email не найден' } }
    },
    SIGNUP_ERROR_IN: {
        EMAIL_AND_PHONE: {
            status: 401,
            message: Exeption.NOT_AUTHORIZED,
            errors: {
                ['email']: 'Пользователь с этим email уже существует',
                ['phone']: 'Пользователь с этим телефоном уже существует'
            }
        },
        EMAIL: { ...MESSAGE_400, errors: { ['email']: 'Пользователь с этим email уже существует' } },
        PHONE: { ...MESSAGE_400, errors: { ['phone']: 'Пользователь с этим телефоном уже существует' } },
        CODE: { status: 400, message: 'Не верный код подтверждения, попробуйте еще раз' },
        TOKEN: { status: 400, message: 'Время действия кода истекло, попробуйте еще раз' }
    },
    LOGOUT_SUCCESS: { status: 200, message: 'Вы вышли из аккаунта' },
    MAIL_TITLE: 'Код подтверждения регистрации',
    MAIL_SUCCESS: 'Письмо успешно отправлено',
    CODE_SUCCESS: 'Код принят',
    SESSION_EXPIRED: 'Время действия кода истекло, попробуйте еще раз',
    PASSWORD_CHANGED: 'Пароль успешно изменен',
    WRONG_OLD_PASSWORD: { ...MESSAGE_400, errors: { ['currentPassword']: 'Неверный пароль' } },
    EMAIL_DOES_NOT_EXIST: { ...MESSAGE_400, errors: { ['email']: 'Пользователь с этим email не зарегистрирован' } }
}