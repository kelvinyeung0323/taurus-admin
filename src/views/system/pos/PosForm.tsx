import {Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Select, Space, Spin} from "antd";


import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as posService from "@/service/system/pos-service.ts"
import {Pos} from "@/models/system/pos-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";

const {Option} = Select;

export interface PosFormProps {
    posId?: number | null
    open: boolean
    onFinished?: () => void
    onCancel?: () => void
}




const PosForm = ({open, posId, onFinished, onCancel}: PosFormProps) => {


    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [title, setTitle] = useState("添加岗位")
    const [isEdit, setIsEdit] = useState(false)


    const {dict} = useDictContext();
    const defaultPosStatus = dict.get("sys_normal_disable")?.find(v => v.isDefault).itemValue
    const loadPos = () => {
        if (posId) {
            setLoading(true)
            posService.getPos(posId).then(resp => {
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
            console.log("form:", values)
            if (!isEdit) {
                setLoading(true)
                posService.createPos(values).then(() => {
                    message.info("添加岗位成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setLoading(true)
                values.userId = posId
                posService.updatePos(values).then(() => {
                    message.info("修改岗位成功")
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
        if (posId) {
            setIsEdit(true)
            setTitle("修改岗位");
            loadPos();
        } else {
            form.resetFields()
            setIsEdit(false)
            setTitle("添加岗位");
        }
    }, [posId, open])


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
                    <Form<Pos>
                        form={form}
                        name="posForm"
                        labelCol={{span: 6}}
                        wrapperCol={{span: 24}}
                        initialValues={{ status: defaultPosStatus,posSort:1}}>
                        <Row gutter={16}>
                            <Form.Item
                                hidden={true}
                                name="posId"
                                label="ID"
                                rules={[{required: false, message: 'ID'}]}
                            >
                                <Input placeholder="ID"/>
                            </Form.Item>
                            <Col span={12}>
                                <Form.Item
                                    name="posCode"
                                    label="岗位编码"
                                    rules={[{required: true, message: '岗位编码'}]}
                                >
                                    <Input placeholder="岗位编码"/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="posName"
                                    label="岗位名称"
                                    rules={[{required: true, message: '岗位名称'}]}
                                >
                                    <Input placeholder="岗位名称"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="posSort"
                                    label="显示顺序"
                                    rules={[{required: true, message: '显示顺序'}]}
                                >
                                   <InputNumber min={1} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label="状态"
                                    rules={[{required: true, message: '状态'}]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                    >
                                        {dict.get("sys_normal_disable")?.map(d => <Radio value={d.itemValue}
                                                                                        key={d.itemId}>{d.itemLabel}</Radio>)}
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
                                    <Input.TextArea row={3}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Drawer>
        </>
    )
}

export default PosForm