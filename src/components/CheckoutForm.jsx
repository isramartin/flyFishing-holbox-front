import React, { useState, useEffect, useRef } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import '../styles/CheckoutForm.css';

export const CheckoutForm = ({
  amount,
  clientSecret,
  reservaId,
  onSuccess,
  onError,
  onPaymentVerified,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [verifying, setVerifying] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (paymentStatus === 'processing' && reservaId && isMounted.current) {
      const interval = setInterval(() => {
        if (isMounted.current) {
          verifyPaymentStatus(reservaId);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [paymentStatus, reservaId]);

  const verifyPaymentStatus = async (reservaId) => {
    try {
      setVerifying(true);
      const response = await fetch(`/api/reservas/${reservaId}/status`);
      const data = await response.json();
      if (!isMounted.current) return;

      if (data.paymentStatus === 'paid') {
        setPaymentStatus('succeeded');
        onPaymentVerified?.(data);
      } else if (data.paymentStatus === 'failed') {
        setPaymentStatus('failed');
        setError('El pago no pudo ser procesado');
      }
    } catch (err) {
      console.error('Error al verificar el estado del pago:', err);
    } finally {
      if (isMounted.current) setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setError('Stripe no está listo aún. Intenta de nuevo en unos momentos.');
      return;
    }

    setLoading(true);
    setError(null);
    // setPaymentStatus('processing');

    try {
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement)
        throw new Error('No se pudo cargar el formulario de pago.');

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Cliente Fly Fishing Holbox',
              email: 'isramartin157@gmail.com',
            },
          },
        });

      setPaymentStatus('processing');

      if (!isMounted.current) return;

      if (stripeError) throw stripeError;

      switch (paymentIntent?.status) {
        case 'succeeded':
          setPaymentStatus('succeeded');
          onSuccess?.(paymentIntent);
          break;
        case 'processing':
          setPaymentStatus('processing');
          break;
        case 'requires_action':
          const { error: actionError } = await stripe.confirmCardPayment(
            clientSecret
          );
          if (actionError) throw actionError;
          break;
        default:
          throw new Error('Estado de pago desconocido');
      }
    } catch (err) {
      if (isMounted.current) {
        setPaymentStatus('failed');
        setError(err.message || 'Ocurrió un error al procesar tu pago.');
        onError?.(err);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="error-state">
        <p>No se configuró correctamente el cliente de pago.</p>
      </div>
    );
  }

  if (paymentStatus === 'succeeded') {
    return (
      <div className="payment-success">
        <CheckCircle size={48} color="#4CAF50" />
        <h3>¡Pago exitoso!</h3>
        <p>Tu reserva ha sido confirmada correctamente.</p>
        {verifying && <p>Verificando estado final...</p>}
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="payment-processing">
        <Loader2 size={48} className="spinner" />
        <h3>Procesando tu pago</h3>
        <p>No cierres esta página. Estamos verificando la transacción...</p>
        {verifying && <p>Verificando estado...</p>}
      </div>
    );
  }

  return (
    <div className="payment-step-container">
      <div className="payment-header">
        <CreditCard size={24} />
        <h2>Completa tu Pago</h2>
      </div>

      <form onSubmit={handleSubmit} className="stripe-form">
        <div className="form-group">
          <label>Número de Tarjeta</label>
          <CardNumberElement className="stripe-input" />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label>Fecha de Vencimiento</label>
            <CardExpiryElement className="stripe-input" />
          </div>
          <div className="form-group half">
            <label>CVC</label>
            <CardCvcElement className="stripe-input" />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="submit-button"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spinner" />
              Procesando...
            </>
          ) : (
            `Pagar $${amount}`
          )}
        </button>

        <div className="payment-security">
          <img
            src="https://stripe.com/img/v3/pricing/payment-methods.svg"
            alt="Métodos de pago aceptados"
          />
          <p>Pago seguro con Stripe</p>
        </div>
      </form>
    </div>
  );
};
