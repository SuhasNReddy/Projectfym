import './LoginSignup.css';
// import {Navigate} from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

import emailIcon from '../images/email.png';
import passwordIcon from '../images/password.png';
import userIcon from '../images/person.png';
import { useState } from 'react';
import { validateEmail } from '../Validation/Validation';
import { validatePassword } from '../Validation/Validation';
import { connect } from 'react-redux';
import styles from './LoginSignup.module.css';
import image from '../images/login38.jpg'
import { Link } from 'react-router-dom';

const LoginSignup = (props) => {
    const history = useHistory();
    const [action,setAction] = useState('Sign Up');

    function mapEveryStatetoNull(){
        setPassword(''); 
        setEmail('');
        
        setName('');

    }

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [name,setName] = useState('');
    const [error,SetError] = useState('');

    const handleSubmit=async function(e){
        e.preventDefault();
        
        if(!validateEmail(email)){
            SetError("Invalid Email");
            return
        }
        
        if(validatePassword(password)!="Password is valid."){
            SetError(validatePassword(password));
            return
        }
        
       
        try{
            if(action==="Sign Up"){
                const body = {name,email,password};
                
                const result =await fetch('https://projectfym-1.onrender.com/api/business_signup_post',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(body)
                })
                
                const data = await result.json();
                if(data.error){
                    throw new Error(data.error);
                    
                }
                
                props.signUp(data);
                localStorage.setItem('user',JSON.stringify(data));
                console.log(props.user);
                console.log(data,'Succefully Signed Up');
                history.push("/business/service")
            }
            else{
                const body = {email,password};
                const result =await fetch('https://projectfym-1.onrender.com/api/business_login_post',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(body)
                })
                
                const data = await result.json();
                if(data.error){
                    throw new Error(data.error);
                }
                props.signUp(data);
                localStorage.setItem('user',JSON.stringify(data));
                console.log(props.user);
                history.push("/business/service");
                
            }
        }catch(e){
            console.log(e.message)
            SetError(e.message);
        }
            

        mapEveryStatetoNull();
        
    }

    return ( 
        <div>
            <div className={styles.mainc}>
                <div style={{ width: '35%' , position:'relative'}}>
                    <Link to='/'><span><p className={styles.company} >Frame Your Memories</p></span></Link>
                    <img style={{ height: '100vh', backgroundSize: 'cover', width: '100%' }} src={image} alt="Logo" />
                </div>

                <div className="mainc" style={{width:'65%'}}>
                <div className='container' >
                    
                    <div className="text" style={{fontSize:'1.8rem',textAlign:'left'}}>{action}</div>
                    <div className="inputs">
                        {
                            action==="Login"? <div></div> : 
                            <div>
                                <p style={{textAlign:'left',fontWeight:'bold'}}> Name</p>
                                <div style={{textAlign:'left'}}>
                                <input className={styles.input} type="text" 
                                value={name}
                                onChange={(e)=>{setName(e.target.value)}}
                                autoComplete="new-password"
                                
                                />
                                </div>
                            </div> 
                            
                        }
                        <div>
                        <p style={{textAlign:'left',fontWeight:'bold'}}> Email</p>
                        <div style={{textAlign:'left'}}>
                            <input className={styles.input} type="email" 
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}
                            autoComplete="new-password"
                            
                            />
                        </div>
                        </div>
                        
                        <div>
                        <p style={{textAlign:'left',fontWeight:'bold'}}> Password</p>
                        <div style={{textAlign:'left'}}>
                            <input className={styles.input} type="password" 
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}
                            aautoComplete="new-password"
                            
                            />
                        </div>
                        </div>
                        {
                            error && <span className='ErrorMessage' >{error}</span>
                        }

                        {
                            action==="Sign Up"? <span></span> : 
                            <span className='aclink' style={{cursor:'pointer',marginLeft:'105px'}} onClick={()=>{
                                SetError("");
                                setAction("Sign Up")}
                            }>Create New Account <span style={{color:'blue'}}>Sign Up</span></span> 
                        }

                        {
                            action==="Login"? <span></span> : 
                            <p className='aclink' style={{cursor:'pointer',marginLeft:'135px'}} onClick={()=>{
                                    SetError("");
                                    setAction("Login");
                                }
                            }>Have a account?<span style={{color:'blue'}}>Login</span></p> 
                        }
                        
                    </div>
                    
                    <div style={{marginTop:'20px'}}>
                        <div className={"submitb"}  onClick={handleSubmit} >Submit</div>
                    </div>
                </div>
            </div>
        </div>
        </div>
     );
}

const mapStateToProps=(state)=>{
    return {
        user:state.user
    }
}

const mapDispathToProps=(Dispatch)=>{
    return {
        signUp:(user)=>{Dispatch({type:"SIGN_UP",user:user})}
    }
}

export default connect(mapStateToProps,mapDispathToProps)(LoginSignup);