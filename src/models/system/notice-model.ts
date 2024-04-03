import {IPageable} from "@/models/system/sys-model.ts";


export type Notice = {
    noticeId:number
    noticeTitle:string
    noticeType:string
    noticeContent:string
    status:string
    createdBy:string
    createdAt:string
    updatedBy:string
    updatedAt:string
    remark:string
}

export type NoticeQuery = IPageable &{
    noticeTitle?:string
    noticeType?:string
    createdBy?:string;
}