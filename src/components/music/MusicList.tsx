import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import apiClient from "../../http-commons";
import {Link} from "react-router-dom";
import {AxiosResponse} from "axios";
import {MusicData} from "../../commons/commonsData";

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
                    <div className="col-md-3">
                        <div className="thumbnail">
                            <a href="/w3images/lights.jpg" target="_blank">
                                <img src="/w3images/lights.jpg" alt="Lights" style={{"width":"100%"}}/>
                                <div className="caption">
                                    <p>Lorem ipsum donec id elit non mi porta gravida at eget metus.</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MusicList;