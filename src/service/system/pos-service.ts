
import request, {Result} from "@/common/http.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";

import {PosQuery, Pos} from "@/models/system/pos-model.ts";
import {toUrlParams} from "@/common/utils.ts";

export  function queryPosList(form:PosQuery):Promise<Result<Pos[]>>{
    return request.get(`${SVC_PREFIX}/system/pos?`+toUrlParams(form as never))
}

export function getPos(posId:number):Promise<Result<Pos>>{
    return request.get(`${SVC_PREFIX}/system/pos/${posId}`)
}


export function createPos(pos:Pos):Promise<Result<Pos>>{
    return request.post(`${SVC_PREFIX}/system/pos`,pos)
}

export function updatePos(pos:Pos):Promise<Result<Pos>>{
    return request.put(`${SVC_PREFIX}/system/pos`,pos)
}

export function  deletePos(posIds:number[]):Promise<Result<Pos[]>>{
    return request.delete(`${SVC_PREFIX}/system/pos?posIds=`+posIds.join(","))
}

