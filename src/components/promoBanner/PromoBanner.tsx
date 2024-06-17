import { CustomToast } from '../Toast';
import './promoBunner.css';

export const PromoBanner = () => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText('summer-sale');
        CustomToast('success', 'Copied!');
    };

    return (
        <div className="promo-banner">
            <p className="promo-text">
                Special summer’s gift! Use the promo code{' '}
                <span className="promo-code" onClick={copyToClipboard}>
                    summer-sale
                </span>{' '}
                and get a 10% discount on all your purchases! Just click on the promo code to copy it!
            </p>
        </div>
    );
};
