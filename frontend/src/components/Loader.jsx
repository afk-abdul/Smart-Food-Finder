import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="food-loader">
        <div className="plate">
          <div className="burger">
            <div className="burger-top"></div>
            <div className="lettuce"></div>
            <div className="cheese"></div>
            <div className="burger-patty"></div>
            <div className="burger-bottom"></div>
          </div>
          <div className="plate-shadow"></div>
        </div>
        <span className="ml-2">{text}</span>
      </div>

      <style jsx>{`
        .food-loader {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .plate {
          position: relative;
          width: 24px;
          height: 24px;
        }

        .burger {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          animation: bounce 1s infinite alternate;
          transform-origin: center bottom;
        }

        .burger-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 30%;
          background-color: #f59e0b;
          border-radius: 50% 50% 0 0;
        }

        .lettuce {
          position: absolute;
          top: 30%;
          left: 5%;
          width: 90%;
          height: 10%;
          background-color: #22c55e;
          border-radius: 2px;
        }

        .cheese {
          position: absolute;
          top: 40%;
          left: 0;
          width: 100%;
          height: 10%;
          background-color: #fcd34d;
          border-radius: 2px;
        }

        .burger-patty {
          position: absolute;
          top: 50%;
          left: 5%;
          width: 90%;
          height: 20%;
          background-color: #7c2d12;
          border-radius: 2px;
        }

        .burger-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 30%;
          background-color: #f59e0b;
          border-radius: 0 0 50% 50%;
        }

        .plate-shadow {
          position: absolute;
          bottom: -2px;
          left: 10%;
          width: 80%;
          height: 4px;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          filter: blur(1px);
          animation: shadow-pulse 1s infinite alternate;
        }

        @keyframes bounce {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-5px);
          }
        }

        @keyframes shadow-pulse {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
