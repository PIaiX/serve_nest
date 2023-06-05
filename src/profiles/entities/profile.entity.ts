import Prisma from "@prisma/client"

export class Profile implements Prisma.Profile {
    userId: number
    image: string | null
    about: string | null
    gender: Gender
    dateOfBirth: Date | null
    videos: string[]
    educations: string[]
    certs: string[]
    whatsApp: string | null
    telegram: string | null
    skype: string | null
    mail: string | null
    youTube: string | null
    webSite: string | null
    isActivated: boolean
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}