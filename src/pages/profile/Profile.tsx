import './profile.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { Img } from '../../components';
import { baseClient } from '../../apiSdk/BaseClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserAddresses from '../../components/Profile/userAddresses';
import UserInfo from '../../components/Profile/userInfo';
import { IUser, IErrorProfile } from '../../components/Profile/typesProfile';
import { CustomerUpdateAction } from '../../components/Profile/typesAction';
import { CustomToast } from '../../components/Toast';
import { UserParams } from '../../apiSdk/RegistrationUser';

export async function ProfileApi(): Promise<IUser | Error> {
    const token = JSON.parse(localStorage.getItem('userToken') || '[]').token;

    const api = baseClient();
    try {
        const response = await api
            .me()
            .get({
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .execute();
        return response.body as IUser;
    } catch (error) {
        return error as Error;
    }
}

export function Profile() {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<UserParams>({
        mode: 'onChange',
    });
    const [user, setUser] = useState<IUser | null>(null);
    const [error, setError] = useState<IErrorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formDate, setFormDate] = useState({
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        streetName: '',
        streetNameBilling: '',
        postalCode: '',
        postalCodeBilling: '',
        city: '',
        cityBilling: '',
        defaultShipping: false,
        defaultBilling: false,
    });
    const loadingRef = useRef<ReturnType<typeof toast.loading> | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await ProfileApi();
                if (result instanceof Error) {
                    setError(result);
                } else {
                    setUser(result);
                    setFormDate({
                        email: result.email,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        dateOfBirth: result.dateOfBirth,
                        streetName: result.addresses[0]?.streetName || '',
                        streetNameBilling:
                            result.addresses.length === 1
                                ? result.addresses[0]?.streetName
                                : result.addresses[1]?.streetName,
                        postalCode: result.addresses[0]?.postalCode || '',
                        postalCodeBilling:
                            result.addresses.length === 1
                                ? result.addresses[0]?.postalCode
                                : result.addresses[1]?.postalCode,
                        city: result.addresses[0]?.city || '',
                        cityBilling:
                            result.addresses.length === 1 ? result.addresses[0]?.city : result.addresses[1]?.city,
                        defaultShipping: result.defaultShippingAddressId ? true : false,
                        defaultBilling: result.defaultBillingAddressId ? true : false,
                    });
                }
            } catch {
                throw new Error('Error detected');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (loading) {
            loadingRef.current = toast.loading('Loading...');
        } else {
            if (loadingRef.current) {
                if (error?.status === 401) {
                    toast.update(loadingRef.current, {
                        render: 'You need to login before checking your profile',
                        type: 'error',
                        isLoading: false,
                        autoClose: 1000,
                    });
                    navigate('/');
                } else if (error) {
                    toast.update(loadingRef.current, {
                        render: `Error: ${error.message}`,
                        type: error ? 'error' : 'success',
                        isLoading: false,
                        autoClose: 1000,
                    });
                } else {
                    toast.dismiss(loadingRef.current);
                }
            }
        }
    }, [loading, error, navigate]);

    const handleInputChangeEditing = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsEditing(!isEditing);
    };

    const handleInputChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDate({
            ...formDate,
            [name]: value,
        });
        console.log(formDate);
    };

    const handleSumbitChanges: SubmitHandler<UserParams> = (data) => {
        setIsEditing(!isEditing);
        if (!user?.id && !user?.version) {
            return;
        }

        console.log(data);

        const { firstName, lastName, dateOfBirth, email } = formDate;

        const updateActions: CustomerUpdateAction[] = [
            {
                action: 'setFirstName',
                firstName,
            },
            {
                action: 'setLastName',
                lastName,
            },
            {
                action: 'setDateOfBirth',
                dateOfBirth,
            },
            {
                action: 'changeEmail',
                email,
            },
        ];

        const api = baseClient();
        api.customers()
            .withId({ ID: user?.id })
            .post({ body: { version: user.version, actions: updateActions } })
            .execute()
            .then((response) => {
                const responseDate = response.body as IUser;
                setUser(responseDate);
                CustomToast('success', 'Profile updated successfully');
                console.log(responseDate);
            })
            .catch((err) => {
                console.log('Change is failed', err);
                CustomToast('error', 'An error occurred, please try again later');
            });
    };

    if (!user) {
        return;
    }

    return (
        <form className="container-profile" onSubmit={handleSubmit(handleSumbitChanges)}>
            <div className="profile-content">
                <div className="profile-user-info profile-user-container">
                    <Img src="images/avatar.jpg" alt="Simple Avatar Image" className="user-info-avatar"></Img>
                    <UserInfo
                        email={user.email}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        dateOfBirth={user.dateOfBirth}
                        isEditing={isEditing}
                        onChangeHandler={handleInputChangeDate}
                        errors={errors}
                        register={register}
                    />
                </div>
                <div className="profile-user-addresses profile-user-container">
                    <div className="addresses-container user-addresses-container">
                        <UserAddresses errors={errors} register={register} />
                        <UserAddresses errors={errors} register={register} />
                    </div>
                    <button className="btn" type="button">
                        Add new address
                    </button>
                </div>
            </div>
            {isEditing ? (
                <>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn sumbit" type="submit">
                            Submit Changes
                        </button>
                        <button className="btn" type="button" onClick={handleInputChangeEditing}>
                            Cancel
                        </button>
                    </div>
                    <button className="btn" type="button" onClick={() => navigate('/changePassword')}>
                        Change Password
                    </button>
                </>
            ) : (
                <>
                    <button className="btn" type="button" onClick={handleInputChangeEditing}>
                        Edit profile
                    </button>
                    <button className="btn" type="button" onClick={() => navigate('/changePassword')}>
                        Change Password
                    </button>
                </>
            )}
        </form>
    );
}
