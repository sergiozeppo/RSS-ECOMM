import { baseClient } from './BaseClient';

interface RegisterFnParams {
    email: string;
    password: string;
    country: string;
    city: string;
    postalCode: string;
    streetName: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    countryBilling?: string;
    cityBilling?: string;
    postalCodeBilling?: string;
    streetNameBilling?: string;
    defaultShipping?: boolean;
    defaultBilling?: boolean;
}

export async function registerFn(params: RegisterFnParams) {
    const {
        email,
        password,
        country,
        city,
        postalCode,
        streetName,
        firstName,
        lastName,
        dateOfBirth,
        countryBilling,
        cityBilling,
        postalCodeBilling,
        streetNameBilling,
        defaultShipping,
        defaultBilling,
    } = params;

    const addresses = [
        {
            key: 'shipping',
            country,
            city,
            postalCode,
            streetName,
        },
    ];

    const body = {
        email,
        password,
        addresses,
        defaultShippingAddress: defaultShipping ? 0 : undefined,
        defaultBillingAddress: defaultBilling ? 1 : undefined,
        shippingAddresses: [0],
        billingAddresses: defaultBilling ? [1] : [0],
        firstName,
        lastName,
        dateOfBirth,
    };

    if (countryBilling && cityBilling && postalCodeBilling && streetNameBilling) {
        addresses.push({
            key: 'billing',
            country: countryBilling,
            city: cityBilling,
            postalCode: postalCodeBilling,
            streetName: streetNameBilling,
        });
    }

    const API = await baseClient()
        .customers()
        .post({
            body,
        })
        .execute();

    return API;
}
