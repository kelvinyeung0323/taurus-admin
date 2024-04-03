import {Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Select, Space, Spin} from "antd";


import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as deptService from "@/service/system/dept-service.ts"
import {Dept} from "@/models/system/dept-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";
import DeptSelector from "@/views/system/user/components/DeptSelector.tsx";

const {Option} = Select;

export interface DeptFormProps {
    parentId:number|null
    deptId?: number | null
    open: boolean
    onFinished?: () => void
    onCancel?: () => void
}




const DeptForm = ({open, deptId, parentId, onFinished, onCancel}: DeptFormProps) => {


    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [title, setTitle] = useState("添加部门")
    const [isEdit, setIsEdit] = useState(false)


    const {dict} = useDictContext();
    const defaultDeptStatus = dict.get("sys_normal_disable")?.find(v => v.isDefault).itemValue
    console.log("defaultDeptStatus",defaultDeptStatus);
    const loadDept = () => {
        if (deptId) {
            setLoading(true)
            deptService.getDept(deptId).then(resp => {
                console.log("resp:", resp.data)
                if (resp.data) {
                    // setFormData(resp.data);
                    form.setFieldsValue(resp.data)
                }
            }).finally(() => setLoading(false))
        }

    }
    const onSaveDept = () => {


        form.validateFields().then((values) => {
            console.log("form:", values)
            if (!isEdit) {
                setLoading(true)
                deptService.createDept(values).then(() => {
                    message.info("添加部门成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setLoading(true)
                values.userId = deptId
                deptService.updateDept(values).then(() => {
                    message.info("修改部门成功")
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
        if (deptId) {
            setIsEdit(true)
            setTitle("修改部门");
            loadDept();
        } else {
            form.resetFields()
            setIsEdit(false)
            setTitle("添加部门");
            console.log("parentId",parentId)
            form.setFieldValue("parentId",parentId)
        }
    }, [deptId, open])


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
                        <Button onClick={onSaveDept} type="primary" className="btn-blue">
                            提交
                        </Button>
                    </Space>
                }
            >

                <Spin spinning={loading}>
                    <Form<Dept>
                        form={form}
                        name="deptForm"
                        labelCol={{span: 4}}
                        wrapperCol={{span: 24}}
                        initialValues={{ status: defaultDeptStatus,orderNum:1}}>
                        <Row gutter={16}>
                            <Form.Item
                                hidden={true}
                                name="deptId"
                                label="ID"
                                rules={[{required: false, message: 'ID'}]}
                            >
                                <Input placeholder="ID"/>
                            </Form.Item>
                            <Col span={24}>
                                <Form.Item
                                    name="parentId"
                                    label="上级部门"
                                    rules={[{required: true, message: '上级部门'}]}
                                >
                                    <DeptSelector/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="deptName"
                                    label="部门名称"
                                    rules={[{required: true, message: '部门名称'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="orderNum"
                                    label="显示顺序"
                                    rules={[{required: true, message: '显示顺序'}]}
                                >
                                   <InputNumber />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="manager"
                                    label="负责人"
                                    rules={[{required: false, message: '负责人'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="tel"
                                    label="联系电话"
                                    rules={[{required: false, message: '联系电话'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="email"
                                    label="邮箱"
                                    rules={[{required: false, message: '邮箱'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="status"
                                    label="状态"
                                    rules={[{required: false, message: '状态'}]}
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

                    </Form>
                </Spin>
            </Drawer>
        </>
    )
}

export default DeptForm