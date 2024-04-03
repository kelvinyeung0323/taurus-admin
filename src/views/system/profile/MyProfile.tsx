import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    message,
    Radio,
    Row,
    Space,
    Spin,
    Tabs,
    TabsProps,
    Tag
} from "antd";


import {UserOutlined,CrownOutlined,FontColorsOutlined,MailOutlined,PhoneOutlined,ApartmentOutlined,CalendarOutlined} from "@ant-design/icons";
import {useAuthContext} from "@/store/auth-context.tsx";
import {User} from "@/models/system/sys-model.ts";
import * as profileService from "@/service/system/profile-service.ts"

import BaseInfoCard from "@/views/system/profile/components/BaseInfoCard.tsx";
import ChangePasswordCard from "@/views/system/profile/components/ChangePasswordCard.tsx";
import {useEffect, useState} from "react";
import {AvatarUploader} from "@/views/system/profile/components/AvatarUploader.tsx";
const MyProfile = () => {


    const [profile,setProfile]  = useState<User>()
    const [loading,setLoading] = useState(false)
    const fetchData = ()=>{
        setLoading(true)
        profileService.getProfile().then((resp)=>{
            setProfile(resp.data)
        }).finally(()=>setLoading(false))

    }

    const handleUpdatedProfile=()=>(
        fetchData()
    )

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '基本资料',
            children: (<BaseInfoCard profile={profile} onUpdated={handleUpdatedProfile}/>),
        },
        {
            key: '2',
            label: '修改密码',
            children: (<ChangePasswordCard/>),
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Spin spinning={loading}>
            <Row gutter={8}>
                <Col span={8}>
                    <Card title="个人信息" className="profile-info">
                        <Row className="flex justify-center items-center my-5">
                            <div className="flex justify-center items-center ">
                                <AvatarUploader/>
                            </div>
                        </Row>
                        <Row className="mt-3">
                             <Col span={12} className="text-sm">
                                <UserOutlined/> <span> 用户名称</span>
                             </Col>
                            <Col span={12} className="text-sm">
                                 <span >{profile?.userName}</span>
                            </Col>
                        </Row>
                        <Divider className="my-3"/>
                        <Row className="row">
                            <Col span={12} className="text-sm">
                                <FontColorsOutlined /><span> 用户昵称</span>
                            </Col>
                            <Col span={12} className="text-sm">
                                <span >{profile?.nickName}</span>
                            </Col>
                        </Row>
                        <Divider orientationMargin={1} className="my-3"/>
                        <Row className="row">
                            <Col span={12} className="text-sm">
                                <PhoneOutlined /><span> 电话号码</span>
                            </Col>
                            <Col span={12} className="text-sm">
                                <span >{profile?.tel}</span>
                            </Col>
                        </Row>
                        <Divider orientationMargin={1} className="my-3"/>
                        <Row className="row">
                            <Col span={12} className="text-sm">
                                <MailOutlined /><span> 邮箱</span>
                            </Col>
                            <Col span={12} className="text-sm">
                                <span >{profile?.email}</span>
                            </Col>
                        </Row>
                        <Divider orientationMargin={1} className="my-3"/>
                        <Row className="row">
                            <Col span={12} className="text-sm">
                                <ApartmentOutlined /><span> 所属部门</span>
                            </Col>
                            <Col span={12} className="text-sm">
                                <span >{profile?.dept.deptName}</span>
                            </Col>
                        </Row>
                        <Divider orientationMargin={1} className="my-3"/>
                        <Row className="row">
                            <Col span={12} className="text-sm">
                                <CrownOutlined /><span> 角色</span>
                            </Col>
                            <Col span={12} className="text-sm">
                               {profile?.roles?.map(r=><Tag  color={"default"} key={r.roleId}>{r.roleName}</Tag>)}
                            </Col>
                        </Row>
                        <Divider orientationMargin={1} className="my-3"/>
                        <Row className="row">
                            <Col span={12} className="text-sm">
                                <CalendarOutlined /><span> 创建日期</span>
                            </Col>
                            <Col span={12} className="text-sm">
                                <span >{profile?.createdAt}</span>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={16}>
                    <Card title="基本资料">
                        <Tabs items={items}>
                        </Tabs>
                    </Card>

                </Col>
            </Row>
            </Spin>
        </>
    )
}

export default MyProfile