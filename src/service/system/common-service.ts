
import request, {Result} from "@/common/http.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";
import {Dept} from "@/models/system/dept-model.ts";

export  function getDeptTree():Promise<Result<Dept[]>>{
    return request.get(`${SVC_PREFIX}/common/dept/tree`)
}

