import {useState, useEffect, useRef,Fragment} from "react";
import {useQuery, useMutation} from "@tanstack/react-query";
import BoardClient from "../../board-commons" // 서버 연결
import {useNavigate} from "react-router-dom"
import boardClient from "../../board-commons"; // 화면 이동

/*
    1. 발전 속도가 빠르다
    = 이전 버전과 호환성이 떨어진다 => 18
    = 19버전은 TypeScript 권장
              ----------
    useQuery = SELECT
    useMutation = INSERT UPDATE DELETE
 */
function BoardInsert() {
    const nav=useNavigate();
    const [name,setName]=useState<string>("");
    const [subject,setSubject]=useState<string>("");
    const [content,setContent]=useState<string>("");
    const [pwd,setPwd]=useState<string>("");

    const nameRef=useRef<HTMLInputElement>(null);
    const subjectRef=useRef<HTMLInputElement>(null);
    const pwdRef=useRef<HTMLInputElement>(null);
    const contentRef=useRef<HTMLTextAreaElement>(null);

    const {mutate:boardInsert}=useMutation({
        mutationFn: async ()=>{
            return await boardClient.post("/board/insert_node",{
                name: name,
                subject: subject,
                content: content,
                pwd: pwd
            });
        },
        onSuccess:(res)=>{
            if(res.data.msg==='yes') {
                window.location.href='/board/list'
            } else {
                alert("게시판 등록에 실패하셨습니다!!")
            }
        },
        onError:(err:Error)=>{
            console.log("Error발생:", err.message);
        }
    })

    // 이벤트 처리
    const insert=():void=>{
        if(!name.trim())
            return nameRef.current?.focus()
        if(!subject.trim())
            return subjectRef.current?.focus()
        if(!content.trim())
            return contentRef.current?.focus()
        if(!pwd.trim())
            return pwdRef.current?.focus()

        boardInsert()
    }

    return (
        <Fragment>
            <div id="main-wrapper">
                <div className="container" style={{ maxWidth: "900px", marginTop: "40px" }}>
                    <div className="row">
                        <table className="table">
                            <tbody>

                            <tr>
                                <th className="text-center" style={{ border: "none" }}>이름</th>
                                <td width="85%">
                                    <input
                                        type="text"
                                        size={15}
                                        ref={nameRef}
                                        value={name}
                                        onChange={(e:any) => setName(e.target.value)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th className="text-center" style={{ border: "none" }}>제목</th>
                                <td>
                                    <input
                                        type="text"
                                        size={55}
                                        ref={subjectRef}
                                        value={subject}
                                        onChange={(e:any) => setSubject(e.target.value)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <th className="text-center" style={{ border: "none" }}>내용</th>
                                <td>
                  <textarea
                      rows={10}
                      cols={55}
                      ref={contentRef}
                      value={content}
                      onChange={(e:any) => setContent(e.target.value)}
                  />
                                </td>
                            </tr>

                            <tr>
                                <th className="text-center" style={{ border: "none" }}>비밀번호</th>
                                <td>
                                    <input
                                        type="password"
                                        size={15}
                                        ref={pwdRef}
                                        value={pwd}
                                        onChange={(e:any) => setPwd(e.target.value)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={2} className="text-center">
                                    <button
                                        className="btn-sm"
                                        style={{
                                            border: "none",
                                            backgroundColor: "gray",
                                            color: "white",
                                            fontWeight: "bold",
                                            margin: "3px"
                                        }}
                                        onClick={insert}
                                    >
                                        글쓰기
                                    </button>

                                    <button
                                        className="btn-sm"
                                        style={{
                                            border: "none",
                                            backgroundColor: "gray",
                                            color: "white",
                                            fontWeight: "bold",
                                            margin: "3px"
                                        }}
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
export default BoardInsert;