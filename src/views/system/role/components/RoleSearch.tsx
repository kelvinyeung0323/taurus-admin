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

const RoleSearch =({onFinish,onReset}:Props)=>{
    const handleFinish=({roleName,roleCode,disabled, dateRange}:{ roleName: string,roleCode: string, disabled: boolean, dateRange: number[] })=>{
        const startAt = dateRange?.length > 1 ? dayjs(dateRange[0]).startOf("date").format("YYYY-MM-DD HH:mm:ss") : undefined;
        const endAt = dateRange?.length > 1 ? dayjs(dateRange[1]).endOf("date").format("YYYY-MM-DD HH:mm:ss") : undefined;
        onFinish({roleName,roleCode,disabled,startAt,endAt})
    }

    return (
        <>
            <Form layout="inline"
                  onFinish={handleFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="角色名称"
                    name="roleName">
                    <Input allowClear/>
                </Form.Item>
                <Form.Item
                    label="角色编码"
                    name="roleCode">
                    <Input  allowClear/>
                </Form.Item>
                <Form.Item
                    label="角色状态"
                    style={{width: 180}}
                    name="disabled">
                    <Select allowClear>
                        {/*<Option value={undefined} key={1}>所有</Option>*/}
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
export default  RoleSearch;