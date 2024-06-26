import React, { useEffect, useRef, useState } from "react";
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    where
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Message from "../components/Message";
import SendMessage from "../components/SendMessage";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import Tab from "../components/Tab";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const scroll = useRef();
    const { roomId } = useParams();

    useEffect(() => {
        const q = query(
            collection(db, "messages"),
            where("room_id", "==", roomId),
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
            <Tab roomId={roomId}/>
            <main className="chat-box">
                <div className="p-1 mb-2">
                    {messages?.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </div>
                {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
                <span ref={scroll}></span>
                <SendMessage className="mt-1" scroll={scroll} roomId={roomId} />
            </main>
        </>
    );
};

export default Chat;