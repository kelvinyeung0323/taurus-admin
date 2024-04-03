import {Button, DatePicker, Form, Input, Select} from "antd";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import  {FormEventHandler} from "react";
import dayjs from "dayjs";
import {RoleQueryForm} from "@/models/system/role-model.ts";

const {Option}=Select
interface Props {
    onFinish: (form:RoleQueryForm)=>void;
    onReset: FormEventHandler<never> | undefined;
}

const UserSearch =({onFinish,onReset}:Props)=>{
    const handleFinish=({userName,nickName,tel}:{ userName: string,nickName: string, tel: string})=>{

        onFinish({userName,nickName,tel})
    }

    return (
        <>
            <Form layout="inline"
                  onFinish={handleFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="登录名称"
                    name="userName">
                    <Input allowClear/>
                </Form.Item>
                <Form.Item
                    label="用户名称"
                    name="nickName">
                    <Input  allowClear/>
                </Form.Item>
                <Form.Item
                    label="手机"
                    name="tel">
                    <Input allowClear/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" className="btn-blue" htmlType="submit" icon={<SearchOutlined/>}>查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="reset" className="btn" icon={<RedoOutlined/>}>重置</Button>
                </Form.Item>
            </Form>
        </>
    )
}
export default  UserSearch;