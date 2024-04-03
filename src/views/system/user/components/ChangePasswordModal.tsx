import {Input, message, Spin,Modal} from "antd";
import {useState} from "react";

import * as userService from "@/service/system/user-service.ts"


interface Props {
    userId:number;
    userName:number;
    open:boolean
    onFinish:()=>void
}
const ChangePasswordModal =({userId,userName,open,onFinish}:Props)=>{
    const [value,setValue] = useState("")
    const [loading,setLoading] = useState(false)

    const handleOk =()=>{
        setLoading(true)
        userService.changePassword(userId,value).then(()=>{
            message.info("修改密码成功")
            onFinish()
            setValue("")

        }).finally(()=>setLoading(false));
    }

    const handleCancel=()=>{
        setValue("")
        onFinish()
    }

    return (
        <Modal title="修改密码" open={open} onOk={handleOk} onCancel={handleCancel}>
            <Spin spinning={loading}>
            <p>请输入用户[{userName}]的新密码</p>
            <Input.Password value={value} onChange={e=>setValue(e.target.value)} />
            </Spin>
        </Modal>
    )
}
export default ChangePasswordModal