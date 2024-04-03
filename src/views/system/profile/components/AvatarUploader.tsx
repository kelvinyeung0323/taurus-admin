import {Avatar, message, Spin, Upload} from "antd";
import {getToken} from "@/common/auth.ts";
import {RcFile, UploadChangeParam, UploadProps} from "antd/es/upload";
import {UploadFile} from "antd/es/upload/interface";
import {Result} from "@/common/http.ts";
import {UploadedFile} from "@/common/file-helper.ts";
import {LoadingOutlined, PlusOutlined,UserOutlined} from "@ant-design/icons";
import { useState} from "react";



export const AvatarUploader=()=>{
    const [avatarUrl,setAvatarUrl] =useState<string|undefined>("/api/system/profile/avatar?_r="+Math.random())
    const [uploading,setUploading] = useState<boolean>(false)


    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };



    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile<Result<UploadedFile>>>) => {
        console.log("upload change",info)
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            setUploading(false)
            const res = info.file.response;
            if(res?.code == 200){
                setAvatarUrl("/api/system/profile/avatar?_r="+Math.random())
            }else {
                message.error("上传失败")
            }

        }
    };
    return(
        <>
            <Upload
                name="file"
                listType="picture-circle"
                className="object-center"
                showUploadList={false}
                headers={{Authorization:"Bearer "+getToken()}}
                action={"/api/system/profile/avatar"}
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                <Spin spinning={uploading}>
                <Avatar
                    src={avatarUrl}
                    size={ 100 }
                    icon={<UserOutlined />}
                />
                </Spin>
            </Upload>
        </>
    )
}


