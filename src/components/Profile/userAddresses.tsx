import { Switch, FormControlLabel } from '@mui/material';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
// import { IUser } from './typesProfile';
import { UserParams } from '../../apiSdk/RegistrationUser';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { validate } from '../Validation';

interface UserAddressesAttributes {
    errors: FieldErrors;
    register: UseFormRegister<UserParams>;
}

function UserAddresses({ errors, register }: UserAddressesAttributes) {
    console.log(errors, register);
    return (
        <fieldset className="user-addresses-container">
            <FaEdit color="white" className="user-addresses-edit-icon" />
            <MdDelete color="white" className="user-addresses-delete-icon" />
            <legend>Address</legend>
            <div className="user-addresses-row">
                <div className="user-addresses-col">
                    <span>Country:</span>
                </div>
                <input
                    {...register('country', {
                        required: 'This field is required',
                    })}
                    className="user-addresses-input"
                />
            </div>
            <div className="user-addresses-row">
                <div className="user-addresses-col">
                    <span>Street:</span>
                </div>
                <input
                    {...register('streetName', {
                        required: 'This field is required',
                        validate: validate['street'],
                    })}
                    className="user-addresses-input"
                />
            </div>
            <div className="user-addresses-row">
                <div className="user-addresses-col">
                    <span>City:</span>
                </div>
                <input
                    {...register('city', {
                        required: 'This field is required',
                        validate: validate['city'],
                    })}
                    className="user-addresses-input"
                />
            </div>
            <div className="user-addresses-row">
                <div className="user-addresses-col">
                    <span>Postal Code:</span>
                </div>
                <input
                    {...register('postalCode', {
                        required: 'This field is required',
                        validate: validate['postalCode'],
                    })}
                    className="user-addresses-input"
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '5px' }}>
                <FormControlLabel
                    control={<Switch />}
                    label="Set as default shipping"
                    sx={{
                        '& .MuiSvgIcon-root': {
                            color: 'white',
                        },
                        color: 'white',
                    }}
                />
                <FormControlLabel
                    control={<Switch />}
                    label="Set as default billing"
                    sx={{
                        '& .MuiSvgIcon-root': {
                            color: 'white',
                        },
                        color: 'white',
                    }}
                />
            </div>
        </fieldset>
    );
}

export default UserAddresses;
