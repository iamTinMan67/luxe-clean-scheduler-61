
import BookingHeader from "@/components/booking/BookingHeader";
import BookingContainer from "@/components/booking/BookingContainer";

const Booking = () => {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <BookingHeader />
        <BookingContainer />
      </div>
    </div>
  );
};

export default Booking;
