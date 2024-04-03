import {Button, DatePicker, Form, Input, Select} from "antd";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import  {FormEventHandler} from "react";

import {NoticeQuery} from "@/models/system/notice-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";

const {Option}=Select
interface Props {
    onFinish: (form:NoticeQuery)=>void;
    onReset: FormEventHandler<never> | undefined;
}

const NoticeSearch =({onFinish,onReset}:Props)=>{

    const {dict} = useDictContext()

    return (
        <>
            <Form layout="inline"
                  onFinish={onFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="公告标题"
                    name="noticeTitle">
                    <Input placeholder="公告标题" allowClear/>
                </Form.Item>
                <Form.Item
                    label="操作人员"
                    name="createdBy">
                    <Input placeholder="操作人员" allowClear/>
                </Form.Item>
                <Form.Item
                    label="公告类型"
                    style={{width: 130}}
                    name="noticeType">
                    <Select allowClear>
                        {dict.get("sys_notice_type")?.map(d=> <Option value={d.itemValue} key={d.itemId}>{d.itemLabel}</Option>)}
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
export default  NoticeSearch;