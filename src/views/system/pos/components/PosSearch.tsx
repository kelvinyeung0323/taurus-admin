import {Button, DatePicker, Form, Input, Select} from "antd";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import  {FormEventHandler} from "react";

import {PosQuery} from "@/models/system/pos-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";

const {Option}=Select
interface Props {
    onFinish: (form:PosQuery)=>void;
    onReset: FormEventHandler<never> | undefined;
}

const PosSearch =({onFinish,onReset}:Props)=>{

    const {dict} = useDictContext()

    return (
        <>
            <Form layout="inline"
                  onFinish={onFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="岗位编码"
                    name="posCode">
                    <Input placeholder="岗位编码" allowClear/>
                </Form.Item>
                <Form.Item
                    label="岗位名称"
                    name="posName">
                    <Input placeholder="岗位名称" allowClear/>
                </Form.Item>
                <Form.Item
                    label="岗位状态"
                    style={{width: 130}}
                    name="status">
                    <Select allowClear>
                        {dict.get("sys_normal_disable")?.map(d=> <Option value={d.itemValue} key={d.itemId}>{d.itemLabel}</Option>)}
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
export default  PosSearch;