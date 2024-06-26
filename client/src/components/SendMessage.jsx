import React, { useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, query, where, getDocs, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SendMessage = ({ scroll, roomId }) => {

    const navigate = useNavigate();

    const [message, setMessage] = useState("");

    const sendMessage = async (event) => {
        event.preventDefault();
        if (message.trim() === "") {
            alert("Enter valid message");
            return;
        }
        const { uid, displayName, photoURL, email } = auth.currentUser;
        const roomsRef = collection(db, "rooms");
        const roomQuery = query(roomsRef, where("room_id", "==", roomId));
        const querySnapshot = await getDocs(roomQuery);
        const room = querySnapshot.docs[0].data();
        
        if (room.pub_or_pri === "private") {
            if (!room.members.includes(email)) {
                console.log("User is not a member of this room");
                navigate("/dashboard");
            }
        }

        await addDoc(collection(db, "messages"), {
            text: message,
            name: displayName,
            avatar: photoURL,
            room_id: roomId,
            createdAt: serverTimestamp(),
            uid,
        });
        setMessage("");
        scroll.current.scroll({ behavior: "smooth" });
    };

    return (
        <form
            onSubmit={(event) => sendMessage(event)}
            className="fixed bottom-0 w-full p-2 flex"
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
                className="h-9 p-2 rounded-l-md border-none flex-grow bg-white text-[#1c2c4c] text-base placeholder-[#ddd] focus:outline-none focus:border-b-[1px] focus:border-[#7cc5d9]"
                placeholder="type message..."
            />
            <button
                type="submit"
                className="w-[70px] h-9 p-2 rounded-r-md text-white border border-white bg-gray-900 font-semibold"
            >
                Send
            </button>
        </form>
    );
};
export default SendMessage;