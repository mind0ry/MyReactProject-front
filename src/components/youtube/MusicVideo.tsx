import {useQuery} from "@tanstack/react-query";
import {YoutubeApi} from "./youtubeApi";
import {YoutubeItem, YoutubeResponse} from "../../commons/commonsData";

interface TitleProps {
    title: string;
}

function MusicVideo({title}:TitleProps) {

    const {isLoading,isError,error,data}=useQuery<YoutubeResponse, Error>({
        queryKey:['youtube', title],
        queryFn:()=>YoutubeApi(title+' 뮤직비디오')
    })

    if(isLoading){
        return <h1 className={"text-center"}>Loading...</h1>
    }
    if(isError){
        return <h1 className={"text-center"}>Error:{error.message}</h1>
    }

    const item:YoutubeItem|undefined = data?.items?.[0]

    return (
        <div key={item?.id.videoId}  style={{"width":"100%","margin":"0px auto"}}>
            <div className="single-post text-center">
                <div className="post-thumb">
                    <iframe
                        src={"https://www.youtube.com/embed/" + item?.id.videoId}
                        title={item?.snippet.title}
                        allowFullScreen={true}
                        width="850px" height={"450px"}
                    />
                </div>
            </div>
        </div>
    )
}

export default MusicVideo;