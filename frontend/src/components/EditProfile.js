import React from "react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import styles from "./EditProfile.module.css";
import Cookies from "js-cookie";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const [profile, setProfile] = useState(null);
    const [song, setSong] = useState("");
    const [bio, setBio] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:80/profile/${jwtDecode(Cookies.get('token')).username}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                });
                const data = await response.json();
                setProfile(data);
                setSong(data.favoriteSong);
                setBio(data.bio);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("bio", bio);
        formData.append("spotifyLink", song);
        try {
            const response = await fetch("http://localhost:80/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
                body: formData,
            });

            if (!response.ok) {
                alert("Error updating profile:", response.statusText);
                return;
            }

            alert("Profile updated successfully!");
            navigate("/user/" + jwtDecode(Cookies.get("token")).username);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    
    if (!profile) {
        return <div></div>;
    }
    
    return (
        <div>
        <Header />
        <div className={styles.container}>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
            <label className={styles.label}>
                Favorite Song
            </label>
            <br></br>
            <input
                type="text"
                id="spotifyLink"
                value={song}
                onChange={(event) => setSong(event.target.value)}
                className={styles.input}
                autoComplete="off"
            />
            <br></br>
            <label htmlFor="bio" className={styles.label}>
                Bio
            </label>
            <br></br>
            <textarea
                id="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className={styles.textarea}
            />
            <br></br>
            <button type="submit" className={styles.button}>
                Save
            </button>
            </form>
        </div>
        </div>
    );
}

export default EditProfile;