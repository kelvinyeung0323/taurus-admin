
import request, {Result} from "@/common/http.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";

import {toUrlParams} from "@/common/utils.ts";
import {Config,ConfigQueryForm} from "@/models/system/config-model.ts";

export  function queryConfig(form:ConfigQueryForm):Promise<Result<Config[]>>{
    return request.get(`${SVC_PREFIX}/system/config?`+toUrlParams(form as never))
}

export function getConfig(configId:number):Promise<Result<Config>>{
    return request.get(`${SVC_PREFIX}/system/config/${configId}`)
}


export function createConfig(config:Config):Promise<Result<Config>>{
    return request.post(`${SVC_PREFIX}/system/config`,config)
}

export function updateConfig(config:Config):Promise<Result<Config>>{
    return request.put(`${SVC_PREFIX}/system/config`,config)
}

export function  deleteConfig(configIds:number[]):Promise<Result<Config[]>>{
    return request.delete(`${SVC_PREFIX}/system/config?configIds=`+configIds.join(","))
}




