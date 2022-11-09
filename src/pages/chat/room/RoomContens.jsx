import React, { useCallback, useRef } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RoomContens.scss";
import io from "socket.io-client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loding from "./Loding";

function RoomContens(props) {
  const roomData = useSelector((state) => state);
  const [inputMeassage, setInputMessage] = useState("");
  const [receive, setReceive] = useState([]);
  const [joinUserName, setJoinUserName] = useState([]);

  const setMessage = (e) => {
    setInputMessage(e.target.value);
  };

  const socket = io.connect("http://localhost:4002");

  useEffect(() => {
    socket.emit("join", { name: roomData.user.username, userId: 1 });
    socket.on("joinMessage", (joinMessage) => {
      setJoinUserName(joinMessage.userEnter);
    });
  }, [roomData]);

  const sendMessage = () => {
    socket.emit("init", {
      name: roomData.user.username,
      message: inputMeassage,
    });
    setInputMessage("");
  };

  socket.on("message", (message) => {
    setReceive(message.chatData);
  });

  const navigate = useNavigate();
  const moveLoby = () => {
    socket.on("disconnect");
    navigate("/chat");
  };

  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [sendMessage]);

  return (
    <div className="room-contents-wrap">
      <div className="message-post-box">
        <div className="top-post-menu">
          <p className="room-info">
            <span className="room-member-max">2/4</span>방제목입니다1
          </p>
          <p className="room-menu-icon">
            컨텐츠 추가 구현중...
            <a className="move-loby" onClick={moveLoby}>
              나가기
            </a>
          </p>
        </div>
        <input
          className="post-input"
          type="text"
          value={inputMeassage}
          onChange={setMessage}
        />
        <button className="input-btn" onClick={sendMessage}>
          POST!
        </button>
      </div>
      <div className="view-input-message" ref={scrollRef}>
        {joinUserName.map((item) => {
          return <p className="login-user">► ► {item}님이 입장하셨습니다.</p>;
        })}

        {receive ? (
          receive.map((item) => {
            return (
              <li className="view-input-box">
                <div className="user-profile">
                  <img
                    className="user-profile-img"
                    src="./profile.png"
                    alt="유저프로필"
                  />
                  <p className="user-name">{item.name}</p>
                </div>
                <p className="user-text">{item.message}</p>
              </li>
            );
          })
        ) : (
          <Loding></Loding>
        )}
      </div>
    </div>
  );
}

export default RoomContens;
