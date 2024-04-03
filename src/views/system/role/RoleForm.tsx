import {Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Space, Spin, Switch} from "antd";


import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as roleService from "@/service/system/role-service.ts"
import {Role} from "@/models/system/role-model.ts";
import ResSelector from "@/views/system/role/components/ResSelector.tsx";


export interface RoleFormProps {
    roleId?: number | null
    open: boolean
    onFinished?: () => void
    onCancel?: () => void
}


const RoleForm = ({open, roleId, onFinished, onCancel}: RoleFormProps) => {


    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [title, setTitle] = useState("添加角色")
    const [isEdit, setIsEdit] = useState(false)


    const loadRole = () => {
        if (roleId) {
            setLoading(true)
            roleService.getRole(roleId).then(resp => {
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
                roleService.createRole(values).then(() => {
                    message.info("添加角色成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setLoading(true)
                values.userId = roleId
                roleService.updateRole(values).then(() => {
                    message.info("修改角色成功")
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
        if (roleId) {
            setIsEdit(true)
            setTitle("修改角色");
            loadRole();
        } else {
            form.resetFields()
            setIsEdit(false)
            setTitle("添加角色");
        }
    }, [roleId,open])


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
                    <Form<Role>
                        form={form}
                        name="roleForm"
                        labelCol={{span: 6}}
                        wrapperCol={{span: 24}}
                        initialValues={{sortNum:1,disabled:false}}>
                        <Row  gutter={16}>
                            <Form.Item
                                hidden={true}
                                name="roleId"
                                label="角色ID"
                                rules={[{required: false, message: '角色ID'}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Col span={12}>
                                <Form.Item
                                    name="roleName"
                                    label="角色名称"
                                    rules={[{required: true, message: '角色名称'}]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="roleCode"
                                    label="角色编码"
                                    rules={[{required: true, message: '角色编码'}]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{span: 3}}
                                    name="sortNum"
                                    label="显示顺序"
                                    rules={[{required: true, message: '显示顺序'}]}
                                >
                                    <InputNumber/>
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
                                    <Radio.Group>
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
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{span: 3}}
                                    name="resIds"
                                    label="菜单权限"
                                    rules={[
                                        {
                                            required: false,
                                            message: '',
                                        },
                                    ]}
                                >
                                    <ResSelector />
                                </Form.Item>

                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Drawer>
        </>
    )
}

export default RoleForm