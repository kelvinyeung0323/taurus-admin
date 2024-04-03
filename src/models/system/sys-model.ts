import {Dept} from "@/models/system/dept-model.ts";

export interface IPageable {
    pageNum: number
    pageSize: number
    sort?:string
}

export interface ISortable {
    sorts: string[]
}

export enum Gender {
    MALE = "0",
    FEMALE = "1",
    UNKNOWN ="2"
}
export type User = {
    userId?: number,
    deptId?:number,
    dept?:Dept,
    userName?: string,
    password?: string,
    userType?:string,
    email?:string,
    tel?:string,
    gender?:Gender,
    nickName?: string,
    disabled?: boolean,
    loginIp?:string,
    loginDate?: string,
    createdAt?: string,
    updatedAt?: string,
    roles?: Role[],
    roleIds: number[],
    posIds:number[],
    resList?: Res[],
    resTree?:Res[],
    permissions?: string[]
    remark?: string,
}

export  type UserQueryForm = IPageable & {
    userName?: string | null
    enabled?: boolean | null
    startAt?: number | null
    endAt?: number | null
    sort?:string|null
}


export type AreaItem = {
    value: string
    label: string
    children?: AreaItem[]
    disabled?: boolean
}


export type LoginForm = {
    username: string
    password: string
}