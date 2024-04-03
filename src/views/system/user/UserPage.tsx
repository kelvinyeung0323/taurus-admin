import {Button, Drawer, GetProp, Popconfirm, Popover, Row, Select, Space, Switch, Table, TableProps, Tag,} from "antd";
import {
    MinusOutlined,
    PlusOutlined,
    ProfileOutlined,
    SearchOutlined,
    SyncOutlined,
    TableOutlined,
    CloudUploadOutlined,
    CloudDownloadOutlined, FormOutlined, DeleteOutlined, KeyOutlined,
} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";

import RoleColRender from "@/views/system/user/components/RoleColRender.tsx";

import * as userService from "@/service/system/user-service.ts";
import {User, UserQueryForm} from "@/models/system/sys-model.ts";
import UserDetail, {UserDetailProps} from "./UserDetail.tsx";
import type {FilterValue, SorterResult, TableCurrentDataSource} from "antd/es/table/interface";
import UserSearch from "@/views/system/user/components/UserSearch.tsx";
import ColumnSelector from "@/views/system/components/ColumnSelector.tsx";
import EnabledColRender from "@/views/system/user/components/EnabledColRender.tsx";
import SeqColRender from "@/views/system/components/SeqColRender.tsx";
import {ColumnsType} from "antd/es/table";
import DeptPanel from "@/views/system/user/components/DeptPanel.tsx";
import {RoleQueryForm} from "@/models/system/role-model.ts";
import * as roleService from "@/service/system/role-service.ts";
import ChangePasswordModal from "@/views/system/user/components/ChangePasswordModal.tsx";
import Secure from "@/components/security/Secure.tsx";


type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
//编历map时是按插入顺序遍历
type Sorts = Map<React.Key, 'ascend' | 'descend'>


