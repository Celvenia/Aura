import React, { useLayoutEffect } from "react";
import "./LandingPage.css";
import LpVid from "../../assets/LpVid.mp4";

function LandingPage() {
  function displayText(text) {
    let lpTitle = document.getElementsByClassName("lp-title")[0];
    let lpSubtitle = document.getElementsByClassName("lp-subtitle")[0];
    let index = 0;
    let delay = 50;
    lpTitle.textContent = "";
    lpSubtitle.textContent = "";

    function typeNextCharacter() {
      const currentCharacter = text.charAt(index);
      if (index < text.length) {
        if (index < 16) {
          lpTitle.textContent += currentCharacter;
        } else {
          lpSubtitle.textContent += currentCharacter;
        }
        index++;
        setTimeout(typeNextCharacter, delay);
      }
    }

    typeNextCharacter();
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      displayText(
        "Welcome To Aura Leveraging The Power Of AI To Effortlessly Manage Your Time"
      );
    }, 2000);
  }, []);

  return (
    <main className="lp-container">
      <section className="lp-video-section">
        <video src={LpVid} autoPlay loop muted playsInline />

        <div className="lp-overlay-text">
          <h1 className="lp-title"></h1>
          <p className="lp-subtitle"></p>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
