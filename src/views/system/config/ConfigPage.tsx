import {Button, GetProp, Popconfirm, Popover, Row, Space, Table, TableProps, Tag,} from "antd";
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
    TableOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";


import * as configService from "@/service/system/config-service.ts";

import type {FilterValue, SorterResult, TableCurrentDataSource} from "antd/es/table/interface";
import ColumnSelector from "@/views/system/components/ColumnSelector.tsx";
import SeqColRender from "@/views/system/components/SeqColRender.tsx";
import {ColumnsType} from "antd/es/table";
import ConfigForm from "@/views/system/config/ConfigForm.tsx";
import ConfigSearch from "@/views/system/config/components/ConfigSearch.tsx";
import {Config, ConfigQueryForm} from "@/models/system/config-model.ts";



type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
//编历map时是按插入顺序遍历
type Sorts = Map<React.Key,'ascend'|'descend'>



const EnabledColRender = (isBuiltIn: boolean)=>{
    return isBuiltIn?<Tag color="green">是</Tag>:<Tag color="default">否</Tag>
}



const  ConfigPage= () =>{


    //===========================base ==================================================================/

    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [toggleSearch, setToggleSearch] = useState(true)


    const [dataSource, setDataSource] = useState<Config[]>([])
    const [searchParams,setSearchParams] = useState<ConfigQueryForm>({
        pageNum:1,
        pageSize:10,
    })
    const searchParamsRef = useRef<ConfigQueryForm>()
    searchParamsRef.current = searchParams;
    const selectedRowKeysRef = useRef<number[]>();
    selectedRowKeysRef.current = selectedRowKeys
    const fetchData = () => {
        setTableLoading(true)
        configService.queryConfig(searchParams).then(resp => {
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
        onChange: (selectedRowKeys: React.Key[], selectedRows: Config[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys as number[])
        },
        getCheckboxProps: (record: Config) => ({
            disabled: false,
            name: record.configId,
        }),
    };





    useEffect(() => {
        fetchData()
    }, [searchParams]);


    //=========== CURD ==============================================================================

    const handleDelete=(configIds:number[])=>{
        console.log("delete:",configIds)
        setTableLoading(true)
        configService.deleteConfig(configIds).then(() => {
            setSearchParams({...searchParamsRef.current,pageNum:1} as never)
            // //删除selectedKey
            // const keys = selectedRowKeysRef.current?.filter(d=>!configIds.includes(d))
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

    const handleColumnSelected = (columns: ColumnsType<Config>):void=>{
        console.log("new columns:",columns);
        setTableColumns(columns);
    }
    //===============================================================================================




    const OperColRender = (_: string, config: Config) => {

        return (
            <Space size="middle">
                <a key="edit" title="编辑"
                   onClick={() => setConfigFormProp({open:true,configId:config.configId})}><FormOutlined/></a>
                <Popconfirm
                    placement="top"
                    title="确认删除"
                    description={"确定要删除字典【" + config.configName + "】吗？"}
                    onConfirm={() => handleDelete([config.configId])}
                    okText="是"
                    cancelText="否"
                >
                    <a key="delete" title="删除字典"><DeleteOutlined/></a>
                </Popconfirm>

            </Space>
        )

    }
    const columns:ColumnsType<Config> = [
        {
            title: "序号",
            dataIndex: "configId",
            key: "configId",
            align: "center",
            width: 100,
            fixed: "left",
            render: SeqColRender,
        },
        {
            title: "参数名称",
            dataIndex: "configName",
            key: "configName",
            align: "center",
            fixed: "left",
            sorter: {multiple: 1}
        },
        {title: "参数键名", dataIndex: "configKey", key: "configKey", align: "center", sorter: {multiple: 2}},
        {title: "参数键值", dataIndex: "configValue", key: "configValue", align: "center", sorter: {multiple: 2},ellipsis:true},
        {title: "系统内置", dataIndex: "isBuiltIn", key: "isBuiltIn", align: "center", width: 80, render: EnabledColRender,sorter: {multiple: 3}},
        {title: "备注", dataIndex: "remark", key: "remark", align: "center", width: 150,sorter: {multiple: 4}},
        {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: "center",sorter: {multiple: 5}},
        {title: "操作", fixed: "right", align: "center", width: 120, key: "action", render: OperColRender}
    ];

    const [tableColumns,setTableColumns] = useState<ColumnsType<Config>>(columns );


    const sort2Str = (sorts:Sorts):string=>{
        let sortStr = "";
        sorts.forEach((value,key)=>{
            sortStr+=","+ key + ("descend" == value?".desc":".asc")
        })
        return sortStr.substring(1);
    }


    const handleTableChange = (pagination: TablePaginationConfig, __: Record<string, FilterValue | null>, sorter: SorterResult<Config> | SorterResult<Config>[], extra: TableCurrentDataSource<Config>) => {

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
    const [configFormProp,setConfigFormProp] = useState<{open:boolean,configId:number|undefined}>({
        open:false,
        configId:undefined,
    });

    const handleDetailFinished=()=>{
        setConfigFormProp({open:false,configId:undefined});
        fetchData();
    }
    const handleDetailCancel=()=>{
        setConfigFormProp({open:false,configId:undefined})
    }

    //============================================================================
    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row className={toggleSearch ? "" : "hidden"}>
                    <ConfigSearch onFinish={handleSearch} onReset={handleResetSearch}/>
                </Row>
                <Row>
                    <Space>
                        <Button type="primary" className="btn-blue" onClick={()=>setConfigFormProp({open:true,configId:undefined})}
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
                        <Button type="primary" className="btn-green"   onClick={handleUpload}
                                icon={<CloudUploadOutlined />}>导入</Button>
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
                        rowKey="configId"
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

            <ConfigForm open={configFormProp.open} configId={configFormProp.configId} onFinished={handleDetailFinished} onCancel={handleDetailCancel}/>

        </>
    )
}

export default ConfigPage