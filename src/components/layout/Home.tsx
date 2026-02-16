import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {AxiosResponse} from "axios";
import {MusicItem} from "../../commons/commonsData";
import apiClient from "../../http-commons";

function Home() {

    const {isLoading, isError, error, data} = useQuery<AxiosResponse<MusicItem[]>, Error>({
        queryKey: ['music', 'top3'],
        queryFn: async () => {
            return await apiClient.get(`/music/top3`)
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
        <>
            <div id="banner-wrapper">
                <div id="banner" className="box container">
                    <div className="row">
                        <div className="7u">
                            <h2>개인프로젝트</h2>
                            <p>React-query & Typescript</p>
                        </div>
                        <div className="5u">
                            <ul>
                                <li><Link to={"/music/list"} className="button big icon fa-arrow-circle-right">노래 목록</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div id="features-wrapper">
                <div className="container" style={{"marginTop":"100px"}}>
                    <h3>
                        TOP3 노래
                    </h3>
                    <div className="row">
                        {
                            data && data?.data.map((music)=>(
                                <div className="4u" key={music.no}>

                                    <section className="box feature">
                                        <Link to={"/music/detail/"+music.no} className="image featured"><img src={music.poster}/></Link>
                                        <div className="inner">
                                            <header>
                                                <h2>{music.title}</h2>
                                                <p>{music.singer}</p>
                                            </header>
                                        </div>
                                    </section>

                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;