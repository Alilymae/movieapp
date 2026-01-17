import { useState } from "react";
import "./PaymentUI.css";

// PAYMENT UI
const PaymentUI = ({ totalAmount, selectedSeats, onPaymentSuccess, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  // HANDLE CARD INPUT
  const handleCardInput = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const sanitized = value.replace(/\s/g, "").slice(0, 16);
      const formatted = sanitized.replace(/(\d{4})/g, "$1 ").trim();
      setCardData({ ...cardData, [name]: formatted });
    } else if (name === "expiryDate") {
      const sanitized = value.replace(/\D/g, "").slice(0, 4);
      const formatted =
        sanitized.length >= 2
          ? `${sanitized.slice(0, 2)}/${sanitized.slice(2)}`
          : sanitized;
      setCardData({ ...cardData, [name]: formatted });
    } else if (name === "cvv") {
      setCardData({ ...cardData, [name]: value.replace(/\D/g, "").slice(0, 3) });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  // VALIDATE CARD DATA
  const validateCardData = () => {
    const { cardNumber, cardHolder, expiryDate, cvv } = cardData;

    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Invalid card number");
      return false;
    }

    if (!cardHolder.trim()) {
      setError("Cardholder name is required");
      return false;
    }

    if (!expiryDate || expiryDate.length !== 5) {
      setError("Invalid expiry date");
      return false;
    }

    if (!cvv || cvv.length !== 3) {
      setError("Invalid CVV");
      return false;
    }

    setError(null);
    return true;
  };

  const handlePayment = async () => {
    if (!validateCardData()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentId = `PAY${Date.now()}${Math.random()
        .toString(36)
        .substr(2, 5)
        .toUpperCase()}`;

      onPaymentSuccess({
        paymentId,
        method: paymentMethod,
        amount: totalAmount,
        timestamp: new Date(),
      });

      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="payment-ui">
      <div className="payment-header">
        <h3>Payment Information</h3>
        <p className="payment-subtitle">Complete your booking securely</p>
      </div>

      <div className="payment-summary">
        <div className="summary-item">
          <span>Selected Seats:</span>
          <strong>{selectedSeats.join(", ")}</strong>
        </div>
        <div className="summary-item">
          <span>Number of Seats:</span>
          <strong>{selectedSeats.length}</strong>
        </div>
        <div className="summary-item total">
          <span>Total Amount:</span>
          <strong className="amount">${totalAmount.toFixed(2)}</strong>
        </div>
      </div>

      <div className="payment-methods">
        <label className="method-option">
          <input
            type="radio"
            name="payment-method"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="method-label">Credit/Debit Card</span>
        </label>
      </div>

      {paymentMethod === "card" && (
        <div className="card-form">
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.cardNumber}
              onChange={handleCardInput}
              disabled={isProcessing}
            />
          </div>

          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              name="cardHolder"
              placeholder="John Doe"
              value={cardData.cardHolder}
              onChange={handleCardInput}
              disabled={isProcessing}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={cardData.expiryDate}
                onChange={handleCardInput}
                disabled={isProcessing}
              />
            </div>

            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                placeholder="123"
                value={cardData.cvv}
                onChange={handleCardInput}
                disabled={isProcessing}
              />
            </div>
          </div>

          <p className="security-notice">
            Your payment information is encrypted and secure
          </p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="payment-actions">
        <button
          className="btn-cancel"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          className="btn-pay"
          onClick={handlePayment}
          disabled={isProcessing || selectedSeats.length === 0}
        >
          {isProcessing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentUI;
