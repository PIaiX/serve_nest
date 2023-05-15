import Prisma from '@prisma/client'
import { IsEmail, IsNumberString, Length } from 'class-validator'
import { Pagination } from 'src/_common/@types/pagination.entity'
import { AccessToken } from 'src/auth/entities/session.entity'
import { ValidationError } from 'src/constants'

export class User implements Prisma.User {

    /** User ID 
     * @example number
     */
    id: number

    /** User e-mail, must be unique */
    @IsEmail({}, { message: ValidationError.EMAIL })
    email: string

    /** User phone number 
     * @example string 
     */
    @IsNumberString({}, { message: ValidationError.PHONE_IS_NUMBER })
    @Length(12, 12, { message: ValidationError.PHONE })
    phone: string

    /** User name */
    @Length(2, 24, { message: ValidationError.NAME })
    firstName: string

    /** User last name */
    @Length(2, 24, { message: ValidationError.NAME })
    lastName: string

    /** User last name */
    @Length(2, 24, { message: ValidationError.NAME })
    middleName: string

    /** User date of birth 
     * @example Date
     */
    dateOfBirth: Date

    /** User additional info */
    about: string

    /** User avatar image */
    avatar: string

    /** User city */
    @Length(2, 24, { message: ValidationError.ADDRESS })
    city: string

    /** Is user profile is visible for all 
     * @example Date
    */
    invisibleBeforeDate: Date

    /** User role 
     *  @example Role
     */
    role: Role

    /** Date and time the user profile has been created
     * @example Date
     */
    createdAt: Date

    /** Date and time the user profile has been updated
     * @example Date
     */
    updatedAt: Date

    /** The company the user represents */
    company: string

    /** Type of the user. May be company or person */
    userType: number

    canDisturbMeFrom: string
    canDisturbMeTo: string
    isReducingLastName: boolean
    isShowingPatronymic: boolean
    emailOnPickOrOffer: boolean
    notificationOnPickOrOffer: boolean
    callsOnPickOrOffer: boolean
    emailOnNewOrder: boolean
    notificationsOnNewOrder: boolean
    newOrdersPeriodicity: number
    emailOnOthers: boolean
    smsAndCallsOnOthers: boolean
    timeToNotificationsFrom: string
    timeToNotificationsTo: string
    anyTime: boolean
    isCustomerAllowedToCall: boolean
    isCustomerAllowedToChat: boolean
    isCustomerAllowedToSuggest: boolean
}

export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    USER = 'USER'
}

export class UserWithToken extends AccessToken {
    user: User
}

export class Users extends Pagination {
    users: User[]
}