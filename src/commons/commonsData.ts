export interface MusicList {
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
    list: MusicList[];
    curpage: number;
    totalpage: number;
    startPage: number;
    endPage: number;
}