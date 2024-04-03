
import request, {Result} from "@/common/http.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";
import {toUrlParams} from "@/common/utils.ts";
import {User, UserQueryForm} from "@/models/system/sys-model.ts";


export function query(form: UserQueryForm):Promise<Result<User[]>>{
    return request.get(`${SVC_PREFIX}/system/user/role?${toUrlParams(form as never)}`)
}
export function queryUserNotBelong2Role(form: UserQueryForm):Promise<Result<User[]>>{
    return request.get(`${SVC_PREFIX}/system/user/role/not-belong?${toUrlParams(form as never)}`)
}
export function authorize(userRoles:{roleId:string,userId:string}[]):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/system/user/role`,userRoles)
}

export function revoke(userRoles:{roleId:string,userId:string}[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/system/user/role`,{data:userRoles})
}