import {TreeSelect} from "antd";
import {useEffect, useState} from "react";
import {Res, ResType} from "@/models/system/res-model.ts";
import * as resService from "@/service/system/res-service.ts";

interface Props{
    value?:number
    onChange?:(value:number)=>void
}

const treeRootNode: Res = {
    resId: 0,
    parentId: -1,
    resType: ResType.Catalog,
    resName: "主类目",
    children: []
}
const ResSelector=({value,onChange}:Props)=>{

    const [treeData, setTreeData] = useState<Res[]>([treeRootNode])
    const fetchData = () => {
        resService.queryResList({}).then(resp => {
            if (resp.data) {
                treeRootNode.children = resp.data
                setTreeData([treeRootNode])
            }

        })
    }

    useEffect(() => {
        fetchData()
    }, []);


    return (
        <TreeSelect
            value={value}
            onChange={onChange}
            showSearch
            style={{width: '100%'}}
            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
            placeholder="请选择上级菜单"
            allowClear
            fieldNames={{label: "resName", value: "resId", children: "children"}}
            treeDefaultExpandAll
            treeData={treeData}
        />
    )
}

export default ResSelector;