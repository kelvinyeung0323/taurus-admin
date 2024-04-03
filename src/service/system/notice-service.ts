
import request, {Result} from "@/common/http.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";

import {NoticeQuery, Notice} from "@/models/system/notice-model.ts";
import {toUrlParams} from "@/common/utils.ts";

export  function queryNoticeList(form:NoticeQuery):Promise<Result<Notice[]>>{
    return request.get(`${SVC_PREFIX}/system/notice?`+toUrlParams(form as never))
}

export function getNotice(noticeId:number):Promise<Result<Notice>>{
    return request.get(`${SVC_PREFIX}/system/notice/${noticeId}`)
}


export function createNotice(notice:Notice):Promise<Result<Notice>>{
    return request.post(`${SVC_PREFIX}/system/notice`,notice)
}

export function updateNotice(notice:Notice):Promise<Result<Notice>>{
    return request.put(`${SVC_PREFIX}/system/notice`,notice)
}

export function  deleteNotice(noticeIds:number[]):Promise<Result<Notice[]>>{
    return request.delete(`${SVC_PREFIX}/system/notice?noticeIds=`+noticeIds.join(","))
}

