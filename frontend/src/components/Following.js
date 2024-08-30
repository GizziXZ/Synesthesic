import React from "react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./Following.module.css";
import Header from "./Header";

const Following = () => {
    const [following, setFollowing] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchFollowing = async () => {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
          return;
        }
  
        const username = jwtDecode(token).username;
        try { // TODO - finish the following page + add the following route in the backend
          const response = await fetch(`/following`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setFollowing(data.following);
          } else {
            console.error("Failed to fetch following list");
          }
        } catch (error) {
          console.error("Error fetching following list:", error);
        }
      };
  
      fetchFollowing();
    }, [navigate]);
  
    return (
      <div>
        <Header />
        <div className={styles.followingContainer}>
          <h1 style={{color: '#fff'}}>Following</h1>
          <ul className={styles.followingList}>
            {following.map((user) => (
              <li key={user} className={styles.followingItem}>
                <a href={`/profile/${user}`}>{user}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
};
  
export default Following;