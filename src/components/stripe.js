import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51QDrXnAH6Ull8Wzh7xQ9CtLmsYdgoFA4dTkRI7PBXp3YNwN3pKa3PY48GnPC4R69IsczthC8pqx4lMigEpdrtsi800YxxkWh8m');
  }
  return stripePromise;
};