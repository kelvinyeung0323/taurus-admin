import {IPageable} from "@/models/system/sys-model.ts";

export type Role = {
    roleId:bigint
    roleName:string
    roleCode:string
    sortNum:number
    dataScope:string
    resCheckStrictly:boolean
    deptCheckStrictly:boolean
    disabled:boolean
    deleted:boolean
    created_by:string
    created_at:string
    updated_by:string
    updated_at:string
    remark:string
    resIds:number[]
}

export type RoleQuery = IPageable & {
    roleName?: string | null
    authCode?: string | null
    disabled?: boolean | null
    startAt?: number | null
    endAt?: number | null
}

