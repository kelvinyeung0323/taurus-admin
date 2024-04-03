import {Button, Layout, Menu, MenuProps, theme} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {Link, Outlet, useLocation} from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import {Content, Header} from "antd/es/layout/layout";
import {useState} from "react";
import {useAuthContext} from "@/store/auth-context.tsx";
import {ResType} from "@/models/system/res-model.ts";
import {IconComponent} from "@/views/system/components/IconComponent.tsx";
import ProfileWidget from "@/views/system/profile/components/ProfileWiget.tsx";
import logo from "@/assets/img/hero-taurus.svg"
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon: <IconComponent iconName={icon as string}/>,
        children,
        label,
        type,
    } as MenuItem;
}

const homePage:MenuItem=getItem(<Link to="/">首页</Link>,"/","HomeOutlined") as MenuItem

const AppLayout = () => {

    const loc = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer,borderRadiusLG },
    } = theme.useToken();

    const {res} = useAuthContext()

    //因为只取两层
    const menuItems: MenuItem[] = res.filter(e=>e.visible==true).map((r) => {

        if (r.resType == ResType.Catalog) {
            const children = r.children?.filter(e=>e.visible==true).map((c) => {
                if (c.resType == ResType.Catalog) {
                    return getItem(c.resName, c.path||c.resId, c.icon)
                } else {
                    return getItem(<Link to={c.path as string}>{c.resName}</Link>, c.path||c.resId,c.icon)
                }

            })

            return getItem(r.resName, r.path||r.resId, r.icon, children)


        } else {
            return getItem(<Link to={r.path as string}>{r.resName}</Link>, r.resId, r.icon)
        }

    });
    menuItems.unshift(homePage)

    return (

        <Layout className="main-layout">
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div style={{width:"100%",height:"60",padding:20,display:"flex",justifyContent:"center",alignItems:"center"}}>
                           <img
                               alt="logo"
                               width={35}
                               src={logo}
                           />
                           <div className="font-bold text-lg text-purple-50"
                           style={{display:collapsed?"none":"block",fontFamily:"Segoe UI Symbol"}}
                           ><span>后台管理系统</span></div>

                </div>

                <Menu
                    defaultOpenKeys={menuItems.map(v=>v?.key) as string[]}
                    selectedKeys={[loc.pathname]}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={menuItems}
                />

            </Sider>
            <Layout>
                <Header style={{padding: 0, background: colorBgContainer}}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <ProfileWidget style={{position:"absolute",top:0,right:20,width:64,height:64}}/>
                </Header>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        overflowY: "scroll",
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>

    );

}


export default AppLayout