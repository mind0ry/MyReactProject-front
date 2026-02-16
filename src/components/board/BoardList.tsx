import {useState, useEffect, Fragment} from "react";
import {useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";
import boardClient from "../../board-commons";

// 게시판 column
interface BoardItem {
    no:number;
    subject:string;
    name:string;
    dbday:string;
    hit:number;
}
interface BoardListResponse {
    list:BoardItem[];
    curpage:number;
    totalpage:number;
}

function BoardList() {
    const [curpage, setCurpage] = useState<number>(1);
    const {isLoading,isError,error,data,refetch:hitIncrement}=useQuery<{data:BoardListResponse}>({
        queryKey:['board-list',curpage],
        queryFn: async()=> await boardClient.get(`/board/list_node?page=${curpage}`)
    })

    useEffect(() => {
        hitIncrement();
    }, [curpage]);

    if(isLoading){
        return <h1 className="text-center">Loading...</h1>
    }
    if(isError){
        return <h1 className="text-center">Error발생: {error.message}</h1>
    }
    return (
        <Fragment>
            <div id="main-wrapper">
                <div className="container" style={{ marginTop: "30px" }}>
                    <button className="btn btn-secondary btn-sm">
                        <Link to="/board/insert" style={{"color":"black", "fontWeight":"bold"}}>새글</Link>
                    </button>

                    <table className="table">
                        <thead>
                        <tr>
                            <th className="text-center">번호</th>
                            <th className="text-center">제목</th>
                            <th className="text-center">이름</th>
                            <th className="text-center">작성일</th>
                            <th className="text-center">조회수</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.data.list.map((board: BoardItem) => (
                            <tr key={board.no}>
                                <td className="text-center">{board.no}</td>
                                <td>
                                    <Link to={`/board/detail/${board.no}`} style={{"color":"black", "textDecoration":"underline"}} >
                                        {board.subject}
                                    </Link>
                                </td>
                                <td className="text-center">{board.name}</td>
                                <td className="text-center">{board.dbday}</td>
                                <td className="text-center">{board.hit}</td>
                            </tr>
                        ))}

                        <tr>
                            <td colSpan={5} className="text-center">
                                <button className="btn btn-secondary btn-sm">
                                    이전
                                </button>{" "}
                                {data?.data.curpage} / {data?.data.totalpage}{" "}
                                <button className="btn btn-secondary btn-sm">
                                    다음
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );


}

export default BoardList