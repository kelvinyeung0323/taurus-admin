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


import * as noticeService from "@/service/system/notice-service.ts";

import type {FilterValue, SorterResult, TableCurrentDataSource} from "antd/es/table/interface";
import ColumnSelector from "@/views/system/components/ColumnSelector.tsx";
import SeqColRender from "@/views/system/components/SeqColRender.tsx";
import {ColumnsType} from "antd/es/table";
import NoticeForm from "@/views/system/notice/NoticeForm.tsx";
import NoticeSearch from "@/views/system/notice/components/NoticeSearch.tsx";
import {Notice, NoticeQuery} from "@/models/system/notice-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";



type TablePaginationNotice = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
//编历map时是按插入顺序遍历
type Sorts = Map<React.Key,'ascend'|'descend'>







const  NoticePage= () =>{


    //===========================base ==================================================================/

    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');

    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [toggleSearch, setToggleSearch] = useState(true)


    const [dataSource, setDataSource] = useState<Notice[]>([])
    const [searchParams,setSearchParams] = useState<NoticeQuery>({
        pageNum:1,
        pageSize:10,
    })
    const searchParamsRef = useRef<NoticeQuery>()
    searchParamsRef.current = searchParams;
    const selectedRowKeysRef = useRef<number[]>();
    selectedRowKeysRef.current = selectedRowKeys;



    const fetchData = () => {
        setTableLoading(true)
        noticeService.queryNoticeList(searchParams).then(resp => {
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
        onChange: (selectedRowKeys: React.Key[], selectedRows: Notice[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys as number[])
        },
        getCheckboxProps: (record: Notice) => ({
            disabled: false,
            name: record.noticeId,
        }),
    };





    useEffect(() => {
        fetchData()
    }, [searchParams]);


    //=========== CURD ==============================================================================

    const handleDelete=(noticeIds:number[])=>{
        console.log("delete:",noticeIds)
        setTableLoading(true)
        noticeService.deleteNotice(noticeIds).then(() => {
            setSearchParams({...searchParamsRef.current,pageNum:1} as never)
            // //删除selectedKey
            // const keys = selectedRowKeysRef.current?.filter(d=>!noticeIds.includes(d))
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

    const handleColumnSelected = (columns: ColumnsType<Notice>):void=>{
        console.log("new columns:",columns);
        setTableColumns(columns);
    }
    //===============================================================================================


    const {dictLabels} = useDictContext();

    const NoticeTypeColRender = (itemValue: string)=>{
        const item = dictLabels.get("sys_notice_type")?.get(itemValue)
        return <Tag color={item.listClass??"processing"}>{item.itemLabel??itemValue}</Tag>
    }
    const NoticeStatusColRender = (itemValue: string)=>{
        const item = dictLabels.get("sys_notice_status")?.get(itemValue)
        console.log("itemValue",itemValue,"item",item,"label",item.itemLabel)
        return <Tag color={item.listClass??"processing"}>{item.itemLabel??itemValue}</Tag>
    }
    const OperColRender = (_: string, notice: Notice) => {

        return (
            <Space size="middle">
                <a key="edit" title="编辑"
                   onClick={() => setNoticeFormProp({open:true,noticeId:notice.noticeId})}><FormOutlined/></a>
                <Popconfirm
                    placement="top"
                    title="确认删除"
                    description={"确定要删除通知【" + notice.noticeTitle + "】吗？"}
                    onConfirm={() => handleDelete([notice.noticeId])}
                    okText="是"
                    cancelText="否"
                >
                    <a key="delete" title="删除字典"><DeleteOutlined/></a>
                </Popconfirm>

            </Space>
        )

    }
    const columns:ColumnsType<Notice> = [
        {
            title: "序号",
            dataIndex: "noticeId",
            key: "noticeId",
            align: "center",
            width: 100,
            fixed: "left",
            render: SeqColRender,
        },
        {
            title: "标题",
            dataIndex: "noticeTitle",
            key: "noticeTitle",
            align: "center",
            fixed: "left",
            sorter: {multiple: 1}
        },
        {title: "类型", dataIndex: "noticeType", key: "noticeType", align: "center", sorter: {multiple: 2},render:NoticeTypeColRender},
        {title: "状态", dataIndex: "status", key: "status", align: "center", sorter: {multiple: 3},render:NoticeStatusColRender},
        {title: "创建者", dataIndex: "createdBy", key: "createdBy", align: "center",sorter: {multiple: 4}},
        {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: "center",sorter: {multiple: 5}},
        {title: "操作", fixed: "right", align: "center", width: 120, key: "action", render: OperColRender}
    ];

    const [tableColumns,setTableColumns] = useState<ColumnsType<Notice>>(columns );


    const sort2Str = (sorts:Sorts):string=>{
        let sortStr = "";
        sorts.forEach((value,key)=>{
            sortStr+=","+ key + ("descend" == value?".desc":".asc")
        })
        return sortStr.substring(1);
    }


    const handleTableChange = (pagination: TablePaginationNotice, __: Record<string, FilterValue | null>, sorter: SorterResult<Notice> | SorterResult<Notice>[], extra: TableCurrentDataSource<Notice>) => {

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
    const [noticeFormProp,setNoticeFormProp] = useState<{open:boolean,noticeId:number|undefined}>({
        open:false,
        noticeId:undefined,
    });

    const handleDetailFinished=()=>{
        setNoticeFormProp({open:false,noticeId:undefined});
        fetchData();
    }
    const handleDetailCancel=()=>{
        setNoticeFormProp({open:false,noticeId:undefined})
    }

    //============================================================================
    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row className={toggleSearch ? "" : "hidden"}>
                    <NoticeSearch onFinish={handleSearch} onReset={handleResetSearch}/>
                </Row>
                <Row>
                    <Space>
                        <Button type="primary" className="btn-blue" onClick={()=>setNoticeFormProp({open:true,noticeId:undefined})}
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
                        rowKey="noticeId"
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

            <NoticeForm open={noticeFormProp.open} noticeId={noticeFormProp.noticeId} onFinished={handleDetailFinished} onCancel={handleDetailCancel}/>

        </>
    )
}

export default NoticePage