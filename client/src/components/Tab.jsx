import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { getDocs, collection, addDoc, deleteDoc, doc } from "firebase/firestore";

const Tab = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isDeleteVisible, setDeleteVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const toggleDeleteButton = (visible) => {
        setDeleteVisible(visible);
    };

    return (
        <div className="Tab">
            {(showAlert) && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-9999">
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-60"></div>
                    <div className="relative bg-blue-700 bg-opacity-55 rounded-2xl p-8 space-y-6 text-center">
                        <h1 className="text-5xl">⚠️</h1>
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-white">
                            Chat Room
                        </h1>
                        <p className="text-white">
                            Description
                        </p>
                        <button className="w-36 text-black bg-white font-medium  focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-6 py-3 mx-auto" onClick={() => setShowAlert(false)}>
                            Ok
                        </button>
                    </div>
                </div>
            )}
            <div className="mb-2 p-2 border-b border-gray-200 dark:border-gray-700">

                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center justify-between items-center" id="custom-tab" role="tablist">
                    <li className="relative inline-block text-left" role="presentation">
                        <button
                            className="inline-block p-2 border-b rounded-t-lg"
                            id="profile-paragraph"
                            onClick={() => setShowAlert(true)}
                        >
                            Paragraph
                        </button>
                    </li>
                    <li className="relative inline-block text-left" role="presentation">
                        <button
                            className="inline-block p-2 border-b rounded-t-lg"
                            id="profile-dropdown"
                            aria-haspopup="true"
                            aria-expanded={isDropdownVisible}
                            onClick={toggleDropdown}
                        >
                            Dropdown
                        </button>
                        {isDropdownVisible && (
                            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="profile-dropdown">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Option 1</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Option 2</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Option 3</a>
                                </div>
                            </div>
                        )}
                    </li>
                    <div className="flex items-center space-x-2">
                        <li className="me-2" role="presentation">
                            <input type="text" className="p-2 border rounded-lg" placeholder="Search..." />
                        </li>
                        <li className="me-2" role="presentation">
                            <button
                                className="inline-block p-2 border-b rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                                id="add-tab"
                                type="button"
                                role="tab"
                                aria-controls="add"
                                aria-selected="false"
                            >
                                Add
                            </button>
                        </li>
                        {isDeleteVisible && (
                            <li role="presentation" className="conditional-delete">
                                <button
                                    className="inline-block p-2 border-b rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                                    id="delete-tab"
                                    type="button"
                                    role="tab"
                                    aria-controls="delete"
                                    aria-selected="false"
                                >
                                    Delete
                                </button>
                            </li>
                        )}
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Tab;