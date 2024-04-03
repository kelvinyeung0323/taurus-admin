import {Button, Col, Drawer, Form, Input, message, Radio, Row, Select, Space, Spin} from "antd";


import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";

import * as userService from "@/service/system/user-service.ts";
import DeptSelector from "@/views/system/user/components/DeptSelector.tsx";
import RoleSelector from "@/views/system/user/components/RoleSelector.tsx";
import {useDictContext} from "@/store/dict-context.tsx";
import PosSelector from "@/views/system/user/components/PosSelector.tsx";

const {Option} =Select;
export interface UserDetailProps {
    userId?: number | null
    open: boolean
    onFinished?: () => void
    onCancel?: () => void
}


const UserDetail = ({open, userId, onFinished, onCancel}: UserDetailProps) => {

    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [title, setTitle] = useState("添加用户")
    const [isEdit, setIsEdit] = useState(false)

    const {dict} = useDictContext()

    const fetchData = () => {
        if (userId) {
            userService.getUser(userId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    form.setFieldsValue(resp.data);
                }
            }).finally(() => setLoading(false))
        }

    }
    const onSaveRes = () => {

        form.validateFields().then((values) => {
            console.log("values;",values)
            if (!isEdit) {
                setLoading(true)
                userService.createUser(values).then(() => {
                    message.info("添加用户成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setLoading(true)
                userService.updateUser(values).then(() => {
                    message.info("修改用户成功")
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

        if (userId) {
            setIsEdit(true)
            setTitle("修改用户");
            fetchData();
        } else {
            form.resetFields()
            setIsEdit(false)
            setTitle("添加用户");
        }
    }, [userId])


    return (
        <>
            <Drawer
                title={title}
                width={720}
                onClose={onCancel}
                open={open}
                styles={{body:{paddingBottom: 80}}}
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
                    <Form
                        form={form}
                        name="userForm"
                        labelCol={{span: 6}}
                        wrapperCol={{span: 24}}
                        initialValues={{userId:undefined,disabled:false}}>
                        <Row  gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    hidden={true}
                                    name="userId"
                                    label="用户ID"
                                    rules={[{required: false, message: '用户ID'}]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    name="userName"
                                    label="登录账号"
                                    rules={[{required: true, message: '登录账号'}]}
                                >
                                    <Input disabled={isEdit} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="password"
                                    label="输入密码"
                                    rules={[{required: !isEdit, message: '输入密码'}]}
                                >
                                    <Input.Password placeholder={isEdit ? "******" : "输入密码"}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="nickName"
                                    label="用户名称"
                                    rules={[{required: true, message: '用户名称'}]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="deptId"
                                    label="归属部门"
                                    rules={[{required: true, message: '归属部门'}]}
                                >
                                    <DeptSelector />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="tel"
                                    label="手机号码"
                                    rules={[{required: true, message: '手机号码'}]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="邮箱"
                                    rules={[{required: true, message: '邮箱'}]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="gender"
                                    label="姓别"
                                    rules={[{required: true, message: '姓别'}]}
                                >
                                    <Select>
                                        {dict.get("sys_user_sex")?.map(e=>(<Option key={e.itemId} value={e.itemValue}>{e.itemLabel}</Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="posIds"
                                    label="职位"
                                    rules={[{required: true, message: '职位'}]}
                                >
                                <PosSelector />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="roleIds"
                                    label="角色"
                                    rules={[{required: true, message: '角色'}]}
                                >
                                    <RoleSelector/>
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

export default UserDetail