import {IPageable, ISortable} from "@/models/system/sys-model.ts";

export enum ResType {
    Catalog = "C",
    Menu = "M",
    Button = "F",
}












export type Res = {
    resId: number,
    parentId: number,
    resType?: ResType,
    icon?: string,
    resName: string,
    sortNum?: number | null,
    path?: string,
    query?: string,
    disabled?: boolean,
    visible?: boolean,
    component?: string,
    authCode?: string,
    isFrame: boolean,
    isCache: boolean,
    createdAt?: string,
    updatedAt?: string,
    remark?:string,
    children?: Res[]
}

export type ResQuery = ISortable & {
    resType: string | null,
    resName: string | null,
}
export  type RoleUserQuery = IPageable & {
    isBelongToRole: boolean //IsBelongToRole标识，为true表示查询属于角色的用户，false 表示查询不属于角色的用户
    roleId?: string
    userName?: string | null
    enabled?: boolean | null
    startAt?: number
    endAt?: number
}
