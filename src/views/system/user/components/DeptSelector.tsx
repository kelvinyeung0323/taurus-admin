import {Tag, TreeSelect} from "antd";
import {useEffect, useState} from "react";
import {getDeptTree} from "@/service/system/common-service.ts";
import {Dept} from "@/models/system/dept-model.ts";
import {DefaultOptionType} from "rc-tree-select/lib/TreeSelect";

interface DeptSelectorProps {
    value?:number
    onChange?:(deptId:number)=>void
}
const DeptSelector = ({value,onChange}:DeptSelectorProps) => {

    const [treeData,setTreeData] = useState<DefaultOptionType[]>()

    const fetchData = () => {
        getDeptTree().then(resp => {
            setTreeData(toTreeData(resp.data))
        })
    }

    const toTreeData = (deptTree?: Dept[]) => {
        if (deptTree) {
            const r:DefaultOptionType[] = deptTree.map(e => {
                return {
                    value: e.deptId,
                    title: e.deptName,
                    key:e.deptId,
                    children: toTreeData(e.children)
                }
            })
            return r;
        }
        return []

    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <>
        {value==0?(<Tag color={"warning"} >无</Tag>):(<TreeSelect
            showSearch
            style={{width: '100%'}}
            value={value}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            placeholder="选择部门"
            allowClear
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
            treeNodeFilterProp="title"
        />)}
        </>
    )
}

export default DeptSelector;