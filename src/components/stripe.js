import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51Til0cELVk22If2vpoTvG0ObDWxrKqSc4Wq7mgUuRwrSFzaqHjAyoeREzs8LrofTB7mIctv65r3SBmwAAtoWOODF00SPuxPC9r');
  }
  return stripePromise;
};