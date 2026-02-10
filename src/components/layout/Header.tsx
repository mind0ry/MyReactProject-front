import {Link} from "react-router-dom";

function Header() {
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
                            <li className="current"><Link to={"/"}>Home</Link></li>
                            <li>
                                <Link to={"/music/list"}>노래</Link>
                                <ul>
                                    <li><a href="#">Lorem ipsum dolor</a></li>
                                    <li><a href="#">Magna phasellus</a></li>
                                    <li>
                                        <a href="">Phasellus consequat</a>
                                        <ul>
                                            <li><a href="#">Lorem ipsum dolor</a></li>
                                            <li><a href="#">Phasellus consequat</a></li>
                                            <li><a href="#">Magna phasellus</a></li>
                                            <li><a href="#">Etiam dolore nisl</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="#">Veroeros feugiat</a></li>
                                </ul>
                            </li>
                            <li><a href="left-sidebar.html">노래 추천</a></li>
                            <li><a href="right-sidebar.html">Right Sidebar</a></li>
                            <li><a href="no-sidebar.html">로그인</a></li>
                        </ul>
                    </nav>

                </header>
            </div>
        </>
    )
}

export default Header;