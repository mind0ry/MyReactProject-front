import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import apiClient from "../../http-commons";
import {Link} from "react-router-dom";
import {AxiosResponse} from "axios";
import {MusicItem, MusicData} from "../../commons/commonsData";

function MusicList() {

    const [curpage, setCurpage] = useState<number>(1);
    const {isLoading, isError, error, data} = useQuery<AxiosResponse<MusicData>, Error>({
        queryKey: ['music-data', curpage],
        queryFn: async () => {
            return await apiClient.get(`/music/list_react/${curpage}`)
        }
    })
    if(isLoading) {
        return <div className="text-center">Loading...</div>
    }
    if(isError) {
        return <div className="text-center">Error : {error?.message}</div>
    }
    console.log(data?.data)

    return (
        <div id="main-wrapper">
            <div className="container">
                <div className="row">
                    {
                        data?.data.list && data?.data.list.map((music: MusicItem, index: number) =>
                            <div className="col-md-3" key={index}>
                                <div className="thumbnail">
                                    <a href="#" target="_blank">
                                        <img src={music.poster} alt="Lights" style={{"width":"100%"}}/>
                                        <div className="caption">
                                            <p>{music.title}</p>
                                            <p style={{"fontSize":"12px"}}>{music.singer}</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default MusicList;