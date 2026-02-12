// list & detail
export interface MusicItem {
    no: number;
    cno: number;
    rank: number;
    idcrement: number;
    hit: number;
    likecount: number;
    title: string;
    singer: string;
    album: string;
    poster: string;
    state: string;
    key: string;
}

export interface MusicData {
    list: MusicItem[];
    curpage: number;
    totalpage: number;
    startPage: number;
    endPage: number;
}

// youtube
export interface YoutubeItem {
    id: {
        videoId: string;
    }
    snippet: {
        title: string;
        description: string;
        thumbnail: {
            medium: {
                url: string;
            }
        }
    }
}
export interface YoutubeResponse {
    items: YoutubeItem[];
}