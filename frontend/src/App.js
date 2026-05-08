import "./App.css";
import { useRef, useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import { Toaster } from "react-hot-toast";
import Upload from "./components/Upload";
import FileList from "./components/FileList";
import Admin from "./pages/Admin";

function App() {

  const uploadRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  // const fileListRef = useRef(null);
  const [showNavbar, setShowNavbar] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") ||
    !!localStorage.getItem("guest")
  );
  const [darkMode, setDarkMode] = useState(true);
  const [showFiles, setShowFiles] = useState(false);
  // const isGuest = localStorage.getItem("guest") === "true";

  useEffect(() => {

    if (!localStorage.getItem("guestId")) {
      localStorage.setItem(
        "guestId",
        "guest_" + Date.now()
      );
    }
  }, []);

  useEffect(() => {
    const tokenTime = localStorage.getItem("loginTime");
    if (tokenTime) {
      const currentTime = Date.now();
      const diff = currentTime - Number(tokenTime);
      const oneHour = 60 * 60 * 1000;
      if (diff > oneHour) {
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");
        setIsLoggedIn(false);
      }
    }
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);
  useEffect(() => {
    document.body.className = darkMode ? "" : "light";
  }, [darkMode]);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  return (

    <div className={`app ${darkMode ? "" : "light"}`}>

      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="glow glow-3"></div>
      <div className="glow glow-4"></div>
      <div className="glow glow-5"></div>

      {/* BACKGROUND */}
      {/* <div className="background-grid"></div>
      <div className="background-glow glow-1"></div>
      <div className="background-glow glow-2"></div> */}

      {/* NAVBAR */}
      <nav className={`navbar ${showNavbar ? "show" : "hide"}`}>

        <div className="nav-left">

          <div className="logo">
            <div className="logo-icon">⚡</div>
            <span>QuickShare</span>
          </div>
        </div>

        <div className="nav-center">

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              })
            }
          >
            Home
          </button>

          <button onClick={() => scrollToSection(uploadRef)}>
            Upload
          </button>

          <button onClick={() => scrollToSection(featuresRef)}>
            Features
          </button>

          <button onClick={() => scrollToSection(statsRef)}>
            Stats
          </button>

          <button onClick={() => setShowFiles(true)}>
            Uploaded Files
          </button>

          {!localStorage.getItem("guest") && (
            <button
              onClick={() => window.location.href = "/admin"}
            >
              Admin
            </button>
          )}

        </div>

        <div className="nav-auth">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            className="get-started-btn"
            onClick={() => {
              localStorage.setItem("guest", "true");
              setIsLoggedIn(true);
            }}
          >
            Guest
          </button>
          
          {isLoggedIn  ? (
            <button
              className="login-btn"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("guest");
                localStorage.removeItem("loginTime");

                const newGuestId =
                  "guest_" + Date.now();

                localStorage.setItem(
                  "guestId",
                  newGuestId
                );

                setIsLoggedIn(false);

                window.location.reload();

              }}
            >
              Logout
            </button>

          ) : (

            <>
              <button
                className="login-btn"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>

              <button
                className="get-started-btn"
                onClick={() => setShowSignup(true)}
              >
                Get Started
              </button>
            </>

          )}

        </div>

      </nav>

      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            ✨ END-TO-END ENCRYPTED • NO SIGNUP
          </div>

          <h1 className="hero-title">
            {"QuickShare".split("").map((letter, index) => (
              <span
                key={index}
                className="hero-letter"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                {letter}
              </span>
            ))}
          </h1>

          <p className="hero-subtext">
            Share files instantly with secure, lightning-fast links.
            Drag, drop, done — your private link expires in 24 hours.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn"
            onClick={() => scrollToSection(uploadRef)}
            >
              Upload File →
            </button>

            <button
              className="secondary-btn"
              onClick={() => scrollToSection(featuresRef)}
            >
              Learn More
            </button>

          </div>

          <div className="hero-status">

            <span className="status-dot"></span>

            <span>ALL SYSTEMS OPERATIONAL</span>

            <span className="status-divider">•</span>

            <span>v2.4.1</span>

          </div>

        </div>

      </section>

      {/* UPLOAD */}
      <section
        ref={uploadRef}
        className="upload-section"
      >

        <div className="upload-heading">

          <p className="upload-tag">
            01 — DROP & SHARE
          </p>

          <h2 className="upload-title">
            Upload a file. Get a secure link.
          </h2>

          <p className="upload-subtitle">
            Files up to 100MB. Links expire automatically after 24 hours.
          </p>

        </div>

        <div className="upload-container">
          <Upload />
        </div>

      </section>

      {/* FEATURES */}
      <section
        ref={featuresRef}
        className="features-section section-spacing"
      >

        <div className="section-container">

          <div className="text-center mb-16">

            <p className="section-label">
              BUILT DIFFERENT
            </p>

            <h2 className="section-title">

              Everything you need.
              <br />

              <span>
                Nothing you don’t.
              </span>

            </h2>

          </div>

          <div className="features-grid">

            {[
              ["⚡", "Fast File Upload", "Multi-threaded transfers and edge caching deliver your files at light speed anywhere on Earth."],
              ["🔒", "Secure Sharing", "AES-256 at rest, TLS 1.3 in transit. Tokenized links that only your recipient can open."],
              ["⏱️", "Temporary Access", "Every link self-destructs after 24 hours. Keep control of what you share, automatically."],
              ["👤", "No Signup Required", "Drop a file, copy your link. No accounts, no friction, no tracking. Just clean transfers."]
            ].map((item, index) => (

              <div
                key={index}
                className="feature-card group"
              >

                <div className="feature-glow"></div>

                <div className="feature-line"></div>

                <div className="feature-content">

                  <div className="feature-icon">
                    {item[0]}
                  </div>

                  <h3>
                    {item[1]}
                  </h3>

                  <p>
                    {item[2]}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* STATS */}
      <section
        ref={statsRef}
        className="stats-section"
      >

        <div className="section-container">

          <div className="text-center mb-16">

            <p className="section-label">
              NUMBERS DON'T LIE
            </p>

            <h2 className="section-title stats-title">
              Built for scale,
              <br />
              trusted globally
            </h2>

          </div>

          <div className="stats-grid">

            {[
              ["2.4M+", "FILES SHARED"],
              ["18+ GB", "DATA DELIVERED"],
              ["0.42s", "AVG TRANSFER"],
              ["99.98%", "UPTIME"]
            ].map((item, index) => (

              <div
                key={index}
                className="stat-card"
              >

                <h3>
                  {item[0]}
                </h3>

                <p>
                  {item[1]}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-left">
            <div className="footer-brand">
              <div className="footer-logo-circle">
                ⚡
              </div>
                <h2>QuickShare</h2>
              </div>
            <p>
              Premium file sharing for teams that move fast.
              Secure, simple, ephemeral.
            </p>
          </div>
          <div className="footer-links">
            <button onClick={() => scrollToSection(uploadRef)}>
              Upload
            </button>

            <button onClick={() => scrollToSection(featuresRef)}>
              Features
            </button>

            <button onClick={() => scrollToSection(statsRef)}>
              Stats
            </button>

            <button>
              Privacy
            </button>

            <button>
              Terms
            </button>

          </div>

        </div>

        <div className="footer-line"></div>

        <div className="footer-bottom">

          <p>
            © 2026 QuickShare. All rights reserved.
          </p>

          <div className="footer-status">

            <span className="status-dot"></span>

            <span>
              Operational • Region: Global Edge
            </span>

          </div>

        </div>

        <h3 className="footer-bg-text">
          QuickShare
        </h3>

      </footer>

        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}

        {showSignup && (
          <SignupModal
            onClose={() => setShowSignup(false)}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}

        {showFiles && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md pt-24 pb-6 px-6">
            <div
              className="
                relative
                w-[96vw]
                h-[92vh]
                overflow-y-auto
                overflow-x-hidden
                rounded-3xl
                border border-purple-500/20
                bg-[#070b1a]
                shadow-2xl
                pt-16
              "
            >

              <button
                onClick={() => setShowFiles(false)}
                className="
                  absolute top-4 right-4 z-50
                  w-10 h-10
                  rounded-full
                  bg-white/10
                  text-white
                  hover:bg-purple-500
                  transition
                "
              >
                ✕
              </button>

              <div className="w-full h-full overflow-auto">
                <FileList />
              </div>

            </div>

          </div>

        )}

        <Toaster position="top-right" />

    </div>

  );
}

export default App;