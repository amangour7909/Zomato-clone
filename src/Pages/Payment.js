import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, totalAmount, deliveryFee, grandTotal } = location.state || {};

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            food_id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
          })),
          total_amount: grandTotal,
          delivery_fee: deliveryFee,
          payment_details: {
            card_number: paymentData.cardNumber.slice(-4),
            payment_status: 'completed'
          },
          status: 'pending'
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Payment successful! Order placed.');
        localStorage.removeItem('cart'); // Clear cart from localStorage if you're using it
        navigate('/orders');
      } else {
        throw new Error(data.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed: ' + error.message);
    }
  };

  if (!cartItems || !grandTotal) {
    return <div>Invalid payment session</div>;
  }

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Total Items: ${totalAmount}</p>
        <p>Delivery Fee: ${deliveryFee}</p>
        <p>Grand Total: ${grandTotal}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={paymentData.cardNumber}
          onChange={handleChange}
          required
          maxLength="16"
          pattern="\d{16}"
        />
        <input
          type="text"
          name="expiryDate"
          placeholder="Expiry Date (MM/YY)"
          value={paymentData.expiryDate}
          onChange={handleChange}
          required
          maxLength="5"
          pattern="\d{2}/\d{2}"
        />
        <input
          type="text"
          name="cvv"
          placeholder="CVV"
          value={paymentData.cvv}
          onChange={handleChange}
          required
          maxLength="3"
          pattern="\d{3}"
        />
        <button type="submit">Pay ${grandTotal}</button>
      </form>
    </div>
  );
}

export default Payment;
