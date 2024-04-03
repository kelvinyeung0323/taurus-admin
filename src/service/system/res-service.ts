import {Res, ResQueryForm} from "@/models/system/sys-model.ts";
import request, {Result} from "@/common/http.ts";
import {toUrlParams} from "@/common/utils.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";
import {Pos, PosQuery} from "@/models/system/pos-model.ts";


export  function queryResList(form:PosQuery):Promise<Result<Pos[]>>{
    return request.get(`${SVC_PREFIX}/system/res?`+toUrlParams(form as never))
}
export  function createRes(form :Res):Promise<Result<never>>{
    return request.post(`${SVC_PREFIX}/system/res`,form)
}

export  function updateRes(form :Res):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/system/res`,form)
}
export  function getRes(resId :string):Promise<Result<never>>{
    return request.get(`${SVC_PREFIX}/system/res/${resId}`)
}

export  function deleteRes(resIds :string[]):Promise<Result<never>>{
    return request.delete(`${SVC_PREFIX}/system/res?resId=${resIds?.join(",")}`)
}

export  function queryRes(form :ResQueryForm):Promise<Result<Res[]>>{
    return request.get(`${SVC_PREFIX}/system/res?${toUrlParams(form as never)}`)
}