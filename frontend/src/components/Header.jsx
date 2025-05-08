import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { Logout } from "../redux/AuthSlice";
// Removed from the top level and will be added inside the Header component


const Header = () => {
  const user = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
      if (res.status === 200) {
        dispatch(Logout());
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-text">Course</span>Mania
          </Link>

          {/* Hamburger Menu Icon */}
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Navigation */}
          <nav className={`nav ${menuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/PublicCourse" className="nav-link">Courses</Link>
            <Link to="/tutors" className="nav-link">Tutors</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          {/* Auth Buttons / Profile Dropdown / Cart */}
          <div className={`auth-cart ${menuOpen ? "active" : ""}`}>
            {user ? (
              <div
              className="user-menu"
              onMouseEnter={() => {
                if (hideTimeout) clearTimeout(hideTimeout);
                setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setDropdownOpen(false);
                }, 300); // 300ms delay before hiding
                setHideTimeout(timeout);
              }}
            >
            
                <div className="user-initials">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <span className="dropdown-item">Hi, {user.name?.split(" ")[0]}</span>
                    <Link to="/student/profile" className="dropdown-item">Profile</Link>
                    <Link to="/student/my-courses" className="dropdown-item">My Courses</Link>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="login">Login</Link>
                <Link to="/register" className="register">Register</Link>
              </>
            )}
            <Link to="/cart" className="cart">
              <FaShoppingCart size={20} />
              <span className="cart-badge">1</span>
            </Link>
          </div>
        </div>
      </header>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .header {
          width: 100%;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 30px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #008080;
          text-decoration: none;
        }

        .logo-text {
          font-weight: bold;
          color: #008080;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
          color: #333;
        }

        .nav {
          display: flex;
          gap: 20px;
        }

        .nav-link {
          text-decoration: none;
          font-size: 16px;
          color: #333;
          padding: 5px 10px;
          transition: color 0.3s ease-in-out;
        }

        .nav-link:hover {
          color: #008080;
        }

        .auth-cart {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .login,
        .register {
          text-decoration: none;
          font-size: 14px;
          padding: 8px 15px;
          border-radius: 5px;
          transition: 0.3s ease;
        }

        .login {
          color: #008080;
        }

        .register {
          background-color: #008080;
          color: white;
          font-weight: bold;
          border: none;
        }

        .register:hover {
          background-color: #006060;
        }

        .cart {
          position: relative;
          color: #333;
        }

        .cart-badge {
          background-color: red;
          color: white;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 50%;
          position: absolute;
          top: -5px;
          right: -10px;
        }

        .user-menu {
          position: relative;
        }

        .user-initials {
          background-color: #008080;
          color: white;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
        }

        .user-dropdown {
          position: absolute;
          top: 45px;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-radius: 6px;
          min-width: 160px;
          z-index: 10;
        }

        .dropdown-item {
          display: block;
          padding: 10px 15px;
          text-decoration: none;
          color: #333;
          font-size: 14px;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background-color: #f0f0f0;
        }

        .logout-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .nav,
          .auth-cart {
            display: none;
            flex-direction: column;
            width: 100%;
            margin-top: 10px;
          }

          .nav.active,
          .auth-cart.active {
            display: flex;
          }

          .header-container {
            flex-direction: column;
            align-items: flex-start;
          }

          .nav-link,
          .login,
          .register {
            width: 100%;
            text-align: left;
            padding: 10px 0;
          }

          .cart {
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
