import {IPageable} from "@/models/system/sys-model.ts";


export type Config ={
    configId	:number
    configName	:string
    configKey	:string
    configValue:	string
    isBuiltIn	:boolean
    createdBy	:string
    createdAt	:string
    updatedBy	:string
    updatedAt	:string
    remark	:string
}

export type ConfigQueryForm = IPageable &{
    configName	:string
    configKey	:string
    isBuiltIn	:boolean
    startAt:string
    endAt:string
}