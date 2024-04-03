import {Card, Checkbox, Col, Form, Row, Space, Spin, Tree} from "antd";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {useEffect, useState} from "react";
import * as resService from "@/service/system/res-service.ts";
import {Res, ResQueryForm} from "@/models/system/sys-model.ts";
import {useForm} from "antd/es/form/Form";


interface Props {
    value?: number[]
    onChange?: (value: number[]) => void
}


const getAllResIds = (res: Res[]): string[] => {
    const arr: string[] = []
    res.forEach((res) => {
        arr.push(res.resId)
        if (res.children) {
            const sub = getAllResIds(res.children)
            arr.push(...sub)
        }
    })
    return arr;
}
const ResSelector = ({value, onChange}: Props) => {


    const [loading, setLoading] = useState(false);
    const [checkStrictly, setCheckStrictly] = useState(false)
    const [expandedKeys, setExpandedKeys] = useState<string[]>()
    const [allResIds, setAllResIds] = useState<string[]>([])
    const [treeData, setTreeData] = useState<Res[]>()


    const fetchData = () => {
        setLoading(true)
        resService.queryRes({resName: null, resType: null} as ResQueryForm).then(resp => {
            setTreeData(resp.data)
            setAllResIds(getAllResIds(resp.data))
        }).finally(() => {
            setLoading(false)
        })
    }

    const onSelectAll = (e: CheckboxChangeEvent) => {
        console.log("onSelect all", e.target.checked)
        if (e.target.checked) {
           onChange(allResIds)
        } else {
            onChange([])
        }
    }

    const onExpandAll = (e: CheckboxChangeEvent) => {
        if (e.target.checked) {
            setExpandedKeys(allResIds)
        } else {
            setExpandedKeys([])
        }
    }

    const onExpand = (expandedKeys: string[]) => {
        setExpandedKeys(expandedKeys)
    }

    const handleChange=(checkedKeys: number[] | {
        checked: number[];
        halfChecked: number[];
    })=>{
        if(Array.isArray(checkedKeys)){
            onChange(checkedKeys);
        }else {
            onChange(checkedKeys.checked);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Space direction={"vertical"} className="w-full">
                <Row>
                    <Checkbox defaultChecked={true} onChange={onExpandAll}>展开/折叠</Checkbox>
                    <Checkbox defaultChecked={true} onChange={onSelectAll}>全选/全不选</Checkbox>
                    <Checkbox checked={checkStrictly}
                              onChange={e => setCheckStrictly(e.target.checked)}>父子联动</Checkbox>

                </Row>
                <Row>
                    <Col span={24}>
                        <Spin spinning={loading}>
                            <Tree
                                className="border-2 border-gray-700 bg-gray-100 p-3"
                                checkStrictly={!checkStrictly}
                                expandedKeys={expandedKeys}
                                onExpand={(keys) => onExpand(keys as string[])}
                                multiple={true}
                                checkedKeys={value}
                                onCheck={handleChange}
                                checkable
                                fieldNames={{title: "resName", key: "resId", children: "children"}}
                                defaultExpandAll={true}
                                treeData={treeData}
                            />
                        </Spin>

                    </Col>
                </Row>
            </Space>
        </>
    )
}

export default ResSelector