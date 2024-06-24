import React, { useEffect, useRef, useState } from "react";
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Message from "../components/Message";
import SendMessage from "../components/SendMessage";
import Navbar from "../components/Navbar";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const scroll = useRef();
    
    useEffect(() => {
        const q = query(
            collection(db, "messages"),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.createdAt - b.createdAt
            );
            setMessages(sortedMessages);
        });
        return () => unsubscribe;
    }, []);

    return (
        <>
            <Navbar />
            <main className="chat-box">
                <div className="messages-wrapper">
                    {messages?.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </div>
                {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
                <span ref={scroll}></span>
                <SendMessage scroll={scroll} />
            </main>
        </>
    );
};

export default Chat;