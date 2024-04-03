import request, {Result} from "@/common/http.ts";
import {Role, RoleQuery, RoleUserQuery, User} from "@/models/system/role-model.ts";
import {toUrlParams} from "@/common/utils.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";


export function queryRole(form: RoleQuery): Promise<Result<Role[]>> {
    return request.get(`${SVC_PREFIX}/system/role?${toUrlParams(form as never)}`)
}

export function getRole(roleId: string): Promise<Result<Role>> {
    return request.get(`${SVC_PREFIX}/system/role/${roleId}`)
}

export  function createRole(form :Role):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/system/role`,form)
}


export  function updateRole(form :Role):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/system/role`,form)
}

export  function deleteRole(roleIds :string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/system/role?roleIds=`+roleIds?.join(","))
}
export function switchRoleStatus(roleId:string,checked:boolean):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/system/role/status`, {roleId:roleId,disabled:checked})
}

