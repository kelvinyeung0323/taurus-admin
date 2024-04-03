import {ReactNode} from "react";
import {useAuthContext} from "@/store/auth-context.tsx";


interface SecureProp{
    perms:string
    children:ReactNode
}
const Secure = ({perms,children}:SecureProp)=>{
    const {permissions}= useAuthContext()

    if(permissions.includes(perms)){
        return (
            <>
                {children}
            </>
        )
    }else{
        return (
            <>
            </>
        )
    }


}

export default Secure