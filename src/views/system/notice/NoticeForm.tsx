import {Button, Col, Drawer, Form, Input, message, Radio, Row, Select, Space, Spin} from "antd";


import {useEffect, useState} from "react";
import {useForm} from "antd/es/form/Form";
import * as noticeService from "@/service/system/notice-service.ts"
import {Notice} from "@/models/system/notice-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const {Option} = Select;

export interface NoticeFormProps {
    noticeId?: number | null
    open: boolean
    onFinished?: () => void
    onCancel?: () => void
}

interface EditorProps {
    value: string
    onChange: (val: string) => void
}

//参考: https://ckeditor.com/docs/ckeditor5/latest/installation/integrations/react.html
const TextEditor = ({value, onChange}: EditorProps) => {

    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(event, editor) => {
                console.log('change.', editor.getData());
                onChange(editor.getData())
            }}

        />
    )
}

const NoticeForm = ({open, noticeId, onFinished, onCancel}: NoticeFormProps) => {


    const [loading, setLoading] = useState(false)
    const [form] = useForm()
    const [title, setTitle] = useState("添加参数")
    const [isEdit, setIsEdit] = useState(false)


    const {dict} = useDictContext();
    const defaultNoticeType = dict.get("sys_notice_type")?.find(v => v.isDefault)?.itemValue
    const defaultNoticeStatus = dict.get("sys_notice_status")?.find(v => v.isDefault)?.itemValue
    const loadNotice = () => {
        if (noticeId) {
            setLoading(true)
            noticeService.getNotice(noticeId).then(resp => {
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
                noticeService.createNotice(values).then(() => {
                    message.info("添加公告成功")
                    if (onFinished) {
                        onFinished()
                    }
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setLoading(true)
                values.userId = noticeId
                noticeService.updateNotice(values).then(() => {
                    message.info("修改公告成功")
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
        if (noticeId) {
            setIsEdit(true)
            setTitle("修改公告");
            loadNotice();
        } else {
            form.resetFields()
            setIsEdit(false)
            setTitle("添加公告");
        }
    }, [noticeId, open])


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
                    <Form<Notice>
                        form={form}
                        name="noticeForm"
                        labelCol={{span: 6}}
                        wrapperCol={{span: 24}}
                        initialValues={{noticeType: defaultNoticeType, status: defaultNoticeStatus}}>
                        <Row gutter={16}>
                            <Form.Item
                                hidden={true}
                                name="noticeId"
                                label="ID"
                                rules={[{required: false, message: 'ID'}]}
                            >
                                <Input placeholder="ID"/>
                            </Form.Item>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{span: 3}}
                                    name="noticeTitle"
                                    label="标题"
                                    rules={[{required: true, message: '标题'}]}
                                >
                                    <Input placeholder="标题"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>

                            <Col span={12}>
                                <Form.Item
                                    name="noticeType"
                                    label="类型"
                                    rules={[{required: true, message: '类型'}]}
                                >
                                    <Select>
                                        {dict.get("sys_notice_type")?.map(d => <Option value={d.itemValue}
                                                                                       key={d.itemId}>{d.itemLabel}</Option>)}
                                    </Select>
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
                                        {dict.get("sys_notice_status")?.map(d => <Radio value={d.itemValue}
                                                                                        key={d.itemId}>{d.itemLabel}</Radio>)}
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{span: 3}}
                                    name="noticeContent"
                                    label="内容"

                                    rules={[
                                        {
                                            required: false,
                                            message: '',
                                        },
                                    ]}
                                >
                                    <TextEditor/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Drawer>
        </>
    )
}

export default NoticeForm