import { Select } from "antd"
import {useEffect, useState} from "react";

import * as dictService from "@/service/system/dict-service.ts"


export interface DictSelectProps{
    onChange?:(value:number)=>void;
    value?:number
}
const DictSelector = ({value,onChange}:DictSelectProps)=>{

    const [options,setOptions] = useState<{label:string,value:number}[]>()

    const fetchData = ()=>{
        dictService.queryDictList({pageNum:1,pageSize:1000}).then((resp=>{
            if(resp.data){
               const opts= resp.data.map(e=>({label:e.dictName,value:e.dictId}))
                setOptions(opts);
            }

        }))
    }




    const onSearch = (value: string) => {
        console.log('search:', value);
    };

// Filter `option.label` match the user type `input`
    const filterOption = (input: string, option?: { label: string; value: number }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    useEffect(() => {
        fetchData()
    }, []);
    return (
        <Select<number,{ label: string; value: number }>
            showSearch
            placeholder=""
            value={value}
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={options}
        />
    )
}

export default DictSelector