import "../styles/Header.css";
import logo from "../assets/image/lte.png";
import LogoutIcon from "../assets/icon/exit.png";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import api from "../Api";
import config from "../Config";
import { useState } from "react";


function Header() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [loggingOut, setLoggingOut] = useState(false);

    let userName = "";

    try {
        userName =
            JSON.parse(localStorage.getItem("user"))?.username || "null"
        ?.username ||"";
    } catch {
        
    }

    const handleLogout = async () => {
        if(loggingOut) return;
        setLoggingOut(true);

        try {
            const { data } = await api.post(
                config.AUTH.LOGOUT,
            {});
            

        if (data?.isSuccess === false) {
            throw new Error ("로그아웃 실패");
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth:changed"));
        navigate("/login", { replave: true });
        } catch {
            alert("로그아웃에 실패했습니다.");

        } finally {
            setLoggingOut(false); 
    }
    }

    if (pathname === "/login") return null;

    return (
        <header className="header">
            <div className="header-left">
                <img src={logo} alt="LTE 로고" className="header-logo"/>
                <span className="header-title">Lion To-do Everyday</span>
            </div>

            <nav className="header-nav">
                <NavLink to = "/" className= {({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                홈
                </NavLink>

                 <NavLink to="/friends" className= {({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    친구
                </NavLink>

                 <NavLink to="/mypage" className= {({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    마이페이지
                </NavLink>
            </nav>

            <div className="header-right">
                <span className="user-name">{userName ? `${userName}님` : ""}</span>
                <img src={LogoutIcon} alt="로그아웃" className="logout-icon" onClick={handleLogout}/>
            </div>

        </header>
    );
}

export default Header;