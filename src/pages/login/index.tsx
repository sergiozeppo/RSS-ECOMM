import { useEffect, useState, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './login.css';
import { loginFn } from '../../apiSdk/LoginUser';
import { baseClient } from '../../apiSdk/BaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { token } from '../../apiSdk/token';
import { GlobalContext } from '../../context/Global';
import { CustomToast } from '../../components/Toast';
import Loader from '../../components/Loader/loader';
import { validate } from '../../components/Validation';
import { tokenClient } from '../../apiSdk/TokenClient';

type Inputs = {
    email: string;
    password: string;
};

export default function Login() {
    const { setIsLogin, setCart } = useContext(GlobalContext);
    const isUserExist = localStorage.getItem('isLogin');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
        trigger,
    } = useForm<Inputs>({ mode: 'onChange' });
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<Inputs> = (userData) => {
        setLoading(true);
        loginFn(userData.email, userData.password)
            .then(() => {
                setLoginError('');
                setPasswordError('');
                setLoading(false);
                const userToken = token;
                localStorage.setItem('isLogin', 'true');
                localStorage.setItem('userToken', JSON.stringify(userToken.get()));
                setIsLogin(true);
                CustomToast('success', 'Successful Logged in!');
                tokenClient()
                    .me()
                    .activeCart()
                    .get()
                    .execute()
                    .then((res) => {
                        console.log(res);
                        const cartDataS = res.body;
                        localStorage.setItem('user-cart', JSON.stringify(cartDataS));
                        setCart(cartDataS);
                    })
                    .catch(console.error);
            })
            .catch((err: Error) => {
                console.error(err);
                setLoading(false);
                baseClient()
                    .customers()
                    .get({ queryArgs: { where: `email="${userData.email}"` } })
                    .execute()
                    .then((res) => {
                        if (res.body.count > 0) {
                            setPasswordError('Invalid password!');
                            setLoginError('');
                            CustomToast('error', 'Invalid password!');
                        } else {
                            setLoginError('Email not found in system!');
                            setPasswordError('');
                            CustomToast('error', 'Email not found in system!');
                        }
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error(err);
                        setLoading(false);
                        CustomToast('error', 'Connection lost!');
                    });
            });
    };
    useEffect(() => {
        if (isUserExist) {
            navigate('/');
        }
    }, [navigate, isUserExist]);
    return (
        <div className="login-form-wrapper">
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <label>
                    <span className="label-title">Email</span>
                    <input
                        className={`login-input-email ${errors?.email ? 'invalid-input' : ''}`}
                        {...register('email', {
                            required: 'Mandatory field!',
                            validate: validate['email'],
                        })}
                        onBlur={() => trigger('password')}
                    />
                    {errors?.email && <span className="input-notice">{errors?.email?.message || 'Error'}</span>}
                    {loginError && <span className="input-notice">{loginError}</span>}
                </label>
                <label>
                    <span className="label-title">Password</span>
                    <div className="login-input-psw">
                        <input
                            className={`login-input-psw ${errors?.password ? 'invalid-input' : ''}`}
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', {
                                required: 'Mandatory field!',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters long',
                                },
                                validate: validate['password'],
                            })}
                            onBlur={() => trigger('email')}
                        />
                        <div className="psw-eye" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FiEye /> : <FiEyeOff />}
                        </div>
                    </div>
                    {errors.password && <span className="input-notice">{errors.password.message}</span>}
                    {passwordError && <span className="input-notice">{passwordError}</span>}
                </label>
                <button className="button" type="submit" disabled={!isValid}>
                    Login
                </button>
                {loading && <Loader />}
            </form>
            <div className="link-wrapper">
                Haven't registered yet?
                <Link to="/registration" className="signup-link">
                    Sign up!
                </Link>
            </div>
        </div>
    );
}
