import {IPageable} from "@/models/system/sys-model.ts";


export type Dict = {
    dictId:number
    dictName:string
    dictCode:string
    disabled:boolean
    createdBy:string
    createdAt:string
    updatedBy:string
    updatedAt:string
    remark:string
}

export type DictItem={
    itemId:number
    itemSort:number
    itemLabel:string
    itemValue:string
    dictId:string
    dictCode:string
    cssClass:string
    listClass:string
    isDefault:boolean
    disabled:boolean
    createdBy:string
    createdAt:string
    updatedBy:string
    updatedAt:string
    remark:string

}

export type DictQueryForm =IPageable&{
    dictName?:string
    dictCode?:string
    disabled?:boolean
    startAt?:string
    endAt?:string
}

export type DictItemQueryForm = IPageable&{
    dictId?:number
    dictLabel?:string
    disabled?:boolean
}

