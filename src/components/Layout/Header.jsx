'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@db/supabaseClient";
import "@styles/header.css";

/**
 * @component Header
 * @description The Master Double-Header Navigation for Sivasakthi Science Foundation (SSF).
 */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  // const isFounderOrAdmin = ['Founder', 'admin', 'director'].includes(userRole);

  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef();

  // --- Check Supabase Auth Session ---
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    checkUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoadingUser(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // --- Sign Out Handler ---
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpenDropdown(null);
    router.push("/");
  };

  // --- SSF Master Navigation Configuration ---
  const navLinks = [
    {
      label: "About Us",
      to: "#",
      dropdown: [
        { label: "Our Story", to: "/about/ourstory" },
        { label: "Board of Trustees", to: "/about/trustees" },
        { label: "Partners & Collaborations", to: "/about/partners" },
        { label: "Financial Transparency", to: "/about/transparency" }
      ]
    },
    {
      label: "Projects",
      to: "#",
      dropdown: [{ label: "Projects & Initiatives", to: "/projects/initiatives" }]
    },
    { label: "Blogs", to: "/blogs" },
    { label: "Contact Us", to: "/contact" },
  ];

  // --- Logged-In User Dropdown Configuration ---
  const getUserDropdownConfig = (userEmail) => ({
    label: userEmail,
    to: "#",
    dropdown: [
      { label: "Message Dashboard", to: "/admin/dashboard" },
      { label: "Create a Blog", to: "/admin/create-blog" }
    ]
  });

  const SSF_ECOSYSTEM = [
    { name: "SSF", url: "https://www.sivasakthifoundation.org", active: true },
    { name: "GenAI", url: "https://genairesearch.org" },
    { name: "BGDB", url: "https://bharatgenomedatabase.org", active: false },
    { name: "AarogyaSakthi", url: "https://aarogyasakthi.com" },
  ];

  const handleDropdownToggle = (index, e) => {
    e.preventDefault();
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <header className="site-header" ref={menuRef}>
      {/* 1. Top Bar: SSF Ecosystem & Social Links */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="top-bar-left">
            <nav className="top-bar-ecosystem">
              {SSF_ECOSYSTEM.map((site, index) => (
                <div key={site.name} className="nav-wrapper-item">
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`nav-item-link ${site.active ? 'ecosystem-active' : ''}`}
                  >
                    {site.name}
                  </a>
                  {index < SSF_ECOSYSTEM.length - 1 && <span className="separator">|</span>}
                </div>
              ))}
            </nav>
          </div>
          <div className="top-bar-socials">
            <a href="https://www.linkedin.com/company/sivasakthi-science-foundation" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://x.com/SSF_handle" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.youtube.com/@SivasakthiScienceFoundation" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.instagram.com/sivasakthiscience/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Shell */}
      <div className="main-nav-container">
        <div className="nav-wrapper">
          <Link href="/" className="header__brand">
            <img src="/images/global/Logo.png" alt="Sivasakthi Logo" className="brand-logo" />
            <div className="brand-text">
              <h1 className="brand-title">
                Sivasakthi Science Foundation™
              </h1>
              <p className="brand-tagline">Advancing Research, Training & Education</p>
            </div>
          </Link>

          <button
            className={`mobile-nav-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>

          <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              {navLinks.map((link, index) => (
                <li key={index} className="nav-item">
                  {link.dropdown ? (
                    <>
                      <a href="#" className={`nav-link-item ${openDropdown === index ? 'active' : ''}`} onClick={(e) => handleDropdownToggle(index, e)}>
                        {link.label} <i className="fas fa-chevron-down dropdown-arrow"></i>
                      </a>
                      <ul className={`dropdown-menu ${openDropdown === index ? 'show' : ''}`}>
                        {link.dropdown.map((sub, subIdx) => (
                          <li key={subIdx}>
                            <Link href={sub.to} className="dropdown-link-item">
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link href={link.to} className={`nav-link-item ${pathname === link.to ? 'active' : ''}`}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}

              {/* Authentication State Integration at the End of Menus */}
              {!loadingUser && (
                <li className="nav-item">
                  {user ? (
                    /* Logged In: Dynamic User Email Dropdown */
                    (() => {
                      const userMenu = getUserDropdownConfig(user.email);
                      const dropdownKey = 'user-account';
                      return (
                        <>
                          <a
                            href="#"
                            className={`nav-link-item ${openDropdown === dropdownKey ? 'active' : ''}`}
                            onClick={(e) => handleDropdownToggle(dropdownKey, e)}
                          >
                            {userMenu.label} <i className="fas fa-chevron-down dropdown-arrow"></i>
                          </a>
                          <ul className={`dropdown-menu ${openDropdown === dropdownKey ? 'show' : ''}`}>
                            {userMenu.dropdown.map((sub, subIdx) => (
                              <li key={subIdx}>
                                <Link href={sub.to} className="dropdown-link-item">
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                            <li className="centre">
                              <button
                                onClick={handleSignOut}
                                className="btn-solid"
                              >
                                Sign Out
                              </button>
                            </li>
                          </ul>
                        </>
                      );
                    })()
                  ) : (
                    /* Not Logged In: Centered Sign In Button */
                    <div className="btn-center-container">
                      <Link href="/admin/dashboard" className="btn-solid">
                        Sign In
                      </Link>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;