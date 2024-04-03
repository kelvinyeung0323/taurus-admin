import {useEffect, useState} from "react";
import {Checkbox} from "antd";
import {ColumnsType} from "antd/es/table";


interface Props<RecordType = never> {
    columns: ColumnsType<RecordType>;
    onChange:(columns: ColumnsType<RecordType>)=>void
}
const ColumnSelector = ({columns,onChange}:Props) =>{
    const options = columns.map(({key, title}) => ({
        label: title?.toString(),
        value: key,
    }));

    const defaultCheckedList = columns.map((item) => item.key as string);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);


    useEffect(() => {
        const newColumns = columns.map((item) => ({
            ...item,
            hidden: !checkedList.includes(item.key as string),
        }));

        onChange(newColumns)
    }, [checkedList]);

    return (
        <>
            <Checkbox.Group
                value={checkedList}
                onChange={(value) => {
                    console.log("set check list:",value);
                    setCheckedList(value as string[]);
                }}
            >
                <div className="flex flex-col">
                    {options.map(o => {
                        return (
                                <Checkbox key={o.value} value={o.value}>{o.label}</Checkbox>
                        )
                    })}
                </div>
            </Checkbox.Group>
        </>
    )
}

export default ColumnSelector