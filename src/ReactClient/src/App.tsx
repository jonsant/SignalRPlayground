import React, { useEffect, useState } from 'react';
import './App.css';
import * as signalR from "@microsoft/signalr";
import { Message } from './Models/Message';

function App() {

  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [message, setMessage] = useState<string>("");
  const [username, setUsername] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatConnectionInfo, setChatConnectionInfo] = useState<string>("Disconnected");

  useEffect(() => {
    setUsername(new Date().getTime());
    startConnection();
  }, []);

  const startConnection = () => {
    const connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7024/hub")
    //.withAutomaticReconnect()
    .build();
    connection.start().then(result => {setChatConnectionInfo(connection.state)}).catch((err) => console.log("connection error: " + err));
    setConnection(connection);
  }

  connection?.on("messageReceived", (username: string, message: string) => {
    const msg = {username: username, message: message} as Message;
    const newMsgs: Message[] = [...messages];
    newMsgs.push(msg);
    setMessages(newMsgs);
  });

  connection?.onclose(() => {
    setChatConnectionInfo("Disconnected");
    setTimeout(startConnection, 5000);
  });

  const messageEdited = (message: string) => {
    setMessage(message);
  }

  return (
    <div className="App">
      <p className='chatConnectionInfo'>{chatConnectionInfo}</p>
      <div className='input-zone'>
        <label htmlFor="tbMessage">Message:</label>
        <input id='tbMessage' value={message} className="input-zone-input" type="text" onChange={(e) => messageEdited(e.currentTarget.value)}/>
        <button id='btnSend' onClick={() => connection?.send("SendMessageToAll", username, message).catch((err) => console.log("error while sending")).then(() => {
          console.log("skickade: " + message);
          setMessage("");
        })}>Send</button>
      </div>
      <ul>
        {messages.map((m, idx) => {
          return <li key={idx}>{m.username}: {m.message}</li>;
        })}
      </ul>
    </div>
  );
}

export default App;
