import {useRef, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {MusicItem} from "../../commons/commonsData";
import apiClient from "../../http-commons";
import {AxiosResponse} from "axios";
import MusicVideo from "../youtube/MusicVideo";

interface CommentData {
    no: number;
    mno: number;
    id: string;
    name: string;
    msg: string;
    dbday: string;
}

interface DetailProps {
    vo: MusicItem,
    comments: CommentData[]
}

function MusicDetail() {

    const {no} = useParams();
    const musicNo = Number(no);

    const nav = useNavigate();

    const [isInsert, setIsInsert] = useState<boolean>(true);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [commentNo, setCommentNo] = useState<number>(0);

    // 추가
    const [msg, setMsg] = useState<string>("");
    const msgRef = useRef<HTMLTextAreaElement>(null);

    // 수정
    const [umsg, setUmsg] = useState<string>("");
    const umsgRef = useRef<HTMLTextAreaElement>(null);

    const {isLoading, isError, error, data, refetch: musicDetail} = useQuery<AxiosResponse<DetailProps>, Error>({
        queryKey: ['music-detail', musicNo],
        queryFn: async () => {
            return await apiClient.get(`/music/detail_react/${musicNo}`)
        },
        refetchOnMount: "always"
    })

    // insert
    const {mutate: commentInsert} = useMutation<DetailProps>({
        mutationFn: async () => {
            const res: AxiosResponse<DetailProps, Error> = await apiClient.post(`/comment/insert`, {
                mno: musicNo,
                id: sessionStorage.getItem("id"),
                name: sessionStorage.getItem("name"),
                msg: msg
            })
            return res.data
        },
        onSuccess: () => {
            musicDetail()
            if (msgRef.current) {
                msgRef.current.value = ''
            }
            setMsg("")
        },
        onError: (error: Error) => {
            console.log("Error발생:", error.message)
        }
    });

    const {mutate: commentDelete} = useMutation<DetailProps>({
        mutationFn: async () => {
            const res: AxiosResponse<DetailProps, Error> = await apiClient.delete(`/comment/delete/${commentNo}/${musicNo}`)
            return res.data
        },
        onSuccess: () => {
            musicDetail()
        },
        onError: (error: Error) => {
            console.log("Error발생:", error.message)
        }
    })

    // 수정
    const {mutate: commentUpdate} = useMutation<DetailProps>({
        mutationFn: async () => {
            const res: AxiosResponse<DetailProps, Error> = await apiClient.put(`/comment/update`, {
                no: commentNo,
                msg: umsg
            })
            return res.data
        },
        onSuccess: () => {
            musicDetail()
            if (umsgRef.current) {
                umsgRef.current.value = ''
            }
            setUmsg("")
            setIsInsert(true)
            setIsEdit(false)
        },
        onError: (error: Error) => {
            console.log("Error발생:", error.message)
        }
    })

    if (isLoading) {
        return <div className={"text-center"}>Loading...</div>
    }
    if (isError) {
        return <div className={"text-center"}>{error?.message}</div>
    }
    console.log("no,musicNo:", no, musicNo);
    console.log("detail res:", data?.data);

    const music: MusicItem | undefined = data?.data.vo;
    const comment: CommentData[] = data?.data.comments ?? [];

    // 이벤트 처리
    const insert = () => {
        if (msg === '') {
            msgRef.current?.focus()
            return
        }
        commentInsert()
    }

    const del = (no: number) => {
        setCommentNo(no)
        commentDelete()
    }

    const update = () => {
        if (umsg === '') {
            umsgRef.current?.focus()
            return
        }
        commentUpdate()
    }

    const updateData = (no: number, index: number) => {
        if (comment) {
            setUmsg(comment[index].msg)
        }
        setIsInsert(false)
        setIsEdit(true)
        setCommentNo(no)
    }

    let genre

    switch (music?.cno) {
        case 1:
            genre = "가요"
            break;
        case 2:
            genre = "가요"
            break;
        case 3:
            genre = "POP"
            break;
        case 4:
            genre = "OST"
            break;
        case 5:
            genre = "트롯"
            break;
        case 6:
            genre = "JAZZ"
            break;
        case 7:
            genre = "CLASSIC"
            break;
    }

    let icon
    if (music?.state === '상승') {
        icon = '▲'
    } else if (music?.state === '하강') {
        icon = '▽'
    } else {
        icon = '-'
    }


    return (
        <div id="main-wrapper">
            <div className="container">

                <div className="row music-detail-box" style={{"backgroundColor":"#f9f9f9", "padding":"0 30px"}}>
                    <div className="row hit-area">
                        <div><span className={"detail-title"}>조회수&nbsp;</span> {music?.hit}</div>
                    </div>
                    <table className="table" style={{width:"100%"}}>
                        <tbody>
                        <tr>
                            <td className={"text-center detail-title"} rowSpan={6} width={"30%"}>
                                <img src={music?.poster} style={{"width":"350px", "height":"300px"}} />
                            </td>
                            <td colSpan={2}><h3 style={{"marginLeft":"40px"}}>{music?.title}</h3></td>
                        </tr>
                        <tr>
                            <td className={"text-center detail-title"} width={"15%"}>가수명</td>
                            <td width={"55%"}>{music?.singer}</td>
                        </tr>
                        <tr>
                            <td className={"text-center detail-title"} width={"15%"}>장르</td>
                            <td width={"55%"}>{genre}</td>
                        </tr>
                        <tr>
                            <td className={"text-center detail-title"} width={"15%"}>순위</td>
                            <td width={"55%"}>{music?.rank}&nbsp; ({music?.idcrement}&nbsp;{icon})</td>
                        </tr>
                        <tr>
                            <td className={"text-center detail-title"} width={"15%"}>앨범</td>
                            <td width={"55%"}>{music?.album}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <hr style={{"marginTop":"50px"}}/>
                <div className="row">
                    <h3>뮤직비디오</h3>
                    {music?.title && <MusicVideo title={music.title} />}
                </div>
                <hr style={{"marginTop":"50px"}}/>
                <div className="row comment-area">
                    <h3>댓글</h3>
                    <table className="table">
                        <tbody>
                        <tr>
                            <td>
                                {
                                    comment &&
                                    comment.map((com:CommentData, index) =>
                                        <table className={"table"} key={index}>
                                            <tbody>
                                            <tr>
                                                <td className={"text-left"} width={"80%"}>
                                                    ★{com.name}({com.dbday})
                                                </td>
                                                <td className={"text-right"} width={"20%"}>
                                                    {
                                                        com.id===sessionStorage.getItem("id") &&
                                                        (
                                                            <span>
                                                                    <button className={"btn-warning btn-sm"} onClick={()=>updateData(com.no,index)}>수정</button>&nbsp;
                                                                <button className={"btn-warning btn-sm"} onClick={()=>del(com.no)}>삭제</button>
                                                                </span>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2} valign={"top"}>
                                                    <pre style={{"whiteSpace": "pre-wrap", "backgroundColor": "white", "border":"none"}}>{com.msg}</pre>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    )
                                }
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    {
                        sessionStorage.getItem("id") && isInsert===true &&
                        (
                            <table className="table comment-write">
                                <tbody>
                                <tr>
                                    <td>
                                        <textarea rows={5} cols={120} style={{"float": "left"}} ref={msgRef} onChange={(e)=>setMsg(e.target.value)}/>
                                        <button className={"btn-primary"} style={{"float": "left","width":"100px", "height":"122px"}} onClick={insert}>댓글쓰기</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        )
                    }
                    {
                        isEdit &&
                        (
                            <table className="table comment-write">
                                <tbody>
                                <tr>
                                    <td>
                                        <textarea rows={5} cols={120} style={{"float": "left"}} ref={umsgRef} value={umsg} onChange={(e)=>setUmsg(e.target.value)}/>
                                        <button className={"btn-primary"} style={{"float": "left","width":"100px", "height":"122px"}} onClick={()=>update()}>수정</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default MusicDetail;