import {Button, Col, Drawer, Form, Input, message, Radio, Row, Space, Spin} from "antd";


import { useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as dictService from "@/service/system/dict-service.ts"
import {Dict} from "@/models/system/dict-model.ts";



export interface DictFormProps {
    dictId?: number | null
    open: boolean
    onFinished?: () => void
    onCancel?: () => void
}


const DictForm = ({open, dictId, onFinished, onCancel}: DictFormProps) => {


    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [title, setTitle] = useState("添加用户")
    const [isEdit, setIsEdit] = useState(false)


    const loadDict = () => {
        if (dictId) {
            setLoading(true)
            dictService.getDict(dictId).then(resp => {
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
                dictService.createDict(values).then(() => {
                    message.info("添加字典成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setLoading(true)
                values.userId = dictId
                dictService.updateDict(values).then(() => {
                    message.info("修改字典成功")
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
        if (dictId) {
            setIsEdit(true)
            setTitle("修改字典");
            loadDict();
        } else {
            form.resetFields()
            setIsEdit(false)
            setTitle("添加字典");
        }
    }, [dictId,open])


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
                    <Form<Dict>
                        form={form}
                        name="userForm"
                        labelCol={{span: 6}}
                        wrapperCol={{span: 24}}
                        initialValues={{disabled:false}}>
                        <Row  gutter={16}>
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
                                    name="dictName"
                                    label="字典名称"
                                    rules={[{required: true, message: '字典名称'}]}
                                >
                                    <Input placeholder="字典名称"/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="dictCode"
                                    label="字典编码"
                                    rules={[{required: true, message: '字典编码'}]}
                                >
                                    <Input placeholder={"字典编码"}/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="disabled"
                                    label="状态"
                                    rules={[{required: true, message: '状态'}]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                    >
                                        <Radio value={false}>正常</Radio>
                                        <Radio value={true}>停用</Radio>
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

export default DictForm