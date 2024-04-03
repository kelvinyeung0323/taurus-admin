import {LoginForm, User} from "@/models/system/sys-model.ts";
import request, {Result} from "@/common/http.ts";
import {AUTH_PREFIX, SVC_PREFIX} from "@/service/contraints.ts";





export  function login(form :LoginForm):Promise<Result<string>>{
    return request.post(`${AUTH_PREFIX}/login`,form)
}


export  function currentUser():Promise<Result<User>>{
    return request.get(`${SVC_PREFIX}/login-user`)
}
