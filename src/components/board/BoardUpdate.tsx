import {useState, useEffect, Fragment, useRef} from 'react'
import {useQuery, useMutation} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import boardClient from "../../board-commons";
import {AxiosError, AxiosResponse} from "axios";

interface BoardItem {
    no: number;
    name: string;
    subject: string;
    content: string;
}
interface BoardResponse {
    msg: string;
}

function BoardUpdate() {

    const [name, setName] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");

    const nameRef=useRef<HTMLInputElement>(null);
    const subjectRef=useRef<HTMLInputElement>(null);
    const pwdRef=useRef<HTMLInputElement>(null);
    const contentRef=useRef<HTMLTextAreaElement>(null);

    const {no}=useParams();
    const nav=useNavigate();

    // 1. 데이터 읽기 (useQuery)
    const {isLoading, isError, error, data}=useQuery<{data:BoardItem}>({
        queryKey:['board-update', no],
        queryFn: async() => {
            return boardClient.get<BoardItem>(`/board/update_node?no=${no}`)
        }
    })
    const board=data?.data
    console.log(board)

    useEffect(() => {
        if(board) {
            setName(board.name)
            setSubject(board.subject)
            setContent(board.content)
        }
    }, [board]);

    // 2. 수정 => 실제 수정 (useMutation) => req.body
    const {mutate:boardUpdate}=useMutation({
        mutationFn:() => boardClient.put(`/board/update_ok_node`, {
            no: no,
            name: name,
            subject: subject,
            content: content,
            pwd: pwd
        }),
        onSuccess:(res:AxiosResponse<BoardResponse>) => {
            console.log(res) // response.data
            if(res.data.msg==='yes') { // 비밀번호가 일치
                window.location.href=`/board/detail/${no}`
            } else { // 비밀번호 틑린 상태
                alert("비밀번호가 틀립니다")
                setPwd("")
                pwdRef.current?.focus()
            }
        },
        onError:(err:AxiosError) => {
            console.log(err.message)
        }
    })

    const boardUpdateOk=()=>{
        if(!name.trim())
            return nameRef.current?.focus()
        if(!subject.trim())
            return subjectRef.current?.focus()
        if(!content.trim())
            return contentRef.current?.focus()
        if(!pwd.trim())
            return pwdRef.current?.focus()

        boardUpdate()
    }

    if(isLoading){
        return <h3 className={"text-center"}>Loading...</h3>
    }
    if(isError){
        return <h3 className={"text-center"}>Error...:{error.message}</h3>
    }

    // HTML에 적용
    return (
        <Fragment>
            <div id="main-wrapper">
                <div className="container" style={{ maxWidth: "900px", marginTop: "40px" }}>
                    <div className="row">
                        <table className="table">
                            <tbody>
                            <tr>
                                <th className="text-center" style={{"border":"none"}}>이름</th>
                                <td width="85%">
                                    <input
                                        type="text"
                                        size={15}
                                        ref={nameRef}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th className="text-center" style={{"border":"none"}}>제목</th>
                                <td>
                                    <input
                                        type="text"
                                        size={55}
                                        ref={subjectRef}
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th className="text-center" style={{"border":"none"}}>내용</th>
                                <td>
                  <textarea
                      className="form-control"
                      rows={10}
                      ref={contentRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                  />
                                </td>
                            </tr>

                            <tr>
                                <th className="text-center" style={{"border":"none"}}>비밀번호</th>
                                <td>
                                    <input
                                        type="password"
                                        size={15}
                                        ref={pwdRef}
                                        value={pwd}
                                        onChange={(e) => setPwd(e.target.value)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={2} className="text-center">
                                    <button
                                        className="btn-sm" style={{"border":"none","backgroundColor":"gray", "color": "white", "fontWeight": "bold", "margin":"3px"}}
                                        onClick={boardUpdateOk}>
                                        수정
                                    </button>

                                    <button
                                        className="btn-sm" style={{"border":"none","backgroundColor":"gray", "color": "white", "fontWeight": "bold", "margin":"3px"}}
                                        onClick={() => nav(-1)}
                                    >
                                        취소
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default BoardUpdate