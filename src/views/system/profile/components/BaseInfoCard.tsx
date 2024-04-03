import {User} from "@/models/system/sys-model.ts";
import {Button, Form, Input, message, Radio, Space, Spin} from "antd";
import {useDictContext} from "@/store/dict-context.tsx";

import * as profileService from "@/service/system/profile-service.ts"
import {useForm} from "antd/es/form/Form";
import {useEffect, useState} from "react";

interface Props {
    profile:User
    onUpdated:()=>void
}
const BaseInfoCard = ({profile,onUpdated}:Props)=>{

    const {dict} = useDictContext();
    const [form] = useForm();
    const [loading,setLoading] = useState(false);
    const onUpdateProfile=(user:User)=>{
        setLoading(true)
        profileService.updateProfile(user).then(()=>{
            message.info("修改用户信息成功")
            if(onUpdated){
                onUpdated();
            }
        }).finally(()=>setLoading(false))

    }

    const onCloseProfile=()=>{
        history.back()
    }

    useEffect(() => {
        form.setFieldsValue(profile)
    }, [JSON.stringify(profile)]);
    return (
        <Spin spinning={loading}>
        <Form
            onFinish={onUpdateProfile}
            labelCol={{span:4}}
            wrapperCol={{span:10}}
            initialValues={{}}
            form={form}
        >
            <Form.Item
                name="nickName"
                label="用户昵称">
                <Input/>
            </Form.Item>
            <Form.Item
                name="tel"
                label="电话号码">
                <Input/>
            </Form.Item>
            <Form.Item
                name="email"
                label="邮箱">
                <Input/>
            </Form.Item>
            <Form.Item
                name="gender"
                label="姓别">
                <Radio.Group>
                    {dict.get("sys_user_sex")?.map((d)=><Radio value={d.itemValue} key={d.itemId}>{d.itemLabel}</Radio> )}
                </Radio.Group>
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button type="primary" danger onClick={onCloseProfile}>关闭</Button>
                </Space>
            </Form.Item>
        </Form>
        </Spin>
    )
}

export default BaseInfoCard