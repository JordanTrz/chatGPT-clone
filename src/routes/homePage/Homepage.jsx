import "./homePage.css";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const imgMap = {
  human1: "/human1.jpeg",
  human2: "/human2.jpeg",
  bot: "/bot.png",
};

const HomePage = () => {
  const [typingState, setTypingState] = useState("human12");

  return (
    <div className="homePage">
      <img src="/orbital.png" alt="" className="orbital" />
      <div className="left">
        <h1>Chat AI</h1>
        <h2>Unleash all your potential</h2>
        <h3>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
          animi.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat">
            <img src={imgMap[typingState] ?? "/bot.png"} alt="" />
            <TypeAnimation
              sequence={[
                "human1: We produce food for Mice",
                2000,
                () => {
                  setTypingState("bot");
                },
                "bot: We produce food for Hamsters",
                2000,
                () => {
                  setTypingState("human2");
                },
                "human2: We produce food for Guinea Pigs",
                2000,
                () => {
                  setTypingState("bot");
                },
                "bot: We produce food for Chinchillas",
                2000,
                () => {
                  setTypingState("human1");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
