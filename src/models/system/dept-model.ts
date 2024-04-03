
export type Dept = {
    deptId?: number;
    parentId?: bigint
    deptName: string
    orderNum?: number
    manager?: string
    tel?: string
    email?: string
    status?: string
    deleted?: boolean
    createdBy?: string
    createdAt?: string
    updatedBy?: string
    updatedAt?: string
    children?: Dept[]
}


export type DeptQuery = {
    deptName:string
    status?:boolean
}