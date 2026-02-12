import {Link} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import {useMutation} from "@tanstack/react-query";
import {AxiosError, AxiosResponse} from "axios";
import apiClient from "../../http-commons";

function Header() {

    const [login, setLogin] = useState<boolean>(false);
    const [id, setId] = useState<string>();
    const [pwd, setPwd] = useState<string>();

    const idRef=useRef<HTMLInputElement>(null);
    const pwdRef=useRef<HTMLInputElement>(null);

    interface LoginData {
        msg:string;
        id?:string;
        name?:string;
    }

    const {mutate:loginOk}=useMutation({
        mutationFn:async (data)=>{
            const res:AxiosResponse<LoginData>=await apiClient.get(`/member/login/${id}/${pwd}`)
            return res.data
        },
        onSuccess:(data:LoginData)=>{
            if(data.msg==='NOID') {
                alert("아이디가 존재하지 않습니다")
                setId('')
                setPwd('')
                idRef.current?.focus()
            } else if(data.msg==='NOPWD') {
                alert('비밀번호가 틀립니다')
                setPwd('')
                pwdRef.current?.focus()
            } else if(data.msg==='OK' && data.id && data.name) {
                // !는 값이 있는 경우 => null || undefined
                window.sessionStorage.setItem("id",data.id)
                window.sessionStorage.setItem("name", data.name)
                setLogin(true)
                window.location.reload()
            }
        },
        onError:(error:AxiosError)=>{
            console.log("Login error:", error.message);

        }
    })

    useEffect(() => {
        if(sessionStorage.getItem("id")) {
            setLogin(true)
        }
    });

    const memberLogin=()=>{
        if(!id || id.trim()==='') {
            idRef.current?.focus()
            return
        }
        // !pwd => null / undefined가 아닌 경우
        if(!pwd || pwd.trim()==='') {
            pwdRef.current?.focus()
            return
        }
        loginOk() // useMutation호출 => mutate / useQuery => refetch
    }

    const memberLogout=()=>{
        window.sessionStorage.clear(); // invalidate
        setId('')
        setPwd('')
        setLogin(false)
        window.location.reload()
    }

    return (
        <>
            <div id="header-wrapper">
                <header id="header" className="container">

                    <div id="logo">
                        <h1><Link to={"/"}>Music</Link></h1>
                        <span>by 김민석</span>
                    </div>

                    <nav id="nav">
                        <ul>
                            <li><Link to={"/music/list"}>노래</Link></li>
                            <li><a href="left-sidebar.html">노래 추천</a></li>
                            <li><a href="right-sidebar.html">자유게시판</a></li>
                            <li style={{"paddingLeft":"80px"}}>
                                <div className="signup-search-area d-flex align-items-center justify-content-end">
                                    <div className="login_register_area d-flex">
                                        {
                                            !login?(
                                                <div className={"login"}>
                                                    ID&nbsp;<input type={"text"} size={10} className={"input-sm"} ref={idRef} value={id} onChange={(e:any)=>{setId(e.target.value)}}/>
                                                    &nbsp;
                                                    PW&nbsp;<input type={"password"} size={10} className={"input-sm"} ref={pwdRef} value={pwd} onChange={(e:any)=>{setPwd(e.target.value)}}/>
                                                    &nbsp;
                                                    <button className={"btn-sm btn-default"} onClick={memberLogin} style={{"backgroundColor":"gray", "fontWeight":"bold", "color":"white"}}>로그인</button>
                                                </div>):(
                                                <div className={"login"}>
                                                    <span style={{"paddingRight":"20px" , "color": "black"}}>{window.sessionStorage.getItem("name")} 님</span>
                                                    <button className={"btn-sm btn-default"} onClick={memberLogout} style={{"backgroundColor":"gray", "fontWeight":"bold", "color":"white"}}>로그아웃</button>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </nav>

                </header>
            </div>
        </>
    )
}

export default Header;