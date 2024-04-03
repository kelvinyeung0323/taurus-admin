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
    dictName?:string
    dictCode?:string
    disabled?:boolean
    startAt?:string
    endAt?:string
}
const DictSearch =({onFinish,onReset}:Props)=>{

    const handleFinish=({dictName,dictCode,disabled, dateRange}:{ dictName: string,dictCode: string, disabled: boolean, dateRange: number[] })=>{
        const startAt = dateRange?.length > 1 ? dayjs(dateRange[0]).startOf("date").format("YYYY-MM-DD HH:mm:ss") : undefined;
        const endAt = dateRange?.length > 1 ? dayjs(dateRange[1]).endOf("date").format("YYYY-MM-DD HH:mm:ss") : undefined;
        onFinish({dictName,dictCode,disabled,startAt,endAt})
    }

    return (
        <>
            <Form layout="inline"
                  onFinish={handleFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="字典名称"
                    name="dictName">
                    <Input placeholder="字典名称" allowClear/>
                </Form.Item>
                <Form.Item
                    label="字典编码"
                    name="dictCode">
                    <Input placeholder="字典编码" allowClear/>
                </Form.Item>
                <Form.Item
                    label="字典状态"
                    style={{width: 130}}
                    name="disabled">
                    <Select>
                        <Option value={undefined} key={1}>所有</Option>
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
export default  DictSearch;