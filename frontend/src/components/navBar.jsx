import React from 'react'
import styles from '../style/navbar.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import {  reset } from '../redux/feature/Slice';

export default function NavBar() {
     const navigate = useNavigate();
     const dispatch=useDispatch();
     const authState = useSelector((state) => state.auth);
     const handleClick=()=>{
          navigate('/signup');
        }
  return (
    
    <div className={styles.container}>
     
     <h4 className={styles.navHeroLeft}>Pro Connect</h4>
     {authState.profileFetched && <div className={styles.NavBarFet}> <p className={styles.nat}>hey,{authState.user.userId.name} </p>
     <p style={{fontWeight:'bold', cursor: "pointer"}} onClick={()=>{ navigate('/Profile'); }}>Profile</p>
     <div><p onClick={()=>{
      localStorage.removeItem('token')
       navigate('/signup');
       dispatch(reset())
     }} style={{fontWeight:'bold', cursor: "pointer", position:"relative", left:"5px"}}>logout</p></div>
     </div> }


     {!authState.profileFetched && <h4 className={styles.navHeroRight} onClick={handleClick}>Be a Part</h4>}
     
   

    

    </div>
  )
}
