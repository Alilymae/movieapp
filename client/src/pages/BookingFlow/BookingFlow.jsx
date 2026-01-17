import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeatSelector from "../../components/SeatSelector/SeatSelector";
import PaymentUI from "../../components/PaymentUI/PaymentUI";
import BookingConfirmation from "../../components/BookingConfirmation/BookingConfirmation";
import bookingApi from "../../api/modules/booking.api";
import Container from "../../components/Container/Container";
import "./BookingFlow.css";

// BOOKING FLOW
//NASUSUSKA AKO WEYT
const BookingFlow = () => {
    const { scheduleId } = useParams();
    const navigate = useNavigate();

    const [step, setStep] = useState("seats"); 
    const [schedule, setSchedule] = useState(null);
    const [seatAvailability, setSeatAvailability] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [_paymentData, setPaymentData] = useState(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchScheduleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleId]);

    const fetchScheduleDetails = async () => {
        try {
            setLoading(true);
            const response = await bookingApi.getScheduleDetail(scheduleId);
            if (response.error) {
                setError(response.message);
                return;
            }
            setSchedule(response.schedule);
            setSeatAvailability(response.seatAvailability);
        } catch (_err) {
            setError("Failed to load schedule");
        } finally {
            setLoading(false);
        }
    };

    const handleSeatsSelect = (seats) => {
        setSelectedSeats(seats);
    };

    const handlePaymentSuccess = async (payment) => {
        try {
            setLoading(true);
            const response = await bookingApi.bookSeats(scheduleId, selectedSeats, payment.paymentId);

            if (response.error) {
                setError(response.message);
                setStep("payment");
                setLoading(false);
                return;
            }

            setPaymentData(payment);
            setBooking(response);
            setStep("confirmation");
        } catch (err) {
            setError("Failed to process booking");
            setStep("payment");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTicket = () => {
        // FAKE DOWNLOAD
        alert("Ticket download feature would generate a PDF with booking details");
    };

    const handleDone = () => {
        navigate("/");
    };

    const proceedToPayment = () => {
        if (selectedSeats.length === 0) {
            setError("Please select at least one seat");
            return;
        }
        setStep("payment");
    };

    const backToSeats = () => {
        setStep("seats");
    };

    if (loading && !schedule) {
        return (
            <Container>
                <div className="loading">Loading booking details...</div>
            </Container>
        );
    }

    if (error && !booking) {
        return (
            <Container>
                <div className="error-banner">
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="booking-flow-container">
                <div className="margin-container">
                    <div className="booking-steps">
                        <div className={`step ${step === "seats" ? "active" : ""} ${step !== "seats" && selectedSeats.length > 0 ? "completed" : ""}`}>
                            <div className="step-number">1</div>
                            <div className="step-label">Select Seats</div>
                        </div>
                        <div className={`step ${step === "payment" ? "active" : ""} ${step === "confirmation" ? "completed" : ""}`}>
                            <div className="step-number">2</div>
                            <div className="step-label">Payment</div>
                        </div>
                        <div className={`step ${step === "confirmation" ? "active" : ""} ${step === "confirmation" ? "completed" : ""}`}>
                            <div className="step-number">3</div>
                            <div className="step-label">Confirmation</div>
                        </div>
                    </div>

                    {step === "seats" && schedule && (
                        <div className="booking-step-content">
                            <div className="step-header">
                                <h2>Select Your Seats</h2>
                                <p>Click on seats to select them. Available seats are highlighted.</p>
                            </div>
                            <SeatSelector
                                schedule={schedule}
                                seatAvailability={seatAvailability}
                                onSeatsSelect={handleSeatsSelect}
                            />
                            <div className="step-actions">
                                <button className="btn-back" onClick={() => navigate(-1)}>
                                    ← Back
                                </button>
                                <button
                                    className="btn-next"
                                    onClick={proceedToPayment}
                                    disabled={selectedSeats.length === 0}
                                >
                                    Proceed to Payment →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "payment" && schedule && (
                        <div className="booking-step-content">
                            <div className="step-header">
                                <h2>Complete Payment</h2>
                                <p>Secure payment gateway - Your information is protected</p>
                            </div>
                            <PaymentUI
                                totalAmount={selectedSeats.length * schedule.pricePerSeat}
                                selectedSeats={selectedSeats}
                                onPaymentSuccess={handlePaymentSuccess}
                                onCancel={backToSeats}
                            />
                            {loading && <div className="loading-overlay">Processing payment...</div>}
                        </div>
                    )}

                    {step === "confirmation" && booking && schedule && (
                        <div className="booking-step-content">
                            <BookingConfirmation
                                booking={booking}
                                schedule={schedule}
                                onDownload={handleDownloadTicket}
                                onDone={handleDone}
                            />
                        </div>
                    )}</div>
            </div>
        </Container>
    );
};

export default BookingFlow;
