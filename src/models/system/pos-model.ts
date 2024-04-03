import {IPageable} from "@/models/system/sys-model.ts";


export type Pos = {
    posId:Long
    posCode:string
    posName:string
    posSort:number
    status:string
    createdBy:string
    createdAt:string
    updatedBy:string
    updatedAt:string
    remark:string

}

export type PosQuery = IPageable & {
    posCode:string
    posName:string
    status:string
}