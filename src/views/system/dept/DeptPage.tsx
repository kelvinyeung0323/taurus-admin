import {Button, GetProp, Popconfirm, Popover, Row, Space, Table, TableProps, Tag,} from "antd";
import {
    DeleteOutlined,
    FormOutlined,
     NodeCollapseOutlined,
    PlusOutlined,
    ProfileOutlined,
    SearchOutlined,
    SyncOutlined,
    TableOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";


import * as deptService from "@/service/system/dept-service.ts";

import type {FilterValue, SorterResult, TableCurrentDataSource} from "antd/es/table/interface";
import ColumnSelector from "@/views/system/components/ColumnSelector.tsx";
import {ColumnsType} from "antd/es/table";
import DeptForm from "@/views/system/dept/DeptForm.tsx";
import DeptSearch from "@/views/system/dept/components/DeptSearch.tsx";
import {Dept, DeptQuery} from "@/models/system/dept-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";



type TablePaginationDept = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
//编历map时是按插入顺序遍历
type Sorts = Map<React.Key,'ascend'|'descend'>


function getAllIds(depts :Dept[]):string[]{
    const arr:string[] = []
    depts.forEach(dept=>{
        arr.push(dept.deptId)
        if (dept.children) {
            const c= getAllIds(dept.children);
            arr.push(...c)
        }
    })
    return arr
}
const  DeptPage= () =>{


    //===========================base ==================================================================/



    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [tableLoading, setTableLoading] = useState(false)

    const [toggleSearch, setToggleSearch] = useState(true)
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    const [dataSource, setDataSource] = useState<Dept[]>([])
    const [searchParams,setSearchParams] = useState<DeptQuery>({})
    const searchParamsRef = useRef<DeptQuery>()
    searchParamsRef.current = searchParams;
    const selectedRowKeysRef = useRef<number[]>();
    selectedRowKeysRef.current = selectedRowKeys;



    const fetchData = () => {
        setTableLoading(true)
        deptService.queryDeptList(searchParams).then(resp => {
            if (resp.data) {
                setDataSource(resp.data)
                // setTotal(resp.total || 0)
                //测除selectedRoleKeys
                setSelectedRowKeys([])
            }

        }).finally(() => setTableLoading(false))
    }



    const handleExpandAllRows = () => {
        if (expandedRowKeys.length >0){
            setExpandedRowKeys([])
        }else {
            setExpandedRowKeys(getAllIds(dataSource));
        }

    };

    const handleSearch = (value:any)=>{
        console.log("search")
        setSearchParams({
            ...searchParams,
            ...value
        })
    }
    const handleResetSearch = () => {
        const newColumn =  tableColumns.map(e=>
        {
            return e;
        })
        setTableColumns(newColumn);
        setSearchParams({})
    }





    useEffect(() => {
        fetchData()
    }, [searchParams]);

    useEffect(() => {
        if(expandedRowKeys.length==0){
            setExpandedRowKeys(getAllIds(dataSource));
        }
    }, [dataSource]);
    //=========== CURD ==============================================================================

    const handleDelete=(deptIds:number[])=>{
        console.log("delete:",deptIds)
        setTableLoading(true)
        deptService.deleteDept(deptIds).then(() => {
            setSearchParams({...searchParamsRef.current} as never)
            // //删除selectedKey
            // const keys = selectedRowKeysRef.current?.filter(d=>!deptIds.includes(d))
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

    const handleColumnSelected = (columns: ColumnsType<Dept>):void=>{
        console.log("new columns:",columns);
        setTableColumns(columns);
    }
    //===============================================================================================


    const {dictLabels} = useDictContext();


    const DeptStatusColRender = (itemValue: string)=>{
        const item = dictLabels.get("sys_normal_disable")?.get(itemValue)
        return <Tag color={item.listClass??"processing"}>{item.itemLabel??itemValue}</Tag>
    }
    const OperColRender = (_: string, dept: Dept) => {

        return (
            <Space size="middle">
                <a key="edit" title="编辑"
                   onClick={() => setDeptFormProp({open:true,deptId:dept.deptId})}><FormOutlined/></a>
                <a key="new" title="新增"
                   onClick={() => setDeptFormProp({open:true,deptId:undefined,parentId:dept.deptId})}><PlusSquareOutlined /></a>


                {dept.deptId != 100?
                    (
                        <Popconfirm
                            placement="top"
                            title="确认删除"
                            description={"确定要删除部门【" + dept.deptName + "】吗？"}
                            onConfirm={() => handleDelete([dept.deptId])}
                            okText="是"
                            cancelText="否"
                        >
                            <a key="delete" title="删除字典"><DeleteOutlined/></a>
                        </Popconfirm>
                    ):null
                }


            </Space>
        )

    }
    const columns:ColumnsType<Dept> = [
        {
            title: "部门名称",
            dataIndex: "deptName",
            key: "deptName",
            align: "left",
            fixed: "left",
        },
        {title: "排序", dataIndex: "orderNum", key: "orderNum", align: "center",},
        {title: "状态", dataIndex: "status", key: "status", align: "center",render:DeptStatusColRender},
        {title: "创建时间", dataIndex: "createdAt", key: "createdAt", align: "center"},
        {title: "操作", fixed: "right", align: "left", width: 120, key: "action", render: OperColRender}
    ];

    const [tableColumns,setTableColumns] = useState<ColumnsType<Dept>>(columns );




    const handleTableChange = (pagination: TablePaginationDept, __: Record<string, FilterValue | null>, sorter: SorterResult<Dept> | SorterResult<Dept>[], extra: TableCurrentDataSource<Dept>) => {

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

        })



    }


    //=========编辑=================================================================
    const [deptFormProp,setDeptFormProp] = useState<{open:boolean,deptId:number|undefined,parentId:number|undefined}>({
        open:false,
        deptId:undefined,
        parentId:undefined,
    });

    const handleDetailFinished=()=>{
        setDeptFormProp({open:false,deptId:undefined});
        fetchData();
    }
    const handleDetailCancel=()=>{
        setDeptFormProp({open:false,deptId:undefined})
    }

    //============================================================================
    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row className={toggleSearch ? "" : "hidden"}>
                    <DeptSearch onFinish={handleSearch} onReset={handleResetSearch}/>
                </Row>
                <Row>
                    <Space>
                        <Button type="primary" className="btn-blue" onClick={()=>setDeptFormProp({open:true,deptId:undefined,parentId:100})}
                                icon={<PlusOutlined/>}>新增</Button>
                        <Button type="primary"  className="btn-orange" onClick={handleExpandAllRows}
                                icon={<NodeCollapseOutlined/>}>展开/折叠</Button>

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
                        rowKey="deptId"
                        size="middle"
                        tableLayout="fixed"
                        loading={tableLoading}
                        dataSource={dataSource}
                        columns={tableColumns}
                        showSorterTooltip={true}
                        pagination={false}
                        sortDirections={['ascend', 'descend']}
                        indentSize={10}
                        onChange={handleTableChange}
                        expandable={{
                            expandedRowKeys:expandedRowKeys,
                            onExpand:(expanded,r)=>{
                                if(expanded){
                                    const exp = [...expandedRowKeys,r.deptId]
                                    setExpandedRowKeys(exp)
                                }else{
                                    setExpandedRowKeys( expandedRowKeys.filter(e=>e!=r.deptId))

                                }

                            },


                        }}
                    />
                </Row>
            </Space>

            <DeptForm open={deptFormProp.open} deptId={deptFormProp.deptId} parentId={deptFormProp.parentId} onFinished={handleDetailFinished} onCancel={handleDetailCancel}/>

        </>
    )
}

export default DeptPage