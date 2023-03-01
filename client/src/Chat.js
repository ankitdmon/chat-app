import React, { useEffect, useState } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, userName, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagelist, setmessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setmessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      //   console.log(data);
      setmessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
        {messagelist.map((messageContent) => {
          return (
            <div
              className="message"
              id={userName === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text" value={currentMessage}
          placeholder="Message....."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
