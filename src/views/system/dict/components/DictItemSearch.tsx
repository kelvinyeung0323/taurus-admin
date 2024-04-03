import {Button, Form, Input, Select} from "antd";
import {RedoOutlined, SearchOutlined} from "@ant-design/icons";
import {FormEventHandler} from "react";

import {useForm} from "antd/es/form/Form";

const {Option} = Select

interface Props {
    onFinish: (form: QueryForm) => void;
    onReset: FormEventHandler<never> | undefined;
}

export interface QueryForm {
    itemLabel?: string
    disabled?: boolean
}

const DictSearch = ({onFinish, onReset}: Props) => {

    const [form] = useForm()

    return (
        <>
            <Form form={form}
                  layout="inline"
                  onFinish={onFinish}
                  onReset={onReset}
            >
                <Form.Item
                    label="字典项标签"
                    name="itemLabel">
                    <Input placeholder="字典类型" allowClear/>
                </Form.Item>
                <Form.Item
                    label="数据状态"
                    style={{width: 130}}
                    name="disabled">
                    <Select
                        allowClear>
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
export default DictSearch;