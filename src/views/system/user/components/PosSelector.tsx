import {Select} from "antd";
import {useEffect, useState} from "react";
import {Pos} from "@/models/system/sys-model.ts";
import * as posService from "@/service/system/pos-service.ts";


interface PosSelectorProps {
    value?:number
    onChange?:(posId:number)=>void
}
const PosSelector = ({value,onChange}:PosSelectorProps)=>{
    const [posOptions, setPosOptions] = useState<Pos[]>()
    const [loading,setLoading] = useState(false);

    const fetchData = () => {
        setLoading(true)
        posService.queryPosList({pageNum: 1, pageSize: 1000}).then(resp => {
            if (resp.data) {
                setPosOptions(resp.data)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <Select
            value={value}
            onChange={onChange}
            loading={loading}
            mode="multiple"
            fieldNames={{label: 'posName', value: "posId"}}
            allowClear
            style={{width: '100%'}}
            placeholder=""
            options={posOptions}
        />
    )
}
export default  PosSelector