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


import * as dictService from "@/service/system/dict-service.ts";

import type {FilterValue, SorterResult, TableCurrentDataSource} from "antd/es/table/interface";
import ColumnSelector from "@/views/system/components/ColumnSelector.tsx";
import SeqColRender from "@/views/system/components/SeqColRender.tsx";
import {ColumnsType} from "antd/es/table";
import DictForm from "@/views/system/dict/DictForm.tsx";
import DictSearch from "@/views/system/dict/components/DictSearch.tsx";
import {Dict, DictQueryForm} from "@/models/system/dict-model.ts";
import DictItemPage from "@/views/system/dict/DictItemPage.tsx";


type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
//编历map时是按插入顺序遍历
type Sorts = Map<React.Key,'ascend'|'descend'>



const EnabledColRender = (disabled: boolean)=>{
        return disabled?<Tag color="default">停用</Tag>:<Tag color="green">正常</Tag>
}



const  DictPage= () =>{


    //===========================base ==================================================================/

    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [toggleSearch, setToggleSearch] = useState(true)


    const [dataSource, setDataSource] = useState<Dict[]>([])
    const [searchParams,setSearchParams] = useState<DictQueryForm>({
        pageNum:1,
        pageSize:10,
    })
    const searchParamsRef = useRef<DictQueryForm>()
    searchParamsRef.current = searchParams;
    const selectedRowKeysRef = useRef<number[]>();
    selectedRowKeysRef.current = selectedRowKeys
    const fetchData = () => {
        setTableLoading(true)
        dictService.queryDictList(searchParams).then(resp => {
            console.log("data", resp)
            if (resp.data) {
                setDataSource(resp.data)
                setCurrentPage(resp.pageNum || 1)
                setTotal(resp.total || 0)
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
        onChange: (selectedRowKeys: React.Key[], selectedRows: Dict[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys as number[])
        },
        getCheckboxProps: (record: Dict) => ({
            disabled: false,
            name: record.dictId,
        }),
    };





    useEffect(() => {
        fetchData()
    }, [searchParams]);


    //=========== CURD ==============================================================================

    const handleDelete=(dictIds:number[])=>{
        console.log("delete:",dictIds)
        setTableLoading(true)
        dictService.deleteDict(dictIds).then(() => {
            setSearchParams({...searchParamsRef.current,pageNum:1} as never)
          //   //删除selectedKey
          //   const keys = selectedRowKeysRef.current?.filter(d=>!dictIds.includes(d))
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

    const handleColumnSelected = (columns: ColumnsType<Dict>):void=>{
        console.log("new columns:",columns);
        setTableColumns(columns);
    }
    //===============================================================================================




    const OperColRender = (_: string, dict: Dict) => {

            return (
                <Space size="middle">
                    <a key="edit" title="编辑"
                       onClick={() => setDictFormProp({open:true,dictId:dict.dictId})}><FormOutlined/></a>
                    <a key="list" title="列表"
                       onClick={() => setDictItemProps({open:true,dictId:dict.dictId,dictName:dict.dictName})}><UnorderedListOutlined /></a>
                    <Popconfirm
                        placement="top"
                        title="确认删除"
                        description={"确定要删除字典【" + dict.dictName + "】吗？"}
                        onConfirm={() => handleDelete([dict.dictId])}
                        okText="是"
                        cancelText="否"
                    >
                        <a key="delete" title="删除字典"><DeleteOutlined/></a>
                    </Popconfirm>

                </Space>
            )

    }
    const columns:ColumnsType<Dict> = [
        {
            title: "序号",
            dataIndex: "dictId",
            key: "dictId",
            align: "center",
            width: 100,
            fixed: "left",
            render: SeqColRender,
        },
        {
            title: "字典名称",
            dataIndex: "dictName",
            key: "dictName",
            align: "center",
            fixed: "left",
            sorter: {multiple: 1}
        },
        {title: "字典编码", dataIndex: "dictCode", key: "dictCode", align: "center", sorter: {multiple: 2}},
        {title: "状态", dataIndex: "disabled", key: "disabled", align: "center", width: 80, render: EnabledColRender,sorter: {multiple: 3}},
        {title: "备注", dataIndex: "remark", key: "remark", align: "center", width: 150,sorter: {multiple: 4}},
        {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: "center",sorter: {multiple: 5}},
        {title: "操作", fixed: "right", align: "center", width: 120, key: "action", render: OperColRender}
    ];

    const [tableColumns,setTableColumns] = useState<ColumnsType<Dict>>(columns );


    const sort2Str = (sorts:Sorts):string=>{
        let sortStr = "";
        sorts.forEach((value,key)=>{
            sortStr+=","+ key + ("descend" == value?".desc":".asc")
        })
        return sortStr.substring(1);
    }


    const handleTableChange = (pagination: TablePaginationConfig, __: Record<string, FilterValue | null>, sorter: SorterResult<Dict> | SorterResult<Dict>[], extra: TableCurrentDataSource<Dict>) => {

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
    const [dictFormProp,setDictFormProp] = useState<{open:boolean,dictId:number|undefined}>({
        open:false,
        dictId:undefined,
    });

    const handleDetailFinished=()=>{
        setDictFormProp({open:false,dictId:undefined});
        fetchData();
    }
    const handleDetailCancel=()=>{
        setDictFormProp({open:false,dictId:undefined})
    }

    //==============================================================================


    //==========字典项=====================================================================
    const [dictItemProps,setDictItemProps] = useState<{open:boolean,dictId:number|undefined,dictName:string|undefined}>({
        open:false,
        dictId:undefined,
        dictName:""
    })
    //============================================================================
    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row className={toggleSearch ? "" : "hidden"}>
                    <DictSearch onFinish={handleSearch} onReset={handleResetSearch}/>
                </Row>
                <Row>
                    <Space>
                        <Button type="primary" className="btn-blue" onClick={()=>setDictFormProp({open:true,dictId:undefined})}
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
                        rowKey="dictId"
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

            <DictForm open={dictFormProp.open} dictId={dictFormProp.dictId} onFinished={handleDetailFinished} onCancel={handleDetailCancel}/>
            <DictItemPage open={dictItemProps.open} dictId={dictItemProps.dictId} dictName={dictItemProps.dictName} onCancel={()=>setDictItemProps({open:false,dictId:undefined,dictName:dictItemProps.dictName}) }/>
        </>
    )
}

export default DictPage