import request, {Result} from "@/common/http.ts";
import {SVC_PREFIX} from "@/service/contraints.ts";
import {User} from "@/models/system/sys-model.ts";

export  function getProfile():Promise<Result<User>>{
    return request.get(`${SVC_PREFIX}/system/profile`)
}
export  function changePwd(oldPassword:string,newPassword:string):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/system/profile/password`,{"oldPwd":oldPassword,"newPwd":newPassword})
}

export  function updateProfile(user:User):Promise<Result<never>>{
    return request.put(`${SVC_PREFIX}/system/profile`,user)
}