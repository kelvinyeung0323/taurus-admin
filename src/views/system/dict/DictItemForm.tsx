import {
    Button,
    Col,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Radio,
    Row,
    Select,
    Space,
    Spin,
    Tag,
    Tooltip
} from "antd";

import {InfoCircleOutlined} from "@ant-design/icons";

import  { useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as dictService from "@/service/system/dict-service.ts"
import {Dict} from "@/models/system/dict-model.ts";



export interface DictItemFormProps {
    itemId?: number | null
    dictId?:number
    open: boolean
    onFinished?: () => void
    onCancel?: () => void
}

const {Option} = Select;


const DictItemForm = ({open, itemId,dictId, onFinished, onCancel}: DictItemFormProps) => {


    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [title, setTitle] = useState("添加用户")
    const [isEdit, setIsEdit] = useState(false)



    const fetchData = () => {
        if (itemId) {
            setLoading(true)
            dictService.getItem(itemId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    form.setFieldsValue(resp.data)
                }
            }).finally(() => setLoading(false))
        }

    }
    const handleSave = () => {

        form.validateFields().then((values) => {
            if (!isEdit) {
                setLoading(true)
                dictService.createItem(values).then(() => {
                    message.info("添加字典项成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setLoading(true)
                dictService.updateItem(values).then(() => {
                    message.info("修改字典项成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            }
        }).catch(e => {
            console.log("validate error:", e)
        })

    }


    useEffect(() => {
        if (itemId) {
            setIsEdit(true)
            setTitle("修改字典项");
            fetchData();
        } else {
            form.resetFields()
            setIsEdit(false)
            if(dictId){
                form.setFieldValue("dictId",dictId)
            }
            setTitle("添加字典项");
        }
    }, [itemId,open])

    useEffect(() => {
        if(dictId){
            if(dictId){
                form.setFieldValue("dictId",dictId)
            }
        }
    }, [dictId]);

    return (
        <>
            <Drawer
                title={title}
                width={720}
                onClose={onCancel}
                open={open}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button onClick={onCancel} className="btn">取消</Button>
                        <Button onClick={handleSave} type="primary" className="btn-blue">
                            提交
                        </Button>
                    </Space>
                }
            >

                <Spin spinning={loading}>
                    <Form<Dict>
                        form={form}
                        name="userForm"
                        labelCol={{span: 8}}
                        wrapperCol={{span: 24}}
                        initialValues={{disabled:false,isDefault:true,itemSort:1}}>
                        <Row  gutter={16}>
                            <Form.Item
                                hidden={true}
                                name="itemId"
                                label="字典项ID"
                                rules={[{required: false, message: '字典ID'}]}
                            >
                                <Input  placeholder="字典名称"/>
                            </Form.Item>
                            <Form.Item
                                hidden={true}
                                name="dictId"
                                label="字典ID"
                                rules={[{required: false, message: '字典ID'}]}
                            >
                                <Input  placeholder="字典名称"/>
                            </Form.Item>
                            <Col span={12}>
                                <Form.Item
                                    name="itemLabel"
                                    label="字典项标签"
                                    rules={[{required: true, message: '字典项标签'}]}
                                >
                                    <Input placeholder="字典项标签"/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="itemValue"
                                    label="字典项键值"
                                    rules={[{required: true, message: '字典项键值'}]}
                                >
                                    <Input placeholder={"字典项键值"}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="cssClass"
                                    label="样式属性"
                                    rules={[
                                        {
                                            required: false,
                                            message: '',
                                        },
                                    ]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                            <Form.Item
                                name="listClass"
                                label="回显样式"
                                rules={[
                                    {
                                        required: false,
                                        message: '回显样式',
                                    },
                                ]}
                            >
                                <Select
                                    suffixIcon={
                                        <Tooltip title="table表格字典列显示样式属性">
                                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                        </Tooltip>
                                    }
                                >
                                    <Option value="success" key={1}>
                                        <Tag color="success">success</Tag>
                                    </Option>
                                    <Option value="processing" key={2}>
                                        <Tag color="processing">processing</Tag>
                                    </Option>
                                    <Option value="error" key={3}>
                                        <Tag color="error">error</Tag>
                                    </Option>
                                    <Option value="warning" key={4}>
                                        <Tag color="warning">warning</Tag>
                                    </Option>
                                    <Option value="default" key={5}>
                                        <Tag color="default">default</Tag>
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="itemSort"
                                    label="字典排序"
                                    rules={[
                                        {
                                            required: true,
                                            message: '字典排序',
                                        },
                                    ]}
                                >
                                    <InputNumber min={1} />
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="isDefault"
                                    label="系统默认"
                                    rules={[{required: true, message: '系统默认'}]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                    >
                                        <Radio value={true} key={1}>是</Radio>
                                        <Radio value={false} key={2}>否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="disabled"
                                    label="状态"
                                    rules={[{required: true, message: '状态'}]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                    >
                                        <Radio value={false} key={1}>正常</Radio>
                                        <Radio value={true} key={2}>停用</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{span: 3}}
                                    name="remark"
                                    label="备注"
                                    rules={[
                                        {
                                            required: false,
                                            message: '',
                                        },
                                    ]}
                                >
                                    <Input.TextArea rows={4}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Drawer>
        </>
    )
}

export default DictItemForm