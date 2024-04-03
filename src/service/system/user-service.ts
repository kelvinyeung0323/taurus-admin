import { User, UserQueryForm} from "@/models/system/sys-model.ts";

import request, {Result} from "@/common/http.ts";
import {toUrlParams} from "@/common/utils.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";



export  function createUser(form :User):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/system/user`,form)
}

export  function updateUser(form :User):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/system/user`,form)
}

export function queryUser(form:UserQueryForm):Promise<Result<User[]>>{
    return request.get(`${SVC_PREFIX}/system/user?${toUrlParams(form as never)}`)
}

export function getUser(userId:number):Promise<Result<User>>{
    return request.get(`${SVC_PREFIX}/system/user/${userId}`)
}

export function deleteUsers(userIds:number[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/system/user?userIds=`+userIds?.join(","))
}
export function switchUserStatus(userId:number,checked:boolean):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/system/user/status`, {userId:userId,disabled:!checked})
}

export function changePassword(userId:number,password:string):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/system/user/password`, {userId:userId,password:password})
}
