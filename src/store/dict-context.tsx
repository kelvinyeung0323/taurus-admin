import React, {createContext, useContext, useEffect, useState} from "react";

import * as dictService from "@/service/system/dict-service.ts"
import {useAuthContext} from "@/store/auth-context.tsx";
import {DictItem} from "@/models/system/dict-model.ts";




type DictContextType = {
    dict:Map<string,DictItem[]>
    dictLabels:Map<string,Map<string,DictItem>>
    refreshAllDict:()=>void
}

export const DictContext = createContext<DictContextType | null>(null)


type ContextProviderProps = {
    children: React.ReactNode;
}

export default function DictContextProvider({children}: ContextProviderProps) {




    const {isAuthLoaded} = useAuthContext()
    const [dict,setDict] = useState<Map<string,DictItem[]>>(new Map<string,DictItem[]>())
    const [dictLabels,setDictLabels] = useState<Map<string,Map<string,DictItem>>>(new Map())



    const refreshAllDict=()=>{
        dictService.querytems({pageNum:1,pageSize:10000}).then(resp=>{
            toDictMap(resp.data)
            toDictLabelMap(resp.data)
        })
    }

    const toDictLabelMap=(items:DictItem[])=>{
        const newDict = new Map<string,Map<string,DictItem>>();
        items.forEach(item=>{
            let m = newDict.get(item.dictCode)
            if(!m){
                m= new Map<string,DictItem>();
                newDict.set(item.dictCode,m);
            }
            m.set(item.itemValue,item)
        })
        setDictLabels(newDict);
    }
    const toDictMap =(items:DictItem[])=>{
        const newDict = new Map<string,DictItem[]>()
        items.forEach(item=>{
            let arr = newDict.get(item.dictCode)
            if(!arr){
                arr=[];
                newDict.set(item.dictCode,arr);
            }
            arr.push(item)
        })
        setDict(newDict);
    }

    useEffect(() => {
        if(isAuthLoaded){
            refreshAllDict()
        }

    }, [isAuthLoaded]);



    return (
        <DictContext.Provider
            value={{dict,dictLabels,refreshAllDict}}>
            {children}
        </DictContext.Provider>
    )
}

export function useDictContext() {
    const context = useContext(DictContext)
    if (!context) {
        throw new Error(
            "useDictContext must be used within a AuthContextProvider"
        );
    }
    return context
}
