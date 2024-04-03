
import request, {Result} from "@/common/http.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";

import {DeptQuery, Dept} from "@/models/system/dept-model.ts";
import {toUrlParams} from "@/common/utils.ts";

export  function queryDeptList(form:DeptQuery):Promise<Result<Dept[]>>{
    return request.get(`${SVC_PREFIX}/system/dept?`+toUrlParams(form as never))
}

export function getDept(deptId:number):Promise<Result<Dept>>{
    return request.get(`${SVC_PREFIX}/system/dept/${deptId}`)
}


export function createDept(dept:Dept):Promise<Result<Dept>>{
    return request.post(`${SVC_PREFIX}/system/dept`,dept)
}

export function updateDept(dept:Dept):Promise<Result<Dept>>{
    return request.put(`${SVC_PREFIX}/system/dept`,dept)
}

export function  deleteDept(deptIds:number[]):Promise<Result<Dept[]>>{
    return request.delete(`${SVC_PREFIX}/system/dept?deptIds=`+deptIds.join(","))
}

