import {Button, Drawer, GetProp, Popconfirm, Popover, Row, Space, Switch, Table, TableProps, Tag,} from "antd";
import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    FormOutlined,
    MinusOutlined,
    PlusOutlined,
    ProfileOutlined,
    SearchOutlined,
    SyncOutlined,
    TableOutlined, UserDeleteOutlined,
} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";


import * as userRoleService from "@/service/system/user-role-service.ts";

import type {FilterValue, SorterResult, TableCurrentDataSource} from "antd/es/table/interface";
import ColumnSelector from "@/views/system/components/ColumnSelector.tsx";
import SeqColRender from "@/views/system/components/SeqColRender.tsx";
import {ColumnsType} from "antd/es/table";
import RoleForm from "@/views/system/role/RoleForm.tsx";
import RoleSearch from "@/views/system/role/components/RoleSearch.tsx";
import {Role, RoleQueryForm} from "@/models/system/role-model.ts";
import RoleUserSelect from "@/views/system/role/bak/RoleUserSelect.tsx";
import {TiCancelOutline} from "react-icons/ti";
import UserSearch from "@/views/system/role/components/UserSearch.tsx";
import {User, UserQueryForm} from "@/models/system/sys-model.ts";



type TablePaginationRole = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
//编历map时是按插入顺序遍历
type Sorts = Map<React.Key,'ascend'|'descend'>




interface Props {
    open?:boolean
    roleId?:number
    onCancel?:()=>void
    onFinished?:()=>void
}


