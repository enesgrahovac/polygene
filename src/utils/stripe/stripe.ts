import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;

// export const getCheckoutUrl = async (): Promise<string> => {
//     const priceId = "price_1PBojBGyPj385EEbhtUbPhnU";

//     return new Promise<string>((resolve, reject) => {
//         const unsubscribe = onSnapshot(docRef, (snap) => {
//             const { error, url } = snap.data() as {
//                 error?: { message: string };
//                 url?: string;
//             };
//             if (error) {
//                 unsubscribe();
//                 reject(new Error(`An error occurred: ${error.message}`));
//             }
//             if (url) {
//                 unsubscribe();
//                 resolve(url);
//             }
//         });
//     });
// };

// export const getStripeCheckoutURL = async () => {
//     const checkoutUrl = await getCheckoutUrl();
//     return checkoutUrl;
// }
