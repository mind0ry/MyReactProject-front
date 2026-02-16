import {useParams, useNavigate, Link, useNavigationType} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useEffect, Fragment} from "react";
import boardClient from "../../board-commons";

interface BoardDetailProps {
    no:number;
    subject:string;
    name:string;
    content:string;
    dbday:string;
    hit:number;
}

function BoardDetail() {
    const {no} = useParams();
    const nav=useNavigate()
    const type=useNavigationType()
    console.log(type)
    const {isLoading,isError,error,data}=useQuery<{data:BoardDetailProps}>({
        queryKey:['board-detail', no],
        queryFn: async()=>{
            return boardClient.get(`/board/detail_node?no=${no}`)
        }
        // /board/detail?no=1 => req.query.no => @getParameter() => 매개변수
        // /board/detail/1    => req.params.no => @PathVariable()
    })

    if(isLoading) {
        return <h1 className={"text-center"}>Loading...</h1>
    }
    if(isError) {
        return <h1 className={"text-center"}>Error:{error.message}</h1>
    }

    const board=data?.data
    if(!board){
        return null
    }

    return (
        <Fragment>
            <div id="main-wrapper">
                <div className="container" style={{ maxWidth: "900px", marginTop: "40px" }}>
                    <div className="row">
                        <table className="table table-bordered">
                            <tbody>
                            <tr>
                                <th className="text-center">번호</th>
                                <td width="35%" className="text-center">{board.no}</td>
                                <th className="text-center">작성일</th>
                                <td width="35%" className="text-center">{board.dbday}</td>
                            </tr>
                            <tr>
                                <th className="text-center">이름</th>
                                <td className="text-center">{board.name}</td>
                                <th className="text-center">조회수</th>
                                <td className="text-center">{board.hit}</td>
                            </tr>
                            <tr>
                                <th className="text-center">제목</th>
                                <td colSpan={3}>{board.subject}</td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                  <pre
                      style={{
                          whiteSpace: "pre-wrap",
                          minHeight: "300px",
                          margin: 0,
                          backgroundColor: "transparent",
                          border: "none"
                      }}
                  >
                    {board.content}
                  </pre>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="text-end">
                                    <Link to={`/board/update/${board.no}`} style={{"color": "black", "textDecoration": "underline"}} >
                                        수정
                                    </Link>
                                    &nbsp;
                                    <Link to={`/board/delete/${board.no}`} style={{"color": "black", "textDecoration": "underline"}} >
                                        삭제
                                    </Link>
                                    &nbsp;
                                    <Link to="/board/list" style={{"color": "black", "textDecoration": "underline"}} >
                                        목록
                                    </Link>
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
export default BoardDetail