import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { getDocs, where, query, collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Tab = ({ roomId }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [adminStatus, setAdminStatus] = useState(false);

    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const [pub, setPub] = useState(false);

    const [roomDetails, setRoomDetails] = useState();
    const [members, setMembers] = useState([]);

    const [searchEmail, setSearchEmail] = useState("");

    const handleAddUser = async () => {
        try {
            if (!members.includes(searchEmail)) {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", searchEmail));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    if (!userData.private_rooms.includes(roomId)) {
                        userData.private_rooms.push(roomId);
                        await updateDoc(userDoc.ref, {
                            private_rooms: userData.private_rooms
                        });
                    }

                    const roomsRef = collection(db, "rooms");
                    const roomQuery = query(roomsRef, where("room_id", "==", roomId));
                    const roomQuerySnapshot = await getDocs(roomQuery);

                    if (!roomQuerySnapshot.empty) {
                        const roomDoc = roomQuerySnapshot.docs[0];
                        const roomData = roomDoc.data();

                        // Check if the room already includes the user
                        if (!roomData.members.includes(searchEmail)) {
                            roomData.members.push(searchEmail);
                            await updateDoc(roomDoc.ref, {
                                members: roomData.members
                            });
                        }

                        // Update local members array
                        members.push(searchEmail);
                        alert("User details updated successfully!");
                    } else {
                        alert("Room does not exist in the database!");
                    }
                } else {
                    alert("User does not exist in the database!");
                }
            } else {
                alert("User already exists in the room!");
            }

            setSearchEmail("");
        } catch (error) {
            console.error("Error adding user: ", error);
        }
    };


    const handleDeleteUser = async () => {
        try {
            console.log("Members: ", members);
            if (!members.includes(searchEmail)) {
                alert("User does not exist in the room!");
                return;
            }

            // Query the user collection to find the user document by email
            const usersRef = collection(db, "users");
            const userQuery = query(usersRef, where("email", "==", searchEmail));
            const userQuerySnapshot = await getDocs(userQuery);

            if (!userQuerySnapshot.empty) {
                const userDoc = userQuerySnapshot.docs[0];
                const userData = userDoc.data();

                // Remove the roomId from the user's private_rooms array
                const updatedUserPrivateRooms = userData.private_rooms.filter(room => room !== roomId);
                await updateDoc(userDoc.ref, {
                    private_rooms: updatedUserPrivateRooms
                });

                // Query the room collection to find the room document by roomId
                const roomsRef = collection(db, "rooms");
                const roomQuery = query(roomsRef, where("room_id", "==", roomId));
                const roomQuerySnapshot = await getDocs(roomQuery);

                if (!roomQuerySnapshot.empty) {
                    const roomDoc = roomQuerySnapshot.docs[0];
                    const roomData = roomDoc.data();

                    // Remove the user's email from the room's members array
                    const updatedRoomMembers = roomData.members.filter(member => member !== searchEmail);
                    await updateDoc(roomDoc.ref, {
                        members: updatedRoomMembers
                    });

                    // Update local members array
                    const updatedMembers = members.filter(member => member !== searchEmail);
                    // Assuming 'members' is a state or similar
                    setMembers(updatedMembers);

                    alert("User removed successfully!");
                } else {
                    alert("Room does not exist in the database!");
                }
            } else {
                alert("User does not exist in the database!");
            }
            
            setSearchEmail("");
        } catch (error) {
            console.error("Error removing user: ", error);
        }
    };


    useEffect(() => {
        const getRoomDetails = async () => {
            const roomRef = collection(db, "rooms");
            const roomSnapshot = await getDocs(roomRef);
            const roomInfo = roomSnapshot.docs.map((doc) => doc.data()).filter((room) => room.room_id === roomId);
            setRoomDetails(roomInfo[0]);
            if (roomInfo[0].pub_or_pri === "public") {
                setPub(true);
            } else {
                if (roomInfo[0].admin === auth.currentUser.email) {
                    setAdminStatus(true);
                }
            }
        };

        const getMembers = async () => {
            if (roomDetails !== null && roomDetails !== undefined) {
                if (roomDetails.pub_or_pri === "private") {
                    if (roomDetails.members.length > 0 && roomDetails.members !== undefined && roomDetails.members !== null) {
                        roomDetails.members.forEach((member) => {
                            setMembers([...members, member]);
                        })
                    }
                }
            }
        }

        getRoomDetails();
        getMembers();
    }, [members]);


    return (
        <div className="Tab relative bg-gray-800">
            {(showAlert) && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-9999">
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-60"></div>
                    <div className="relative bg-red-700 bg-opacity-55 rounded-2xl p-8 space-y-6 text-center">
                        <h1 className="text-xl text-white">Information</h1>
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-white">
                            Room Name: {roomDetails.room_name}
                        </h1>
                        <p className="text-white">
                            Description: {roomDetails.description}
                        </p>
                        <button className="w-36 text-black bg-white font-medium focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-6 py-3 mx-auto" onClick={() => setShowAlert(false)}>
                            Ok
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-3 p-2 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center justify-between items-center" id="custom-tab" role="tablist">
                    <li className="relative inline-block text-left" role="presentation">
                        <button
                            className="inline-block p-2 bg-white mr-4 text-black border-b rounded-t-lg"
                            onClick={() => { navigate("/dashboard"); }}
                        >
                            Dashboard
                        </button>
                    </li>
                    <li className="relative inline-block text-left" role="presentation">
                        <button
                            className="inline-block p-2 bg-white mr-4 text-black border-b rounded-t-lg"
                            onClick={() => setShowAlert(true)}
                        >
                            About the Chat Room
                        </button>
                    </li>
                    <li className="relative inline-block text-left" role="presentation">
                        <button
                            className="inline-block p-2 bg-white mr-4 text-black border-b rounded-t-lg"
                            aria-haspopup="true"
                            aria-expanded={isDropdownVisible}
                            onClick={toggleDropdown}
                        >
                            Members
                        </button>
                        {isDropdownVisible && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md mr-4 shadow-lg bg-white text-black ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="profile-dropdown">
                                    {!pub ? (
                                        roomDetails.members.map((member, index) => (
                                            <li key={index} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                                {member}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                            Public Room. Anyone can join!
                                        </li>
                                    )}
                                </div>
                            </div>
                        )}
                    </li>
                    {adminStatus && (
                        <div className="flex items-center space-x-2 ml-auto">
                            <li className="me-2 mr-4" role="presentation">
                                <input type="text" className="p-2 border rounded-lg" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} placeholder="Search..." />
                            </li>
                            <li className="me-2" role="presentation">
                                <button
                                    onClick={handleAddUser}
                                    className="inline-block p-2 mr-4 border-b rounded-t-lg bg-white text-black"
                                    id="add-tab"
                                    type="button"
                                    role="tab"
                                    aria-controls="add"
                                    aria-selected="false"
                                >
                                    Add
                                </button>
                            </li>
                            <li role="presentation" className="conditional-delete">
                                <button
                                    onClick={handleDeleteUser}
                                    className="inline-block p-2 border-b mr-4 rounded-t-lg bg-white text-black"
                                    id="delete-tab"
                                    type="button"
                                    role="tab"
                                    aria-controls="delete"
                                    aria-selected="false"
                                >
                                    Delete
                                </button>
                            </li>
                        </div>)}
                </ul>
            </div>
        </div>
    );
};

export default Tab;