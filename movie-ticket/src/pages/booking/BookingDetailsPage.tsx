import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Download, 
  MapPin, 
  Calendar, 
  Clock, 
  Armchair, 
  Info,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import bookingService from '../../services/booking.service';

interface Seat {
  seatNumber: string;
  status: string;
  _id: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Booking {
  _id: string;
  userId: User;
  movieId: string;
  showtimeId: string;
  seats: Seat[];
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  createdBy: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;

      try {
        console.log("Fetching booking for userId:", id);
        const response = await bookingService.getRequest(`/booking/${id}`);
        console.log("API response:", response);

        // Store actual booking object in state
        setBooking(response.data);
      } catch (err) {
        console.error("Error fetching booking details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading Ticket...</div>;
  if (!booking) return <div className="p-10 text-center">Booking not found.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Bookings
        </button>

        <div className="bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800">
          
          {/* Top Section */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-purple-700 p-8 flex items-end">
            <div className="absolute top-4 right-6 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest">
              Digital Entry Pass
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">MOVIE EXPERIENCE</h1>
              <p className="text-indigo-100 opacity-80 flex items-center gap-2 mt-1">
                <Info className="w-4 h-4" /> Movie ID: {booking.movieId}
              </p>
              {booking.userId && (
                <p className="text-indigo-100 opacity-80 flex items-center gap-2 mt-1">
                  <Info className="w-4 h-4" /> Name: {booking.userId.name} | Email: {booking.userId.email}
                </p>
              )}
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 relative">
            
            {/* Left Column: Details */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-zinc-500 text-xs uppercase font-bold mb-1">Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-500 text-xs uppercase font-bold mb-1">Time</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium">{new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 text-xs uppercase font-bold mb-2">Selected Seats</label>
                <div className="flex flex-wrap gap-2">
                  {booking.seats.map(seat => (
                    <div key={seat._id} className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-xl">
                      <Armchair className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-lg">{seat.seatNumber}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-500">Payment Status</span>
                  <span className="text-green-400 font-bold uppercase text-sm flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> {booking.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Booking Status</span>
                  <span className="text-indigo-400 font-bold uppercase text-sm">{booking.bookingStatus}</span>
                </div>
              </div>
            </div>

            {/* Right Column: QR Code / Verification */}
            <div className="flex flex-col items-center justify-center bg-zinc-800/30 rounded-2xl p-6 border border-zinc-800">
              <div className="bg-white p-4 rounded-xl mb-4">
                <QrCode className="w-32 h-32 text-black" />
              </div>
              <p className="text-xs text-zinc-500 text-center mb-6">
                Scan this code at the cinema entrance.<br/>Booking Ref: {booking._id}
              </p>
              <button className="w-full flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 font-bold py-3 rounded-xl hover:bg-white transition-all active:scale-95">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            {/* Decorative Ticket "Notches" */}
            <div className="absolute top-1/2 -left-4 w-8 h-8 bg-zinc-950 rounded-full -translate-y-1/2"></div>
            <div className="absolute top-1/2 -right-4 w-8 h-8 bg-zinc-950 rounded-full -translate-y-1/2"></div>
          </div>

          {/* Footer Info */}
          <div className="bg-zinc-800/50 p-6 border-t border-zinc-800 flex items-start gap-3">
             <MapPin className="w-5 h-5 text-zinc-500 mt-1" />
             <p className="text-sm text-zinc-400">
               <strong>Cinema Location:</strong> Star Cinema Complex, Level 4, Downtown Mall. Please arrive 15 minutes before the showtime.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;