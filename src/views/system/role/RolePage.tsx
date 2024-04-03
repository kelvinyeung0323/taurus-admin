import {Button, GetProp, message, Popconfirm, Popover, Row, Space, Switch, Table, TableProps, Tag,} from "antd";
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
    TableOutlined, UsergroupAddOutlined,
} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";


import * as roleService from "@/service/system/role-service.ts";

import type {FilterValue, SorterResult, TableCurrentDataSource} from "antd/es/table/interface";
import ColumnSelector from "@/views/system/components/ColumnSelector.tsx";
import SeqColRender from "@/views/system/components/SeqColRender.tsx";
import {ColumnsType} from "antd/es/table";
import RoleForm from "@/views/system/role/RoleForm.tsx";
import RoleSearch from "@/views/system/role/components/RoleSearch.tsx";
import {Role, RoleQueryForm} from "@/models/system/role-model.ts";
import RoleUserSelect from "@/views/system/role/bak/RoleUserSelect.tsx";
import RoleUserPage from "@/views/system/role/RoleUserPage.tsx";



type TablePaginationRole = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
//编历map时是按插入顺序遍历
type Sorts = Map<React.Key,'ascend'|'descend'>






const  RolePage= () =>{


    //===========================base ==================================================================/

    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [toggleSearch, setToggleSearch] = useState(true)


    const [dataSource, setDataSource] = useState<Role[]>([])
    const [searchParams,setSearchParams] = useState<RoleQueryForm>({
        pageNum:1,
        pageSize:10,
    })
    const searchParamsRef = useRef<RoleQueryForm>()
    searchParamsRef.current = searchParams;
    const selectedRowKeysRef = useRef<number[]>();
    selectedRowKeysRef.current = selectedRowKeys
    const fetchData = () => {
        setTableLoading(true)
        roleService.queryRole(searchParams).then(resp => {
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
            pageNum: 1,
            pageSize: 10,
        })
    }


    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: Role[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys as number[])
        },
        getCheckboxProps: (record: Role) => ({
            disabled: false,
            name: record.roleId,
        }),
    };





    useEffect(() => {
        fetchData()
    }, [searchParams]);


    //=========== CURD ==============================================================================

    const handleDelete=(roleIds:number[])=>{
        console.log("delete:",roleIds)
        setTableLoading(true)
        roleService.deleteRole(roleIds).then(() => {
            setSearchParams({...searchParamsRef.current,pageNum:1} as never)
            // //删除selectedKey
            // const keys = selectedRowKeysRef.current?.filter(d=>!roleIds.includes(d))
            // setSelectedRowKeys(keys??[])
        }).finally(() => setTableLoading(false))
    }

    const handleUpload=()=>{

    }

    const handleDownload =()=>{

    }

    const handleSyncData = ()=>{
        setSearchParams({...searchParams})
    }

    const handleColumnSelected = (columns: ColumnsType<Role>):void=>{
        console.log("new columns:",columns);
        setTableColumns(columns);
    }
    //===============================================================================================


    const handleStatusChange=(roleId:number,disabled:boolean)=>{
        setTableLoading(true);
        roleService.switchRoleStatus(roleId,disabled).then(()=>{
            setSearchParams({...searchParamsRef.current,pageNum:1} as never)
        }).finally(()=>setTableLoading(false))
    }
    const EnabledColRender = (disabled: boolean,role:Role)=>{
        return <Switch value={!disabled} onChange={(val)=>handleStatusChange(role.roleId,!val)} key={1}/>
    }

    const OperColRender = (_: string, role: Role) => {

        return (
            <Space size="middle">
                <a key="edit" title="编辑"
                   onClick={() => setRoleFormProp({open:true,roleId:role.roleId})}><FormOutlined/></a>
                <Popconfirm
                    placement="top"
                    title="确认删除"
                    description={"确定要删除字典【" + role.roleName + "】吗？"}
                    onConfirm={() => handleDelete([role.roleId])}
                    okText="是"
                    cancelText="否"
                >
                    <a key="delete" title="删除字典"><DeleteOutlined/></a>
                </Popconfirm>
                <a key="arrange" title="分配用户"
                   onClick={() => setRoleUserPageProps({open:true,roleId:role.roleId,roleName:role.roleName})}><UsergroupAddOutlined/></a>
            </Space>
        )

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
            title: "角色名称",
            dataIndex: "roleName",
            key: "roleName",
            align: "center",
            fixed: "left",
            sorter: {multiple: 1}
        },
        {title: "角色编码", dataIndex: "roleCode", key: "roleCode", align: "center", sorter: {multiple: 2}},
        // {title: "数据权限", dataIndex: "roleValue", key: "roleValue", align: "center", sorter: {multiple: 2},ellipsis:true},
        {title: "角色状态", dataIndex: "disabled", key: "disabled", align: "center", width: 100, render: EnabledColRender,sorter: {multiple: 3}},
        {title: "显示顺序", dataIndex: "sortNum", key: "sortNum", align: "center", width: 150,sorter: {multiple: 4}},
        {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: "center",sorter: {multiple: 5}},
        {title: "操作", fixed: "right", align: "center", width: 120, key: "action", render: OperColRender}
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
    const [roleFormProp,setRoleFormProp] = useState<{open:boolean,roleId:number|undefined,roleName:roleName}>({
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

    //============================================================================


    //=========================role use page====================================================
    const [roleUserPageProps,setRoleUserPageProps] = useState<{open:boolean,roleId:number,roleName:string|undefined}>({open:false})
    const handleUserPageClose =()=>{
          setRoleUserPageProps({...roleUserPageProps,open:false,roleId:undefined,roleName:""})
    }




    //===============================================================================
    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row className={toggleSearch ? "" : "hidden"}>
                    <RoleSearch onFinish={handleSearch} onReset={handleResetSearch}/>
                </Row>
                <Row>
                    <Space>
                        <Button type="primary" className="btn-blue" onClick={()=>setRoleFormProp({open:true,roleId:undefined})}
                                icon={<PlusOutlined/>}>新增</Button>
                        <Popconfirm
                            placement="top"
                            title="确认删除"
                            disabled={selectedRowKeys.length <= 0}
                            description={"确定要删除" + selectedRowKeys.length + "个字典数据吗？"}
                            onConfirm={()=>handleDelete(selectedRowKeys)}
                            okText="是"
                            cancelText="否"
                        >
                            <Button type="primary" className="btn-red"  icon={<MinusOutlined/>}
                                    disabled={selectedRowKeys.length <= 0}>删除</Button>
                        </Popconfirm>
                        {/*<Button type="primary" className="btn-green"   onClick={handleUpload}*/}
                        {/*        icon={<CloudUploadOutlined />}>导入</Button>*/}
                        <Button type="link" className="btn-orange"  onClick={handleDownload}
                                icon={<CloudDownloadOutlined />}>导出</Button>

                    </Space>
                    <div className="flext absolute right-12">
                        <Button size="small" type="link"
                                onClick={() => setToggleSearch(!toggleSearch)}><SearchOutlined/></Button>
                        <Button size="small" type="link" onClick={handleSyncData}><SyncOutlined/></Button>
                        <Button size="small" type="link"><ProfileOutlined/></Button>
                        <Popover content={<ColumnSelector columns={columns as never} onChange={handleColumnSelected as never}/>} trigger="click">
                            <Button size="small" type="link"><TableOutlined/></Button>
                        </Popover>
                    </div>
                </Row>
                <Row>
                    <Table
                        style={{width: "100%"}}
                        scroll={{x: 1000}}
                        rowKey="roleId"
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

            <RoleForm open={roleFormProp.open} roleId={roleFormProp.roleId}  onFinished={handleDetailFinished} onCancel={handleDetailCancel}/>
            <RoleUserPage open={roleUserPageProps.open} roleId={roleUserPageProps.roleId}  roleName={roleUserPageProps.roleName} onCancel={handleUserPageClose}/>
        </>
    )
}

export default RolePage