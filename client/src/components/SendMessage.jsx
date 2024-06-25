import React, { useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const SendMessage = ({ scroll, roomId }) => {

    const [message, setMessage] = useState("");

    const sendMessage = async (event) => {
        event.preventDefault();
        if (message.trim() === "") {
            alert("Enter valid message");
            return;
        }
        const { uid, displayName, photoURL } = auth.currentUser;
        await addDoc(collection(db, "messages"), {
            text: message,
            name: displayName,
            avatar: photoURL,
            room_id: roomId,
            createdAt: serverTimestamp(),
            uid,
        });
        setMessage("");
        scroll.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <form
            onSubmit={(event) => sendMessage(event)}
            className="fixed bottom-0 w-full p-5 bg-orange-200 flex"
        >
            <label htmlFor="messageInput" hidden>
                Enter Message
            </label>
            <input
                id="messageInput"
                name="messageInput"
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="h-10 p-2.5 rounded-l-md border-none flex-grow bg-white text-[#1c2c4c] text-base placeholder-[#ddd] focus:outline-none focus:border-b-[1px] focus:border-[#7cc5d9]"
                placeholder="type message..."
            />
            <button
                type="submit"
                className="w-[70px] h-10 p-2.5 rounded-r-md text-white border border-white bg-gray-900 font-semibold"
            >
                Send
            </button>
        </form>
    );
};
export default SendMessage;