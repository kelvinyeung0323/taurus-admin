import {Form, Input, Modal} from "antd";
import React, {useState} from "react";
import * as userService from "@/service/system/user-service.ts";
import {User} from "@/models/system/sys-model.ts";
import {useForm} from "antd/es/form/Form";


interface Props {
    user:User
    open:boolean
}
const ResetPwdModal = ({user,open}:Props) => {


    const [passwordForm] = useForm()

    const handleChangePasswdCancel = () => {
        setIsPasswdModalOpen(false)
        passwordForm.resetFields()
    }
    const handleChangePasswdOk = () => {
        console.log("value:......")
        passwordForm.validateFields().then((values) => {
            console.log("value:", values)
            userService.changePassword(user?.userId as string, values.password).then(() => {
                setIsPasswdModalOpen(false)
                passwordForm.resetFields()
            })

        })

    }

    return (
        <>
            <Modal title="修改密码" open={open} onOk={handleChangePasswdOk}
                   onCancel={handleChangePasswdCancel}>
                <Form form={passwordForm}>
                    <Form.Item label="新密码" name="password" rules={[{required: true, message: '新密码不能为空'}]}>
                        <Input.Password/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ResetPwdModal;