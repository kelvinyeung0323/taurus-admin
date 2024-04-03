import {Button, Form, Input, message, Space} from "antd";
import * as profileService from "@/service/system/profile-service.ts"


const changePasswordCard = ()=>{

    const onChangePwd=(form:{oldPwd:string,newPwd:string})=>{

        profileService.changePwd(form.oldPwd,form.newPwd).then(()=>{
            message.info("修改密码成功，重新登录，新密码将会生效！")
        })
    }

    const onCloseProfile=()=>{
        history.back()
    }
    return (
        <Form
            onFinish={onChangePwd}
            labelCol={{span:4}}
            wrapperCol={{span:10}}
        >
            <Form.Item
                label="旧密码"
                name="oldPwd"
                rules={[{required: true}]}
            >
                <Input.Password/>
            </Form.Item>
            <Form.Item
                label="新密码"
                name="newPwd"
                rules={[{required: true},]}
            >
                <Input.Password/>
            </Form.Item>
            <Form.Item
                label="确认密码"
                name="confirmPwd"
                dependencies={['newPwd']}
                rules={[{required: true},({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('newPwd') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('密码不一致'));
                    },
                })]}
            >

                <Input.Password/>
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">保存</Button> <Button type="primary" danger onClick={onCloseProfile}>关闭</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}

export default changePasswordCard