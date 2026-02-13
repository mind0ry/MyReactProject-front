import {YoutubeItem, YoutubeResponse} from "../../commons/commonsData";

const API_KEY = "AIzaSyDB75k8XuyFXiXfB8E1TVLNvEV1vBDeaNI";
export const YoutubeApi=async (keyword:string):Promise<YoutubeResponse> => {
    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResult=1&q=${keyword}&type=video&key=${API_KEY}`)
    if (!response.ok){
        throw new Error("YouTubeApi returned an error");
    }
    return await response.json();
}