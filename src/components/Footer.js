import "../styles/Footer.css";


import logo from "../assets/image/lte.png";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <img src={logo} alt="LTE 로고" className="footer-logo" />
                <span className="footer-title"> Lion To-do Everyday </span>
            </div>

            <div className="footer-description"> LTE는 한국항공대학교 멋쟁이사자처럼에서 개발한 투두 관리 기반의 웹 서비스입니다. 

            </div>

            <div className="footer-info-grid">
                <div className="info-item">
                    <span> 상호명 : 한국항공대학교 멋쟁이사자처럼 </span> 
                </div>
                <div className= "info-item">
                    <span>대표자 : 김해름</span> 
                </div>

                <div className= "info-item">
                    <span> 주소 : 경기도 고양시 항공대학로 76 항공우주센터 3층 창업카페
</span> 
                </div>

                <div className="info-item">
                    <span>사업자 등록번호 : 333-22-55555 </span> 
                </div>

                <div className="info-item">
                    <span>개인정보 보호 책임자 : 김해름 </span> 
                </div>

                <div className="info-item">
                    <span>이메일 : its7637@kau.kr </span> 
                </div>

                <div className="info-item">
                    <span>전화번호 : 010-3627-7637 </span> 
                </div>

            </div>

    
        </footer>
    )
}

export default Footer;