import React, { useEffect } from 'react';
import '../Css/Home.css';
import backvideo from '../images/background_video.mp4';
import home_wedding2 from '../images/home_wedding2.png';
import home_photography2 from '../images/home_photography2.png';
import home_food2 from '../images/home_food2.png';
import home_party2 from '../images/home_party2.png';
import home_gifts from '../images/home_gifts.png';

function Home() {
  useEffect(() => {
    window.addEventListener('scroll', reveal);

    return () => {
      window.removeEventListener('scroll', reveal);
    };
  }, []);

  function reveal() {
    let reveals = document.querySelectorAll('.deanreveal');
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var revealTop = reveals[i].getBoundingClientRect().top;
      var revealPoint = 150;

      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add('deanactive');
      } else {
        reveals[i].classList.remove('deanactive');
      }
    }
  }

  return (
    <>
      <div className="deanhero">
        <video autoPlay loop muted playsInline className="deanback-video">
          <source src={backvideo} type="video/mp4" />
        </video>

        <div className="deanname">
          <h1 style={{fontFamily:"Arial"}}>Frame Your Memories</h1>
          <a href="#homecontent">Explore</a>
        </div>
      </div>

      <div className="deanflex1" id="homecontent">
        <div className="deanflex1 deanreveal">
          <div className="deaninfo ">
            <img src={home_wedding2} alt="Image" />
          </div>
          <div className="deaninfo">
            <h1>
              WEDDING
            </h1>
            <p>
              <b>
                Event Planning is what we do.Our team will help you to create
                wonderful memories.Make your event the best day ever..
              </b>
              
            </p>
          </div>
        </div>

        <div className="deanflex1 deanreveal">
          <div className="deaninfo">
            <h1>
              PHOTOGRAPHY
            </h1>
            <p>
              <b>
                More Than Just Event Planning,Our team will help you to capture
                all your timeless memories.After all Fond Memories Are
                Treasures That Will Last A Lifetime.
              </b>
            </p>
          </div>
          <div className="deaninfo">
            <img src={home_photography2} alt="Image" />
          </div>
        </div>

        <div className="deanflex1 deanreveal">
          <div className="deaninfo">
            <img src={home_food2} alt="Image" />
          </div>
          <div className="deaninfo">
            <h1>
              FOOD
            </h1>
            <p>
              <b>
                Let your guests enjoy your event with some delicious recepies!
                To live a full life, you have to fill your stomach first.
              </b>
            </p>
          </div>
        </div>

        <div className="deanflex1 deanreveal">
          <div className="deaninfo">
            <h1>
              PARTY
            </h1>
            <p>
              <b>
                "It's party time.This is your moment so just feel alive and
                till the music is gone, let's party on.
              </b>
            </p>
          </div>
          <div className="deaninfo">
            <img src={home_party2} alt="Image" />
          </div>
        </div>

        <div className="deanflex1 deanreveal">
          <div className="deaninfo">
            <img src={home_gifts} alt="Image" />
          </div>
          <div className="deaninfo">
            <h1>
              GIFTS
            </h1>
            <p>
              <b>
                No event is complete without some exciting gifts.Our team is
                also providing some cool gifts to make your loved ones smile.
              </b>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
