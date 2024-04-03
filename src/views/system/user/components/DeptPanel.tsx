import {
    ApartmentOutlined,
    FolderOpenOutlined,
    FolderOutlined,
    FormOutlined,
    SyncOutlined,
    CaretLeftOutlined,
    CaretRightOutlined} from "@ant-design/icons"
import {Button, Tree} from "antd";
import {useEffect, useState} from "react";
import {getDeptTree} from "@/service/system/common-service.ts";
import {Dept} from "@/models/system/dept-model.ts";
import {all} from "axios";
import {Link, useRoutes} from "react-router-dom";

interface Props {
    value?: number[]
    onChange?: (value: number[]) => void
}

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
const DeptPanel = ({value, onChange}: Props) => {


    const [treeData, setTreeData] = useState<DefaultOptionType[]>()

    const [expandedKeys,setExpandedKeys] = useState<number[]>([])
    const [allKeys,setAllKeys]= useState<number[]>([])
    const [hidden,setHidden] = useState(false)
    const fetchData = () => {
        getDeptTree().then(resp => {
            setAllKeys(getAllIds(resp.data))
            setExpandedKeys(expandedKeys)
            setTreeData(toTreeData(resp.data))

        })
    }

    useEffect(() => {
        setExpandedKeys(allKeys)
    }, [allKeys]);

    const toggleTree = ()=>{
        if(expandedKeys.length>0){
            setExpandedKeys([]);
        }else {
            setExpandedKeys(allKeys)
        }
    }
    const handleExpand = (expandedKeys:number[])=>{
          setExpandedKeys(expandedKeys)
    }
    const toTreeData = (deptTree?: Dept[]) => {
        if (deptTree) {
            const r: DefaultOptionType[] = deptTree.map(e => {
                return {
                    value: e.deptId,
                    title: e.deptName,
                    key: e.deptId,
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
        <div className="flex relative">
            <div className="w-full gap-3 w-60 p-4 shadow-2xl  rounded-2xl"  hidden={hidden}>
                <section className="flex w-full h-8 relative items-center">
                    <div className="flex text-gray-600 gap-1"><ApartmentOutlined/>
                        <span className="font-bold">组织机构</span>
                    </div>
                    <div className="flex gap-2 absolute right-1">
                        <Link to="/dept"><FormOutlined/></Link>
                        <a type="link" onClick={()=>toggleTree()}>
                            {expandedKeys.length>0?<FolderOpenOutlined/>:<FolderOutlined/>}
                        </a>
                        <a type="link" onClick={()=>fetchData()}><SyncOutlined/></a>
                    </div>
                </section>
                <section className="mt-2">
                    <Tree
                        showSearch
                        style={{width: '100%'}}
                        selectedKeys={value}
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        placeholder="选择部门"
                        allowClear
                        treeDefaultExpandAll
                        onSelect={onChange}
                        treeData={treeData}
                        expandedKeys={expandedKeys}
                        treeNodeFilterProp="title"
                        onExpand={handleExpand}
                    />
                </section>
            </div>
            <div className="flex  absolute right-0 top-0 h-full w-2 justify-center items-center">
                <a onClick={()=>setHidden(!hidden)}
                    className="flex h-14 w-3 border-0 bg-gray-50 hover:bg-gray-100 items-center justify-center rounded-lg text-gray-600">
                    {hidden?<CaretRightOutlined />:<CaretLeftOutlined />}

                </a>
            </div>
        </div>
    )
}

export default DeptPanel