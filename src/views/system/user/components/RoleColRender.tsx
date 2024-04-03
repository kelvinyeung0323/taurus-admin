import {Tag} from "antd";
import React from "react";
import {Role, User} from "@/models/system/sys-model.ts";


const getColor = (code: string) => {

    switch (code.length % 3) {
        case 0:
            return "green";
        case 1:
            return "blue";
        default:
            return "orange"
    }

}
const RoleColRender = (roles: Role[], user: User) => {


    if (user.userType == "00") {
        return <Tag color="red">超级用户</Tag>
    } else {
        return (
            <>
                {roles?.map((role) => (
                    <Tag color={getColor(role.roleCode)} key={role.roleCode}> {role.roleName}</Tag>
                ))}
            </>
        )
    }
}

export default RoleColRender