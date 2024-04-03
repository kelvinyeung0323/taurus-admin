import {Button, Checkbox, Form, Input} from "antd";


import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {LoginForm} from "@/models/system/sys-model.ts";
import {useAuthContext} from "@/store/auth-context.tsx";
import {useState} from "react";
import heroImg from "@/assets/img/hero-taurus.svg";
import loginBg from "@/assets/img/bg-login.png"
export default function LoginPage() {

    const [loading, setLoading] = useState(false)
    const {login} = useAuthContext()

    const doLogin = (form: LoginForm) => {
        setLoading(true)
        login(form).finally(() => setLoading(false))
    }
    return (
        <>
            <div
                className="flex relative w-screen h-screen justify-center items-center bg-amber-50  from-gray-200 to-gray-200 bg-gradient-to-r">
                <div
                    className="flex relative bg-amber-300 items-center rounded-2xl p-5 from-gray-300 to-gray-400 bg-gradient-to-r">
                    <div className="flex w-96 h-100">
                        <img src={heroImg} className="w-96 h-100" alt="hero image"/>
                    </div>
                    <div className="flex w-50 h-full overflow-clip absolute bottom-0 -right-40 items-end">
                         <img src={loginBg} alt="login background " className="w-[560px] h-64 -rotate-45"/>
                    </div>
                    <div
                        className="flex flex-col w-80 h-72 justify-center items-center shadow-2xl shadow-amber-100 rounded-2xl pt-4 backdrop-blur-lg">
                        <span className="text-2xl my-3">{import.meta.env.VITE_APP_TITLE}</span>
                        <Form
                            name="normal_login"
                            className=""
                            initialValues={{remember: true}}
                            onFinish={doLogin}
                        >
                            <Form.Item
                                name="username"
                                rules={[{required: true, message: '请输入你的用户名称!'}]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="用户名称"/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{required: true, message: '请输入密码!'}]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="密码"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>记住我</Checkbox>
                                </Form.Item>

                                <a className="login-form-forgot" href="#">
                                    忘记密码
                                </a>
                            </Form.Item>

                            <Form.Item>
                                <Button type="default" htmlType="submit"
                                        loading={loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                </div>
            </div>
        </>
    )
}