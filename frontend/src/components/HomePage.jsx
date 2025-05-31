import React from 'react'
import styles from '../style/homepage.module.css';
import { useNavigate } from 'react-router-dom';


export default function HomePage() {
  const navigate = useNavigate();
  const handleClick=()=>{
    navigate('/signup');
  }
  return (
    <>
    <div className="container">
     <div className={styles.mainContainer}>
     <div className={styles.leftContainer}>
          <h1>Connect with Friends without Exaggeration</h1>
          <h3>A True social media platform with stories no blufs !</h3>
<button onClick={handleClick}>Join Now</button>
     </div>
     <div className={styles.rightContainer}>
          
     </div>
     </div>

    </div>
    </>
  )
}
