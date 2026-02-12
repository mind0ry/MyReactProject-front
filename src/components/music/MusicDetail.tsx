import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {MusicItem} from "../../commons/commonsData";
import apiClient from "../../http-commons";
import {AxiosResponse} from "axios";
import MusicVideo from "../youtube/MusicVideo";

function MusicDetail() {

    const {no} = useParams()

    const {isLoading, isError, error, data} = useQuery<AxiosResponse<MusicItem>, Error>({
        queryKey:['music-detail', no],
        queryFn: async () => {
            return await apiClient.get(`/music/detail_react/${no}`)
        },
        refetchOnMount: "always"
    })
    if(isLoading) {
        return <div className={"text-center"}>Loading...</div>
    }
    if(isError) {
        return <div className={"text-center"}>{error?.message}</div>
    }
    const music:MusicItem|undefined=data?.data;

    let genre

    switch(music?.cno) {
        case 1:
            genre="가요"
            break;
        case 2:
            genre="가요"
            break;
        case 3:
            genre="POP"
            break;
        case 4:
            genre="OST"
            break;
        case 5:
            genre="트롯"
            break;
        case 6:
            genre="JAZZ"
            break;
        case 7:
            genre="CLASSIC"
            break;
    }

    let icon
    if (music?.state==='상승') {
        icon='▲'
    } else if (music?.state==='하강') {
        icon='▽'
    } else {
        icon='-'
    }

    return (
        <div id="main-wrapper">
            <div className="container">
                <div className="row hit-area">
                    <div><span className={"detail-title"}>조회수&nbsp;</span> {music?.hit}</div>
                </div>
                <div className="row">

                    <table className="table" style={{width:"100%"}}>
                        <tbody>
                        <tr>
                            <td className={"text-center detail-title"} rowSpan={6} width={"30%"}>
                                <img src={music?.poster} style={{"width":"350px", "height":"300px"}} />
                            </td>
                            <td colSpan={2}><h3 style={{"marginLeft":"60px"}}>{music?.title}</h3></td>
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
            </div>
        </div>
    )
}
export default MusicDetail;