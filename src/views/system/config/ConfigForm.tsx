import {Button, Col, Drawer, Form, Input, message, Radio, Row, Space, Spin} from "antd";


import { useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as configService from "@/service/system/config-service.ts"
import {Config} from "@/models/system/config-model.ts";



export interface ConfigFormProps {
    configId?: number | null
    open: boolean
    onFinished?: () => void
    onCancel?: () => void
}


const ConfigForm = ({open, configId, onFinished, onCancel}: ConfigFormProps) => {


    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [title, setTitle] = useState("添加参数")
    const [isEdit, setIsEdit] = useState(false)


    const loadConfig = () => {
        if (configId) {
            setLoading(true)
            configService.getConfig(configId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    // setFormData(resp.data);
                    form.setFieldsValue(resp.data)
                }
            }).finally(() => setLoading(false))
        }

    }
    const onSaveRes = () => {

        form.validateFields().then((values) => {
            if (!isEdit) {
                setLoading(true)
                configService.createConfig(values).then(() => {
                    message.info("添加参数成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setLoading(true)
                values.userId = configId
                configService.updateConfig(values).then(() => {
                    message.info("修改参数成功")
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
        if (configId) {
            setIsEdit(true)
            setTitle("修改参数");
            loadConfig();
        } else {
            form.resetFields()
            setIsEdit(false)
            setTitle("添加参数");
        }
    }, [configId,open])


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
                        <Button onClick={onSaveRes} type="primary" className="btn-blue">
                            提交
                        </Button>
                    </Space>
                }
            >

                <Spin spinning={loading}>
                    <Form<Config>
                        form={form}
                        name="configForm"
                        labelCol={{span: 6}}
                        wrapperCol={{span: 24}}
                        initialValues={{isBuiltIn:false}}>
                        <Row  gutter={16}>
                            <Form.Item
                                hidden={true}
                                name="configId"
                                label="参数ID"
                                rules={[{required: false, message: '参数ID'}]}
                            >
                                <Input  placeholder="参数ID"/>
                            </Form.Item>
                            <Col span={12}>
                                <Form.Item
                                    name="configName"
                                    label="参数名称"
                                    rules={[{required: true, message: '参数名称'}]}
                                >
                                    <Input placeholder="字典名称"/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="configKey"
                                    label="参数键名"
                                    rules={[{required: true, message: '参数键名'}]}
                                >
                                    <Input placeholder={"字典编码"}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{span: 3}}
                                    name="configValue"
                                    label="参数键值"
                                    rules={[{required: true, message: '参数键值'}]}
                                >
                                    <Input.TextArea rows={4}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="isBuiltIn"
                                    label="系统内置"
                                    rules={[{required: true, message: '状态'}]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                    >
                                        <Radio value={true}>是</Radio>
                                        <Radio value={false}>否</Radio>
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

export default ConfigForm