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


import * as resService from "@/service/system/res-service.ts";

import type {FilterValue, SorterResult, TableCurrentDataSource} from "antd/es/table/interface";
import ColumnSelector from "@/views/system/components/ColumnSelector.tsx";
import {ColumnsType} from "antd/es/table";
import ResForm from "@/views/system/res/ResForm.tsx";
import ResSearch from "@/views/system/res/components/ResSearch.tsx";
import {Res, ResQuery} from "@/models/system/res-model.ts";
import {useDictContext} from "@/store/dict-context.tsx";


type TablePaginationRes = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
//编历map时是按插入顺序遍历
type Sorts = Map<React.Key, 'ascend' | 'descend'>


function getAllIds(ress: Res[]): string[] {
    const arr: string[] = []
    ress.forEach(res => {
        arr.push(res.resId)
        if (res.children) {
            const c = getAllIds(res.children);
            arr.push(...c)
        }
    })
    return arr
}

const ResPage = () => {


    //===========================base ==================================================================/


    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [tableLoading, setTableLoading] = useState(false)

    const [toggleSearch, setToggleSearch] = useState(true)
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    const [dataSource, setDataSource] = useState<Res[]>([])
    const [searchParams, setSearchParams] = useState<ResQuery>({})
    const searchParamsRef = useRef<ResQuery>()
    searchParamsRef.current = searchParams;
    const selectedRowKeysRef = useRef<number[]>();
    selectedRowKeysRef.current = selectedRowKeys;


    const fetchData = () => {
        setTableLoading(true)
        resService.queryResList(searchParams).then(resp => {
            if (resp.data) {
                setDataSource(resp.data)
                //测除selectedRoleKeys
                setSelectedRowKeys([])
            }

        }).finally(() => setTableLoading(false))
    }


    const handleExpandAllRows = () => {
        if (expandedRowKeys.length > 0) {
            setExpandedRowKeys([])
        } else {
            setExpandedRowKeys(getAllIds(dataSource));
        }

    };

    const handleSearch = (value: any) => {
        console.log("search")
        setSearchParams({
            ...searchParams,
            ...value
        })
    }
    const handleResetSearch = () => {
        const newColumn = tableColumns.map(e => {
            return e;
        })
        setTableColumns(newColumn);
        setSearchParams({})
    }


    useEffect(() => {
        fetchData()
    }, [searchParams]);

    useEffect(() => {
        if (expandedRowKeys.length == 0) {
            setExpandedRowKeys(getAllIds(dataSource));
        }
    }, [dataSource]);
    //=========== CURD ==============================================================================

    const handleDelete = (resIds: number[]) => {
        console.log("delete:", resIds)
        setTableLoading(true)
        resService.deleteRes(resIds).then(() => {
            setSearchParams({...searchParamsRef.current} as never)
            // //删除selectedKey
            // const keys = selectedRowKeysRef.current?.filter(d=>!resIds.includes(d))
            // setSelectedRowKeys(keys??[])
        }).finally(() => setTableLoading(false))
    }

    const handleUpload = () => {

    }

    const handleDownload = () => {

    }

    const handleSyncData = () => {
        setSearchParams({...searchParams})
    }

    const handleColumnSelected = (columns: ColumnsType<Res>): void => {
        console.log("new columns:", columns);
        setTableColumns(columns);
    }
    //===============================================================================================


    const {dictLabels} = useDictContext();


    const ResStatusColRender = (itemValue: string) => {
        const item = dictLabels.get("sys_normal_disable")?.get(itemValue)
        return <Tag color={item.listClass ?? "processing"}>{item.itemLabel ?? itemValue}</Tag>
    }
    const ResTypeColRender = (itemValue: string) => {
        switch (itemValue) {
            case "C":
                return <Tag color={"processing"}>目录</Tag>;
            case "F":
                return <Tag color={"warning"}>按钮</Tag>
            case "M":
                return <Tag color={"success"}>菜单</Tag>
            default:
                return <Tag color={"default"}>未知</Tag>
        }

    }
    const ResVisibleColRender = (itemValue: boolean) => {
     return  itemValue?<Tag color={"success"}>显示</Tag>:<Tag color={"default"}>-</Tag>;
    }
    const OperColRender = (_: string, res: Res) => {

        return (
            <Space size="middle">
                <a key="edit" title="编辑"
                   onClick={() => setResFormProp({open: true, resId: res.resId})}><FormOutlined/></a>
                <a key="new" title="新增"
                   onClick={() => setResFormProp({open: true, resId: undefined, parentId: res.resId})}><PlusSquareOutlined/></a>
                <Popconfirm
                    placement="top"
                    title="确认删除"
                    description={"确定要删除部门【" + res.resName + "】吗？"}
                    onConfirm={() => handleDelete([res.resId])}
                    okText="是"
                    cancelText="否"
                >
                    <a key="delete" title="删除字典"><DeleteOutlined/></a>
                </Popconfirm>

            </Space>
        )

    }
    const columns: ColumnsType<Res> = [
        {
            title: "菜单名称",
            dataIndex: "resName",
            key: "resName",
            align: "left",
            fixed: "left",
        },
        {title: "排序", dataIndex: "sort", key: "sort", align: "center",},
        {title: "请求地址", dataIndex: "path", key: "path", align: "center",},
        {title: "类型", dataIndex: "resType", key: "resType", align: "center", render: ResTypeColRender},
        {title: "可见", dataIndex: "visible", key: "visible", align: "center", render:ResVisibleColRender},
        {title: "权限标识", dataIndex: "authCode", key: "authCode", align: "center",},
        {title: "操作", fixed: "right", align: "center", width: 120, key: "action", render: OperColRender}
    ];

    const [tableColumns, setTableColumns] = useState<ColumnsType<Res>>(columns);


    const handleTableChange = (pagination: TablePaginationRes, __: Record<string, FilterValue | null>, sorter: SorterResult<Res> | SorterResult<Res>[], extra: TableCurrentDataSource<Res>) => {

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

        }


        setSearchParams({
            ...searchParams,
            sort: sort2Str(sorts),

        })


    }


    //=========编辑=================================================================
    const [resFormProp, setResFormProp] = useState<{ open: boolean, resId: number | undefined, parentId: number | undefined }>({
        open: false,
        resId: undefined,
        parentId: undefined,
    });

    const handleDetailFinished = () => {
        setResFormProp({open: false, resId: undefined});
        fetchData();
    }
    const handleDetailCancel = () => {
        setResFormProp({open: false, resId: undefined})
    }

    //============================================================================
    return (
        <>
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                <Row className={toggleSearch ? "" : "hidden"}>
                    <ResSearch onFinish={handleSearch} onReset={handleResetSearch}/>
                </Row>
                <Row>
                    <Space>
                        <Button type="primary" className="btn-blue"
                                onClick={() => setResFormProp({open: true, resId: undefined})}
                                icon={<PlusOutlined/>}>新增</Button>
                        <Button type="primary" className="btn-orange" onClick={handleExpandAllRows}
                                icon={<NodeCollapseOutlined/>}>展开/折叠</Button>

                    </Space>
                    <div className="flext absolute right-12">
                        <Button size="small" type="link"
                                onClick={() => setToggleSearch(!toggleSearch)}><SearchOutlined/></Button>
                        <Button size="small" type="link" onClick={handleSyncData}><SyncOutlined/></Button>
                        <Button size="small" type="link"><ProfileOutlined/></Button>
                        <Popover content={<ColumnSelector columns={columns as never}
                                                          onChange={handleColumnSelected as never}/>} trigger="click">
                            <Button size="small" type="link"><TableOutlined/></Button>
                        </Popover>
                    </div>
                </Row>
                <Row>
                    <Table
                        style={{width: "100%"}}
                        scroll={{x: 1000}}
                        rowKey="resId"
                        size="middle"
                        tableLayout="fixed"
                        loading={tableLoading}
                        dataSource={dataSource}
                        columns={tableColumns}
                        showSorterTooltip={true}
                        sortDirections={['ascend', 'descend']}
                        indentSize={10}
                        onChange={handleTableChange}
                        expandable={{
                            expandedRowKeys: expandedRowKeys,
                            onExpand: (expanded, r) => {
                                if (expanded) {
                                    const exp = [...expandedRowKeys, r.resId]
                                    setExpandedRowKeys(exp)
                                } else {
                                    setExpandedRowKeys(expandedRowKeys.filter(e => e != r.resId))

                                }

                            },


                        }}
                    />
                </Row>
            </Space>

            <ResForm open={resFormProp.open} resId={resFormProp.resId} parentId={resFormProp.parentId}
                     onFinished={handleDetailFinished} onCancel={handleDetailCancel}/>

        </>
    )
}

export default ResPage