import { userModel } from "./user.model"

export interface videoModel {
    id:number,
    title : string,
    description : string,
    videoname : string,
    views : number,
    infoHash : string,

    createdAt? : string,
    Uploader : userModel,
    UploaderUserId : number,
    Tempvideo? : {createdAt : string} | null
    commentcount : number
}