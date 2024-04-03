import {Button, Form, Input, Select} from "antd";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import  {FormEventHandler} from "react";

import {ResQuery} from "@/models/system/res-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";

const {Option}=Select
interface Props {
    onFinish: (form:ResQuery)=>void;
    onReset: FormEventHandler<never> | undefined;
}

const ResSearch =({onFinish,onReset}:Props)=>{

    const {dict} = useDictContext()

    return (
        <>
            <Form layout="inline"
                  onFinish={onFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="菜单名称"
                    name="resName">
                    <Input allowClear/>
                </Form.Item>

                <Form.Item
                    label="菜单状态"
                    style={{width: 130}}
                    name="disabled">
                    <Select allowClear>
                       <Option value={false} key={1}>正常</Option>
                       <Option value={true} key={2}>停用</Option>
                    </Select>
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
export default  ResSearch;