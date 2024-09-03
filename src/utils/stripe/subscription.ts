import { loadStripe } from '@stripe/stripe-js';

const publicStripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publicStripeKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

const stripePromise = loadStripe(publicStripeKey); // Use the publishable key here

export const upgradeToPremium = async (userId:string) => {
    const stripe = await stripePromise;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Specify the content type if needed
            // You can add other headers if required
        },
        body: JSON.stringify({ userId }), // Convert data to JSON string
    };
    const response = await fetch('/api/stripe/checkout', requestOptions);
    const session = await response.json();
    
    if (!stripe) {
        return;
    }
    const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
    });

    if (result.error) {
        alert(result.error.message);
    }
};