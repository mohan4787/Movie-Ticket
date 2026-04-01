import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Ticket, CheckCircle2, CreditCard, Calendar, Armchair, Loader2, AlertCircle } from 'lucide-react';
import bookingService from '../../services/booking.service';

// --- Interfaces (Matching your JSON structure) ---
interface Seat {
  seatNumber: string;
  status: string;
  _id: string;
}

interface Booking {
  _id: string;
  userId:string;
  movieId: string;
  showtimeId: string;
  seats: Seat[];
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

interface APIResponse {
  data: {
    data: Booking[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      pages: number;
    };
  };
  message: string;
  status: string;
}

const BookingListPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Replace this URL with your actual backend endpoint
        const response = await bookingService.getRequest("/booking");
        console.log(response);
        
        // Setting the data from the nested structure: response.data.data.data
        setBookings(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  console.log("Bookings:",bookings);

  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // --- Conditional Rendering for States ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <span className="ml-3 text-gray-600 font-medium">Loading your bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Oops!</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Booking History</h1>
          <div className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            {bookings.length} Bookings Found
          </div>
        </header>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No bookings found in your account.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking,index) => (
              <div key={booking._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left: Metadata */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        #{booking._id.slice(-6).toUpperCase()}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(booking.createdAt)}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900">Movie ID: {booking.movieId}</h3>
                  </div>

                  {/* Middle: Seats */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-2 flex items-center">
                      <Armchair className="w-3 h-3 mr-1" /> Reserved Seats
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {booking.seats.map(s => (
                        <span key={s._id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">
                          {s.seatNumber}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Status */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-xs font-bold uppercase ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                        {booking.paymentStatus}
                      </div>
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                        {booking.bookingStatus}
                      </div>
                    </div>
                    <button className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-black transition">
                       <a href={`/admin/booking-detail/${booking.userId}`}>Details</a>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingListPage;