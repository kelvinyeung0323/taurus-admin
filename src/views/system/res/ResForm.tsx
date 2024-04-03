import {Button, Col, Drawer, Form, Input, InputNumber, message, Radio, Row, Select, Space, Spin} from "antd";


import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as resService from "@/service/system/res-service.ts"
import {Res, ResType} from "@/models/system/res-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";
import {IconSelectComponent} from "@/views/system/components/IconComponent.tsx";
import ResSelector from "@/views/system/res/components/ResSelector.tsx";


const {Option} = Select;

export interface ResFormProps {
    parentId:number|null
    resId?: number | null
    open: boolean
    onFinished?: () => void
    onCancel?: () => void
}





const ResForm = ({open, resId, parentId, onFinished, onCancel}: ResFormProps) => {


    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [title, setTitle] = useState("添加部门")
    const [selectedResType,setSelectedResType] = useState(ResType.Catalog)
    const [isEdit, setIsEdit] = useState(false)


    const {dict} = useDictContext();
    const defaultResStatus = dict.get("sys_normal_disable")?.find(v => v.isDefault).itemValue
    console.log("defaultResStatus",defaultResStatus);
    const fetchData = () => {
        if (resId) {
            setLoading(true)
            resService.getRes(resId).then(resp => {
                console.log("resp:", resp)
                if (resp.data) {
                    form.setFieldsValue(resp.data)
                    setSelectedResType(resp.data.resType)
                }
            }).finally(() => setLoading(false))
        }

    }


    const onSaveRes = () => {


        form.validateFields().then((values) => {
            console.log("form:", values)
            if (!isEdit) {
                setLoading(true)
                resService.createRes(values).then(() => {
                    message.info("添加菜单成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setLoading(true)
                values.userId = resId
                resService.updateRes(values).then(() => {
                    message.info("修改菜单成功")
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
        if (resId) {
            setIsEdit(true)
            setTitle("修改菜单");
            fetchData();
        } else {
            form.resetFields()
            setIsEdit(false)
            setTitle("添加菜单");
            console.log("parentId",parentId)
            if(parentId){
                form.setFieldValue("parentId",parentId)
            }

        }
    }, [resId, open])


    return (
        <>
            <Drawer
                title={title}
                width={620}
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
                    <Form<Res>
                        form={form}
                        name="resForm"
                        labelCol={{span: 7}}
                        wrapperCol={{span: 24}}
                        initialValues={{ status: defaultResStatus,sortNum:1,parentId:0,isFrame:false,disabled:false,visible:true,isCache:true,resType:selectedResType}}>
                        <Row gutter={16}>
                            <Form.Item
                                hidden={true}
                                name="resId"
                                label="ID"
                                rules={[{required: false, message: 'ID'}]}
                            >
                                <Input placeholder="ID"/>
                            </Form.Item>
                            <Col span={12}>
                                <Form.Item
                                    name="parentId"
                                    label="上级菜单"
                                    rules={[{required: true, message: '上级菜单'}]}
                                >
                                   <ResSelector/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="disabled"
                                    label="菜单状态"
                                    rules={[{required: false, message: '菜单状态'}]}
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
                            <Col span={13}>
                                <Form.Item
                                    name="resType"
                                    label="菜单类型"
                                    rules={[{required: true, message: '菜单类型'}]}
                                >
                                    <Radio.Group onChange={(e)=>setSelectedResType(e.target.value)}>
                                        <Radio value="C" key="C">目录</Radio>
                                        <Radio value="M" key="M">菜单</Radio>
                                        <Radio value="F" key="F">按钮</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="resName"
                                    label="菜单名称"
                                    rules={[{required: false, message: '菜单名称'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{display:selectedResType==ResType.Button?"none":"block"}}>
                                <Form.Item

                                    name="icon"
                                    label="菜单图标"
                                    rules={[{required: false, message: '邮箱'}]}
                                >
                                    <IconSelectComponent/>
                                </Form.Item>
                            </Col>


                            <Col span={12} style={{display:selectedResType==ResType.Button?"none":"block"}}>
                                <Form.Item

                                    name="path"
                                    label="路由地址"
                                    rules={[{required: false, message: '路由地址'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={12}   style={{display:selectedResType==ResType.Button?"none":"block"}}>
                                <Form.Item

                                    name="isFrame"
                                    label="是否外链"
                                    rules={[{required: true, message: '是否外链'}]}
                                >
                                    <Radio.Group>
                                        <Radio value={true} key="0">是</Radio>
                                        <Radio value={false} key="1">否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col span={12}   style={{display:selectedResType!=ResType.Menu?"none":"block"}}>
                                <Form.Item

                                    name="query"
                                    label="路由参数"
                                    rules={[{required: false, message: '路由参数'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={12}  style={{display:selectedResType==ResType.Catalog?"none":"block"}}>

                                <Form.Item

                                    name="authCode"
                                    label="权限标识"
                                    rules={[{required: false, message: '权限标识'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>

                            <Col span={12}  style={{display:selectedResType!=ResType.Menu?"none":"block"}}>
                                <Form.Item

                                    name="component"
                                    label="组件路径"
                                    rules={[{required: false, message: '组件路径'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="sortNum"
                                    label="显示排序"
                                    rules={[{required: false, message: '显示排序'}]}
                                >
                                    <InputNumber/>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display:selectedResType == ResType.Button?"none":"block"}}>
                                <Form.Item

                                    name="visible"
                                    label="显示状态"
                                    rules={[{required: false, message: '显示状态'}]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                    >
                                        <Radio value={true} key={1}>显示</Radio>
                                        <Radio value={false} key={2}>隐藏</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}  style={{display:selectedResType!=ResType.Menu?"none":"block"}}>
                                <Form.Item

                                    name="isCache"
                                    label="是否缓存"
                                    rules={[{required: false, message: '是否缓存'}]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                    >
                                      <Radio value={true} key={1}>缓存</Radio>
                                      <Radio value={false} key={2}>不缓存</Radio>
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

export default ResForm