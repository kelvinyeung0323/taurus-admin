import {Button, Form, Input, Select} from "antd";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import  {FormEventHandler} from "react";

import {DeptQuery} from "@/models/system/dept-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";

const {Option}=Select
interface Props {
    onFinish: (form:DeptQuery)=>void;
    onReset: FormEventHandler<never> | undefined;
}

const DeptSearch =({onFinish,onReset}:Props)=>{

    const {dict} = useDictContext()

    return (
        <>
            <Form layout="inline"
                  onFinish={onFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="部门名称"
                    name="deptName">
                    <Input allowClear/>
                </Form.Item>

                <Form.Item
                    label="部门状态"
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
export default  DeptSearch;