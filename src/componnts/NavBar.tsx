import { useState } from 'react';
import Logo from "../assets/sf-green-bgless-long.png";
import "../styles/NavBarCss.css";
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  // 🔹 define menu toggle state
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()

  // const isLoged = localStorage.getItem("logedEmail")

  return (
    <nav className={menuOpen ? "active" : ""}>
      <img src={Logo} alt='LOGO.png' id='logoImage' />

      <section>
        <ul>
          <li onClick={()=> navigate("/explore")}>Explore</li>
          <li onClick={()=> navigate("/about")}>About Us</li>
          <li onClick={()=> navigate("/contact")}>Contact Us</li>
        </ul>
      </section>
      
      {/* 🔹 mobile menu button */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
