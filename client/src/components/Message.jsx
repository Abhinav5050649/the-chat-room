import React, {useState, useEffect} from "react";

function Message({ message }) {
    return (
        <div className="Message">
            <h3>{message}</h3>
        </div>
    );
}