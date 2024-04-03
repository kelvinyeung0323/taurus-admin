import {Button, DatePicker, Form, Input, Select} from "antd";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import  {FormEventHandler} from "react";
import dayjs from "dayjs";

const {Option}=Select
interface Props {
    onFinish: (form:QueryForm)=>void;
    onReset: FormEventHandler<never> | undefined;
}
interface QueryForm {
    userName?:string
    disabled?:boolean
    startAt?:string
    endAt?:string
}
const UserSearch =({onFinish,onReset}:Props)=>{

    const handleFinish=({userName,disabled,dateRange}:{ userName: string, disabled: boolean, dateRange: number[] })=>{
       const startAt = dateRange?.length > 1 ? dayjs(dateRange[0]).startOf("date").format("YYYY-MM-DD HH:mm:ss") : undefined;
       const endAt = dateRange?.length > 1 ? dayjs(dateRange[1]).endOf("date").format("YYYY-MM-DD HH:mm:ss") : undefined;
       onFinish({userName,disabled,startAt,endAt})
    }

    return (
        <>
            <Form layout="inline"
                  onFinish={handleFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="用户名称"
                    name="userName">
                    <Input placeholder="用户名称" allowClear/>
                </Form.Item>
                <Form.Item
                    label="状态"
                    style={{width: 110}}
                    name="disabled">
                    <Select>
                        <Option value={false} key={1}>正常</Option>
                        <Option value={true} key={2}>停用</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="创建时间"
                    name="dateRange">
                    <DatePicker.RangePicker />
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