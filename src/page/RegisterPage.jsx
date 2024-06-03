import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuth from '../components/hooks/useAuth'


const RegisterPage = () => {
    const { register, handleSubmit, setValue, reset, formState: { errors }, watch } = useForm()
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const { createUser } = useAuth()

    const navigate = useNavigate()

    const handlelog = () => {
        navigate('/')
    }

    const watchPassword = watch('password', ''); 
    const watchRepeatPassword = watch('confirm_password', ''); 

    useEffect(() => {
        if (watchPassword !== watchRepeatPassword) {
            setPasswordMatchError('Las contraseñas no coinciden');
        } else {
            setPasswordMatchError('');
        }
    }, [watchPassword, watchRepeatPassword]);

    const handdleRegister = (data) => {        
        createUser(data)              
    }


    return (
        <div className="register_container">
            <form className="register_form" onSubmit={handleSubmit(handdleRegister)} action="/login">
                <h3 className="register_title">Registro</h3>
                {/* <div className="register_section">
                    <label className="register_select" htmlFor="role">Rol</label>
                    <select
                        name="role"
                        id="role"
                        {...register('role', { required: 'Este campo es obligatorio' })}
                        onChange={(e) => setValue('role', e.target.value)}
                    >
                        <option value="">Selecciona un rol</option>
                        <option value="0">Administrador</option>
                        <option value="1">Vendedor</option>
                    </select>
                    {errors.rol && <p>{errors.role.message}</p>}
                </div> */}
                <div className="register_section">
                    <label className="register_label" htmlFor="firstname">Nombres</label>
                    <input
                        className="register_input"
                        type="text" id="firstname"
                        autoComplete='on'
                        {...register('firstName', { required: 'Este campo es obligatorio' })}
                    />
                    {errors.firstName && <p>{errors.firstName.message}</p>}
                </div>
                <div className="register_section">
                    <label className="register_label" htmlFor="lastName">Apellidos</label>
                    <input
                        className="register_input"
                        type="text"
                        id="lastName"
                        autoComplete='on'
                        {...register('lastName', { required: 'Este campo es obligatorio' })}
                    />
                    {errors.lastName && <p>{errors.lastName.message}</p>}
                </div>
                <div className="register_section">
                    <label className="register_label" htmlFor="email">Correo</label>
                    <input
                        className="register_input"
                        type="email"
                        id="email"
                        autoComplete='on'
                        {...register('email', { required: 'Este campo es requerido' })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>
                <div className="register_section">
                    <label className="register_label" htmlFor="password">Contraseña</label>
                    <input
                        className="register_input"
                        type="password"
                        id="password"
                        
                        {...register('password', { required: 'Este campo es obligatorio' })}
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <div className="register_section">
                    <label className="register_label" htmlFor="confirm_password">Confirme Contraseña</label>
                    <input
                        className="register_input"
                        type="password"
                        id="confirm_password"
                        
                        {...register('confirm_password', { required: 'Este campo es obligatorio' })}
                    />
                    {errors.confirm_password && <p>{errors.confirm_password.message}</p>}
                    {passwordMatchError && <p className='register_alert'>{passwordMatchError}</p>}
                </div>
                <button className="register_btn">Registrarse</button>
                <button onClick={handlelog} className="register_btn">Iniciar Sesión</button>
            </form>
        </div>
    )
}

export default RegisterPage