const  UserSelector= ({open,roleId,onCancel,onFinished}:Props) =>{


    //===========================base ==================================================================/

    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [toggleSearch, setToggleSearch] = useState(true)


    const [dataSource, setDataSource] = useState<Role[]>([])
    const [searchParams,setSearchParams] = useState<UserQueryForm>({
        disabled:false,
        pageNum:1,
        pageSize:10,
    })
    const searchParamsRef = useRef<UserQueryForm>()
    searchParamsRef.current = searchParams;
    const selectedRowKeysRef = useRef<number[]>();
    selectedRowKeysRef.current = selectedRowKeys
    const fetchData = () => {
        setTableLoading(true)
        userRoleService.queryUserNotBelong2Role(searchParams).then(resp => {
            console.log("data", resp)
            if (resp.data) {
                setDataSource(resp.data)
                setCurrentPage(resp.pageNum || 1)
                setTotal(resp.total || 0)
                //测除selectedRoleKeys
                setSelectedRowKeys([])
            }

        }).finally(() => setTableLoading(false))
    }


    const handleSearch = (value:any)=>{
        console.log("search")
        setSearchParams({
            ...searchParams,
            ...value,
            pageNum: 1,
            pageSize: 10,
        })
    }
    const handleResetSearch = () => {
        const newColumn =  tableColumns.map(e=>
        {
            e.sortOrder=null;
            return e;
        })
        setTableColumns(newColumn);
        setSearchParams({
            roleId:roleId,
            disabled:false,
            pageNum: 1,
            pageSize: 10,
        })
    }


    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys as number[])
        },
        getCheckboxProps: (record: User) => ({
            disabled: false,
            name: record.userId,
        }),
    };





    useEffect(() => {
        fetchData()
    }, [searchParams]);

    useEffect(() => {
        handleResetSearch();
    }, [roleId]);

    const EnabledColRender = (disabled: boolean)=>{
        return disabled?<Tag color={"error"}>停用</Tag>:<Tag color={"success"}>正常</Tag>
    }

    const columns:ColumnsType<Role> = [
        {
            title: "序号",
            dataIndex: "roleId",
            key: "roleId",
            align: "center",
            width: 100,
            fixed: "left",
            render: SeqColRender,
        },
        {
            title: "登录名称",
            dataIndex: "userName",
            key: "userName",
            align: "center",
            fixed: "left",
            sorter: {multiple: 1}
        },
        {title: "用户名称", dataIndex: "nickName", key: "nickName", align: "center", sorter: {multiple: 2}},
        {title: "邮箱", dataIndex: "email", key: "email", align: "center", width: 100,sorter: {multiple: 3}},
        {title: "手机", dataIndex: "tel", key: "tel", align: "center", sorter: {multiple: 3},ellipsis:true},
        {title: "用户状态", dataIndex: "disabled", key: "disabled", align: "center", width: 100, render: EnabledColRender,sorter: {multiple: 3}},
        {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: "center",sorter: {multiple: 5}},
    ];

    const [tableColumns,setTableColumns] = useState<ColumnsType<Role>>(columns );


    const sort2Str = (sorts:Sorts):string=>{
        let sortStr = "";
        sorts.forEach((value,key)=>{
            sortStr+=","+ key + ("descend" == value?".desc":".asc")
        })
        return sortStr.substring(1);
    }


    const handleTableChange = (pagination: TablePaginationRole, __: Record<string, FilterValue | null>, sorter: SorterResult<Role> | SorterResult<Role>[], extra: TableCurrentDataSource<Role>) => {

        const sorts: Sorts = new Map<React.Key,"descend"|"ascend">();
        //转换成接口所需的排序字符串
        if(extra.action =="sort"){
            if (Array.isArray(sorter)) {
                sorter.forEach(m=>m.columnKey?sorts.set(m.columnKey, m.order?m.order:"ascend" ):null);
            }else {
                sorter.columnKey?sorts.set(sorter.columnKey,  (sorter.order?sorter.order:"ascend")):null;
            }

            const newColumn =  tableColumns.map(e=>
            {
                e.key?e.sortOrder=sorts?.get(e.key):e;
                return e;
            })
            setTableColumns(newColumn);

        }


        setSearchParams({
            ...searchParams,
            sort:sort2Str(sorts),
            pageNum:pagination.current||1,
            pageSize:pagination.pageSize||10,
        })



    }


    //=========编辑=================================================================
    const [roleFormProp,setRoleFormProp] = useState<{open:boolean,roleId:number|undefined}>({
        open:false,
        roleId:undefined,
    });

    const handleDetailFinished=()=>{
        setRoleFormProp({open:false,roleId:undefined});
        fetchData();
    }
    const handleDetailCancel=()=>{
        setRoleFormProp({open:false,roleId:undefined})
    }


    const handleAuthorize=()=>{
        console.log("select key:",selectedRowKeys);
        setTableLoading(true);
       const userRoles = selectedRowKeys.map(userId=>({roleId:roleId,userId:userId}));
        userRoleService.authorize(userRoles).then((resp)=>{
            console.log("resp",resp);
            // handleResetSearch();
            onFinished();
        }).finally(()=>{
            setTableLoading(false);
        })
    }

    //============================================================================
    return (
        <Drawer
            title="选择用户"
            width={"70%"}
            onClose={onCancel}
            open={open}
            bodyStyle={{paddingBottom: 80}}
            extra={
                <Space>
                    <Button onClick={onCancel} className="btn">关闭</Button>
                    <Button onClick={handleAuthorize} className="btn-blue">提交</Button>
                </Space>
            }
        >
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row className={toggleSearch ? "" : "hidden"}>
                    <UserSearch onFinish={handleSearch} onReset={handleResetSearch}/>
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
                        } as never}
                        onChange={handleTableChange}
                        pagination={{
                            showSizeChanger:true,
                            defaultPageSize:10,
                            current:currentPage,
                            showTotal:(total, range) => `第${range[0]}-${range[1]}条,共${total} 条记录`,
                            pageSizeOptions:[5, 10, 20, 50],
                            total:total
                        }}
                    />
                </Row>
            </Space>

            <RoleForm open={roleFormProp.open} roleId={roleFormProp.roleId} onFinished={handleDetailFinished} onCancel={handleDetailCancel}/>

        </Drawer>
    )
}

export default UserSelector