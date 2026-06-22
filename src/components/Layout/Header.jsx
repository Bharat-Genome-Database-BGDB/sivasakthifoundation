// src/components/Layout/Header.jsx
'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@db/supabaseClient";
import "@styles/header.css";

/**
 * @component Header
 * @description The Master Double-Header Navigation for the Sivasakthi ecosystem matching original design, colors, and dropdown structures.
 */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("public");

  const pathname = usePathname();
  const menuRef = useRef();

  // --- Auth & Role Listener (POT "Shift-Left" logic retained for scalability) ---
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();
  }, []);

  // --- Master Navigation Configuration with Dropdown Menus from FAQ Source ---
  const navLinks = [
    { label: "Home", to: "/" },
    {
      label: "About Us",
      to: "#",
      dropdown: [
        { label: "Our Story", to: "/about/ourstory" },
        { label: "Board of Trustees", to: "/about/trustees" },
        { label: "Financial Transparency", to: "/about/transparency" }
      ]
    },
    {
      label: "Projects",
      to: "#",
      dropdown: [
        { label: "Projects & Initiatives", to: "/projects/initiatives" },
      ]
    },
    { label: "Contact Us", to: "/contact" },
  ];

  const handleDropdownToggle = (index, e) => {
    e.preventDefault();
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <header className="site-header" ref={menuRef}>
      {/* 1. Top Bar Wrapper Section */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <span className="top-info-item">
              <i className="fas fa-envelope"></i> info@sivasakthifoundation.org
            </span>
          </div>
          <div className="top-bar-socials">
            <a href="https://www.linkedin.com/company/sivasakthi-science-foundation" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://x.com/SSF_handle" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.youtube.com/@SivasakthiScienceFoundation" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.instagram.com/sivasakthiscience/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>

          </div>
        </div>
      </div>

      {/* 2. Main Navigation Shell */}
      <div className="main-nav-container">
        <div className="nav-wrapper">
          {/* Branding Area */}
          <Link href="/" className="header__brand">
            <img src="/images/global/Logo.png" alt="Sivasakthi Logo" className="brand-logo" />
            <div className="brand-text">
              <h1 className="brand-title">Sivasakthi Science Foundation™</h1>
              <p className="brand-tagline">Advancing Research, Training & Education</p>
            </div>
          </Link>

          {/* Mobile Menu Button Toggle */}
          <button
            className={`mobile-nav-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation menu"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>

          {/* Core Menu List */}
          <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              {navLinks.map((link, index) => (
                <li key={index} className={`nav-item ${link.dropdown ? 'has-dropdown' : ''}`}>
                  {link.dropdown ? (
                    <>
                      <a
                        href="#"
                        className={`nav-link-item ${openDropdown === index ? 'active' : ''}`}
                        onClick={(e) => handleDropdownToggle(index, e)}
                      >
                        {link.label} <i className="fas fa-chevron-down dropdown-arrow"></i>
                      </a>
                      <ul className={`dropdown-menu ${openDropdown === index ? 'show' : ''}`}>
                        {link.dropdown.map((subLink, subIndex) => (
                          <li key={subIndex} className="dropdown-item">
                            <Link
                              href={subLink.to}
                              className="dropdown-link-item"
                              onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}
                            >
                              {subLink.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={link.to}
                      className={`nav-link-item ${pathname === link.to ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="nav-item nav-cta-item">
                <Link href="/signin" className="nav-signin-btn" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;