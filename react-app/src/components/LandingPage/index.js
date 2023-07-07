import React, { useState, useRef, useEffect } from 'react';
import "./LandingPage.css"
import LoginFormPage from '../LoginFormPage';

function LandingPage() {

  return (
    <main className='lp-container'>
      <section className='lp-video-section'>

      <h1 className='lp-description'>
        Aura
      </h1>
      
      <video autoPlay loop muted className="lp-video">
        <source src="https://res.cloudinary.com/dtzv3fsas/video/upload/v1687240796/Aura/FootageCrate-Looping_Magic_Ball_Powercore-matte_wcz6ya.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      </section>
      <section className='lp-sign-in-section'>
        <LoginFormPage />
      </section>
    </main>
  );
}

export default LandingPage;
