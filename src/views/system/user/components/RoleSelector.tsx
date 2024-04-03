import {Select} from "antd";
import {useEffect, useState} from "react";
import {Role} from "@/models/system/sys-model.ts";
import * as roleService from "@/service/system/role-service.ts";


interface RoleSelectorProps {
    value?:number
    onChange?:(deptId:number)=>void
}
const RoleSelector = ({value,onChange}:RoleSelectorProps)=>{
    const [roleOptions, setRoleOptions] = useState<Role[]>()
    const [loading,setLoading] = useState(false);

    const fetchData = () => {
        setLoading(true)
        roleService.queryRole({pageNum: 1, pageSize: 1000}).then(resp => {
            if (resp.data) {
                setRoleOptions(resp.data)
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
            fieldNames={{label: 'roleName', value: "roleId"}}
            allowClear
            style={{width: '100%'}}
            placeholder=""
            options={roleOptions}
        />
    )
}
export default  RoleSelector