const UserPage = () => {


    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [dataSource, setDataSource] = useState<User[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const [toggleSearch, setToggleSearch] = useState(true)
    const [searchParams, setSearchParams] = useState<UserQueryForm>({
        pageNum: 1,
        pageSize: 10,
    })
    const [tableSorts, setTableSorts] = useState<Sorts>()

    const searchParamsRef = useRef<RoleQueryForm>()
    searchParamsRef.current = searchParams;
    const selectedRowKeysRef = useRef<number[]>();
    selectedRowKeysRef.current = selectedRowKeys
    const fetchData = () => {
        setTableLoading(true)
        userService.queryUser(searchParams).then(resp => {
            console.log("data", resp)
            if (resp.data) {
                setDataSource(resp.data)
                setCurrentPage(resp.pageNum || 1)
                setTotalUsers(resp.total || 0)
            }

        }).finally(() => setTableLoading(false))
    }


    const handleSearch = (value: any) => {
        console.log("search")
        setSearchParams({
            ...searchParamsRef.current,
            ...value,
            pageNum: 1,
            pageSize: 10,
        })
    }
    const handleResetSearch = () => {
        const newColumn = tableColumns.map(e => {
            e.sortOrder = null;
            return e;
        })
        setTableColumns(newColumn);
        setTableSorts(new Map<React.Key, "ascend" | "descend">())
        setSearchParams({
            pageNum: 1,
            pageSize: 10,
        })
        setSelectedDept([])
    }


    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys as string[])
        },
        getCheckboxProps: (record: User) => ({
            disabled: record.userName == "admin",
            name: record.userId,
        }),
    };

    const onDeleteUsers = (userIds: number[]) => {
        setTableLoading(true)
        userService.deleteUsers(userIds).then(() => {
            setSearchParams({...searchParamsRef.current, pageNum: 1} as never)
        }).finally(() => setTableLoading(false))
    }


    const onSwitchStatus = (userId: number, checked: boolean) => {
        setTableLoading(true);
        userService.switchUserStatus(userId, checked).then(() => {
            setSearchParams({...searchParamsRef.current, pageNum: 1} as never)
        }).finally(() => setTableLoading(false))
    }


    useEffect(() => {
        fetchData()
    }, [JSON.stringify(searchParams)]);


    //=========== CURD ==============================================================================
    const handleCreate = () => {
        setDetailProp({open: true, userId: null})
    }


    const handleUpload = () => {

    }

    const handleDownload = () => {

    }

    const handleSyncData = () => {
        setSearchParams({...searchParams})
    }

    const handleColumnSelected = (columns: ColumnsType<User>): void => {
        console.log("new columns:", columns);
        setTableColumns(columns);
    }
    //===============================================================================================

    const OperColRender = (_: string, user: User) => {
        if (user.userType == "00") {
            return (
                <></>
            )
        } else {
            return (
                <Space size="middle">
                    <a key="edit" title="编辑用户"
                       onClick={() => setDetailProp({open: true, userId: user.userId})}><FormOutlined/></a>
                    <Secure perms="system:user:remove">
                    <Popconfirm
                        placement="top"
                        title="确认删除"
                        description={"确定要删除用户【" + user.nickName + "】吗？"}
                        onConfirm={() => onDeleteUsers([user.userId as string])}
                        okText="是"
                        cancelText="否"
                    >
                        <a title="删除用户"><DeleteOutlined/></a>
                    </Popconfirm>
                    </Secure>
                    <a title="重置密码" onClick={() => {
                        setChangePwdProp({open: true, userId: user.userId, userName: user.userName})
                    }}><KeyOutlined/></a>
                </Space>
            )
        }
    }

    const EnabledColRender = (disabled: boolean, user: User) => {
        if (user.userType == "00") {
            return <Tag color="green">正常</Tag>

        } else {
            return (
                <Switch defaultChecked={!disabled}
                        onChange={(checked) => onSwitchStatus(user.userId, checked)}/>
            )
        }
    }

    const columns: ColumnsType<User> = [
        {
            title: "序号",
            dataIndex: "userId",
            key: "userId",
            align: "center",
            width: 100,
            fixed: "left",
            render: SeqColRender,
        },
        {
            title: "用户名称",
            dataIndex: "userName",
            key: "userName",
            align: "center",
            fixed: "left",
            sorter: {multiple: 1},
            sortOrder: tableSorts?.get("userName")
        },
        {title: "用户昵称", dataIndex: "nickName", key: "nickName", align: "center", sorter: {multiple: 2},},
        {title: "姓别", dataIndex: "gender", key: "gender", align: "center", sorter: {multiple: 3},},
        {title: "手机号码", dataIndex: "tel", key: "tel", align: "center", sorter: {multiple: 4}, ellipsis: true},
        {title: "Email", dataIndex: "email", key: "email", align: "center", sorter: {multiple: 5}, ellipsis: true},
        {title: "角色", width: 150, dataIndex: "roles", key: "roles", align: "center", render: RoleColRender, sorter: {multiple: 6},},
        {title: "状态", dataIndex: "disabled", key: "disabled", align: "center", width: 80, render: EnabledColRender, sorter: {multiple: 7}},
        {title: "最后登录IP", dataIndex: "loginIp", key: "loginIp", align: "center", width: 150, sorter: {multiple: 8}, ellipsis: true},
        {title: "最后登录时间", dataIndex: "loginDate", key: "loginDate", align: "center", width: 150, sorter: {multiple: 9}, ellipsis: true},
        {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: "center", sorter: {multiple: 10}, ellipsis: true},
        {title: "操作", fixed: "right", align: "center", width: 120, key: "action", render: OperColRender}
    ];

    const [tableColumns, setTableColumns] = useState<ColumnsType<User>>(columns);


    const sort2Str = (sorts: Sorts): string => {
        let sortStr = "";
        sorts.forEach((value, key) => {
            sortStr += "," + key + ("descend" == value ? ".desc" : ".asc")
        })
        return sortStr.substring(1);
    }


    const handleTableChange = (pagination: TablePaginationConfig, __: Record<string, FilterValue | null>, sorter: SorterResult<User> | SorterResult<User>[], extra: TableCurrentDataSource<User>) => {

        const sorts: Sorts = new Map<React.Key, "descend" | "ascend">();
        //转换成接口所需的排序字符串
        if (extra.action == "sort") {
            if (Array.isArray(sorter)) {
                sorter.forEach(m => m.columnKey ? sorts.set(m.columnKey, m.order ? m.order : "ascend") : null);
            } else {
                sorter.columnKey ? sorts.set(sorter.columnKey, (sorter.order ? sorter.order : "ascend")) : null;
            }

            const newColumn = tableColumns.map(e => {
                e.key ? e.sortOrder = sorts?.get(e.key) : e;
                return e;
            })
            setTableColumns(newColumn);
            setTableSorts(sorts);

        }


        setSearchParams({
            ...searchParams,
            sort: sort2Str(sorts),
            pageNum: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
        })


    }

    //=========编辑用户=================================================================
    const [detailProp, setDetailProp] = useState<UserDetailProps>({
        open: false,
        userId: null,
    });

    const handleDetailFinished = () => {
        setDetailProp({open: false, userId: null});
        fetchData();
    }
    const handleDetailCancel = () => {
        setDetailProp({open: false, userId: null})
    }

    //==============修改密码================================================================
    const [changePwdProp, setChangePwdProp] = useState({userId: undefined, userName: undefined, open: false})


    //============部门选择============================================
    const [selectedDept, setSelectedDept] = useState<number[]>([])
    useEffect(() => {
        console.log("selectedDept",selectedDept)
        setSearchParams({...searchParams, deptId: selectedDept.length>0?selectedDept[0]:[]})
    }, [selectedDept]);
    //====================================================================

    return (
        <div className="flex">
            <DeptPanel value={selectedDept} onChange={(val) =>{
                setSelectedDept(val)
            }}/>
            <section className="w-full p-3 ml-3 pl-4 rounded-2xl shadow-lg bg-white">
                <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                    <Row className={toggleSearch ? "" : "hidden"}>
                        <UserSearch onFinish={handleSearch} onReset={handleResetSearch}/>
                    </Row>
                    <Row className="flex relative">
                        <Space>
                            <Button type="primary" className="btn-blue" onClick={handleCreate}
                                    icon={<PlusOutlined/>}>新增</Button>
                            <Popconfirm
                                placement="top"
                                title="确认删除"
                                disabled={selectedRowKeys.length <= 0}
                                description={"确定要删除" + selectedRowKeys.length + "个用户吗？"}
                                onConfirm={() => onDeleteUsers(selectedRowKeys)}
                                okText="是"
                                cancelText="否"
                            >
                                <Button type="primary" className="btn-red" icon={<MinusOutlined/>}
                                        disabled={selectedRowKeys.length <= 0}>删除</Button>
                            </Popconfirm>
                            <Button type="primary" className="btn-green" onClick={handleUpload}
                                    icon={<CloudUploadOutlined/>}>导入</Button>
                            <Button type="link" className="btn-orange" onClick={handleDownload}
                                    icon={<CloudDownloadOutlined/>}>导出</Button>

                        </Space>
                        <div className="flex absolute right-0">
                            <Button size="small" type="link"
                                    onClick={() => setToggleSearch(!toggleSearch)}><SearchOutlined/></Button>
                            <Button size="small" type="link" onClick={handleSyncData}><SyncOutlined/></Button>
                            <Button size="small" type="link"><ProfileOutlined/></Button>
                            <Popover content={<ColumnSelector columns={columns} onChange={handleColumnSelected}/>}
                                     trigger="click">
                                <Button size="small" type="link"><TableOutlined/></Button>
                            </Popover>
                        </div>
                    </Row>
                    <Row>
                        <Table
                            style={{width: "100%"}}
                            scroll={{x: 1000}}
                            rowKey="userId"
                            size="middle"
                            tableLayout="fixed"
                            loading={tableLoading}
                            dataSource={dataSource}
                            columns={tableColumns}
                            showSorterTooltip={true}
                            sortDirections={['ascend', 'descend']}
                            rowSelection={{
                                type: selectionType,
                                ...rowSelection,
                            }}
                            onChange={handleTableChange}
                            pagination={{
                                showSizeChanger: true,
                                defaultPageSize: 10,
                                current: currentPage,
                                showTotal: (total, range) => `第${range[0]}-${range[1]}条,共${total} 条记录`,
                                pageSizeOptions: [5, 10, 20, 50],
                                total: totalUsers
                            }}
                        />
                    </Row>
                </Space>

                <UserDetail open={detailProp.open} userId={detailProp.userId} onFinished={handleDetailFinished}
                            onCancel={handleDetailCancel}/>
                <ChangePasswordModal userId={changePwdProp.userId} userName={changePwdProp.userName}
                                     onFinish={() => setChangePwdProp({userId: false, userName: undefined, open: false})}
                                     open={changePwdProp.open}/>
            </section>
        </div>
    )
}

export default UserPage