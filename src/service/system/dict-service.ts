
import request, {Result} from "@/common/http.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";

import {DictQueryForm, Dict, DictItem, DictItemQueryForm} from "@/models/system/dict-model.ts";
import {toUrlParams} from "@/common/utils.ts";

export  function queryDictList(form:DictQueryForm):Promise<Result<Dict[]>>{
    return request.get(`${SVC_PREFIX}/system/dict?`+toUrlParams(form as never))
}

export function getDict(dictId:number):Promise<Result<Dict>>{
    return request.get(`${SVC_PREFIX}/system/dict/${dictId}`)
}


export function createDict(dict:Dict):Promise<Result<Dict>>{
    return request.post(`${SVC_PREFIX}/system/dict`,dict)
}

export function updateDict(dict:Dict):Promise<Result<Dict>>{
    return request.put(`${SVC_PREFIX}/system/dict`,dict)
}

export function  deleteDict(dictIds:number[]):Promise<Result<Dict[]>>{
    return request.delete(`${SVC_PREFIX}/system/dict?dictIds=`+dictIds.join(","))
}




//===================item=================================

export  function querytems(form:DictItemQueryForm):Promise<Result<DictItem[]>>{
    return request.get(`${SVC_PREFIX}/system/dict-item?`+toUrlParams(form as never))
}

export function getItem(itemId:number):Promise<Result<DictItem>>{
    return request.get(`${SVC_PREFIX}/system/dict-item/${itemId}`)
}


export function createItem(dict:Dict):Promise<Result<DictItem>>{
    return request.post(`${SVC_PREFIX}/system/dict-item`,dict)
}

export function updateItem(dict:Dict):Promise<Result<DictItem>>{
    return request.put(`${SVC_PREFIX}/system/dict-item`,dict)
}

export function  deleteItem(dictIds:number[]):Promise<Result<DictItem[]>>{
    return request.delete(`${SVC_PREFIX}/system/dict-item?itemIds=`+dictIds.join(","))
}
