import {Button, DatePicker, Form, Input, Select} from "antd";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import  {FormEventHandler} from "react";
import dayjs from "dayjs";
import {ConfigQueryForm} from "@/models/system/config-model.ts";

const {Option}=Select
interface Props {
    onFinish: (form:ConfigQueryForm)=>void;
    onReset: FormEventHandler<never> | undefined;
}

const ConfigSearch =({onFinish,onReset}:Props)=>{
    const handleFinish=({configName,configKey,isBuildIn, dateRange}:{ configName: string,configKey: string, isBuildIn: boolean, dateRange: number[] })=>{
        const startAt = dateRange?.length > 1 ? dayjs(dateRange[0]).startOf("date").format("YYYY-MM-DD HH:mm:ss") : undefined;
        const endAt = dateRange?.length > 1 ? dayjs(dateRange[1]).endOf("date").format("YYYY-MM-DD HH:mm:ss") : undefined;
        onFinish({configName,configKey,isBuildIn,startAt,endAt})
    }

    return (
        <>
            <Form layout="inline"
                  onFinish={handleFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="参数名称"
                    name="configName">
                    <Input placeholder="参数名称" allowClear/>
                </Form.Item>
                <Form.Item
                    label="参数键名"
                    name="configKey">
                    <Input placeholder="参数键名" allowClear/>
                </Form.Item>
                <Form.Item
                    label="系统内置"
                    style={{width: 130}}
                    name="disabled">
                    <Select allowClear>
                        {/*<Option value={undefined} key={1}>所有</Option>*/}
                        <Option value={true} key={1}>是</Option>
                        <Option value={false} key={2}>否</Option>
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
export default  ConfigSearch;