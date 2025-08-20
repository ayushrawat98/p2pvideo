import { userModel } from "./user.model"
import { videoModel } from "./video.model"

export interface commentModel {
    id? : number
    comment : string,
    VideoId? : number,
    CommentorUserId? : number,
    parentcommentid? : number,
    Commentor? : userModel,
    Video? : videoModel
    ChildComments? : commentModel[]
}