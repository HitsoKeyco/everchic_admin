import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import './css/LoginPage.css'

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { loginUser } = useAuth();
    
    const onSubmit = (data) => {
        loginUser(data);
    };

    return (
        <>
            <div className="login_page_container">

                <div className="login_page_component">
                    <h1 className="login_page_title">Login</h1>
                    <form action="#" method="POST" className='login_page_form' onSubmit={handleSubmit(onSubmit)}>
                        
                        <div className="login_page_elements_container">
                            <label htmlFor="email" className="login_page_label">Email</label>
                            <input type="email" id="email" name="email" className="login_page_input" autoComplete="on" 
                            {...register('email', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                        {errors.email && <p>{errors.email.message}</p>}
                        
                        <div className="login_page_elements_container">
                            <label htmlFor="password" className="login_page_label">Password</label>
                            <input type="password" id="password" name="password" className="login_page_input" autoComplete="off" 
                            {...register('password', { required: 'Este campo es obligatorio' })}
                            />
                        </div>
                            {errors.password && <p>{errors.password.message}</p>}
                        
                        <div className="login_page_elements_container">                            
                            
                        </div>
                        
                        <div className="login_page_elements_container">
                            <a href="#" className="login_page_forgot_password">Forgot Password?</a>
                        </div>
                        
                        <button type="submit" className="login_page_button">Login</button>
                    </form>
                    
                </div>
            </div>
        </>
    )

};

export default LoginPage;
