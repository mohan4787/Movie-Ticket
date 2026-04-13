"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Ticket, Calendar, Clock, Inbox, ChevronRight, CheckCircle2, ChevronLeft, Search } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import authSvc from "@/services/auth.service";
import { useAuth } from "@/context/auth.context";

export default function MyBookingsPage() {
  const {loggedInUser}=useAuth();
  const router = useRouter();
  const params = useParams();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const fetchBookings = useCallback(async () => {
    try {
      const userId =loggedInUser?._id;
      const response = await authSvc.getRequest(`/booking/allbookings/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("_at_movieticket")}`,
        },
      });

      const allData = response.data || [];
      const confirmedOnly = allData.filter((b: any) => b.bookingStatus === "confirmed");
      setBookings(confirmedOnly);
    } catch (error: any) {
      if (!loggedInUser) {
        toast.error("Please login first!");
      }else{
        toast.error(error.response?.data?.message || "Failed to load bookings");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = useMemo(() => {
    if (!searchDate) return bookings;
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt).toISOString().split("T")[0];
      return bookingDate === searchDate;
    });
  }, [bookings, searchDate]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
        <p className="text-slate-500 font-black uppercase tracking-tighter italic">Fetching your confirmed seats...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Confirmed Tickets
            </h1>
            <p className="text-emerald-600 font-bold uppercase text-xs tracking-[0.2em] mt-3 flex items-center gap-2">
              <CheckCircle2 size={14} /> {filteredBookings.length} Result{filteredBookings.length !== 1 ? 's' : ''}
            </p>
          </div>

          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="date" 
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              />
              {searchDate && (
                <button 
                  onClick={() => setSearchDate("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-rose-500 uppercase"
                >
                  Clear
                </button>
              )}
            </div>
            <button 
              onClick={() => router.push("/")}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg text-sm uppercase tracking-widest"
            >
              Book More
            </button>
          </div>
        </header>

        {paginatedBookings.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-xl">
            <Inbox className="mx-auto text-slate-200 mb-6" size={80} />
            <h2 className="text-2xl font-black text-slate-900 uppercase italic">No Tickets Found</h2>
            <p className="text-slate-400 font-medium mt-2">Try adjusting your date filter or book a new movie.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {paginatedBookings.map((booking) => (
              <BookingTicket key={booking._id} booking={booking} />
            ))}
          </div>
        )}

       
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black transition-all ${
                    currentPage === i + 1 
                    ? "bg-emerald-500 text-white shadow-emerald-200 shadow-lg" 
                    : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingTicket({ booking }: { booking: any }) {
  const router = useRouter();
  const displayDate = new Date(booking.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div 
      onClick={() => router.push(`/tickets/${booking._id}`)}
      className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col lg:flex-row cursor-pointer"
    >
      <div className="p-10 flex flex-col items-center justify-center relative min-w-60 bg-slate-900 group-hover:bg-black transition-colors">
        <div className="p-3 rounded-2xl bg-white shadow-inner">
          <QRCodeSVG 
            value={JSON.stringify({ id: booking._id, movie: booking.movieId?.title })} 
            size={120}
            level="H"
          />
        </div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Valid Entry</p>
        <div className="absolute -right-4 top-0 bottom-0 w-8 flex flex-col justify-around py-4 z-10  lg:flex">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-[#F8FAFC] rounded-full -mr-4 border border-slate-100 shadow-inner" />
          ))}
        </div>
      </div>

      <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-600 border-emerald-200 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border">
              {booking.bookingStatus}
            </span>
            <h3 className="text-3xl font-black text-slate-900 italic uppercase leading-none pt-2 group-hover:text-emerald-600 transition-colors">
              {booking.movieId?.title}
            </h3>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 min-w-35 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Paid</p>
            <p className="text-xl font-black text-slate-900">Rs. {booking.totalAmount}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Show Date</p>
              <p className="text-xs font-black text-slate-700">{displayDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seats</p>
              <p className="text-xs font-black text-slate-700">{booking.seats?.map((s: any) => s.seatNumber).join(", ")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
              <Ticket size={18} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Screen</p>
              <p className="text-xs font-black text-slate-700 uppercase">Premium Screen 1</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 group-hover:bg-emerald-500 transition-all flex items-center justify-center px-4 py-4 lg:py-0 border-t lg:border-t-0 lg:border-l border-slate-100 text-slate-300 group-hover:text-white">
        <ChevronRight size={24} className="group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}