"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Armchair, ChevronRight, Info, Check, Monitor, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import authSvc from "@/services/auth.service";
import { log } from "console";
import { useAuth } from "@/context/auth.context";


interface Seat {
  seatNumber: string;
  status: "available" | "booked" | "reserved";
  _id: string;
}

interface Showtime {
  _id: string;
  movieId: string;
  screen: string;
  seats: Seat[];
  status: string;
  language: string;
  startTime: string;
  date: string;
  price: number; 
}

interface Movie {
  _id: string;
  title: string;
}

export default function MovieBookingSystem() {
  const {loggedInUser} = useAuth();
  const { showtimeId } = useParams();
  const router = useRouter();
  
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  
  useEffect(() => {
    if (!showtimeId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await authSvc.getRequest(`/showtime/getshowtime/${showtimeId}`);
        const showtimeData = res?.data?.data || res?.data;
        
        if (showtimeData) {
          setShowtime(showtimeData);
          
          const movieRes = await authSvc.getRequest(`/movie/${showtimeData.movieId}`);
          const movieData = movieRes?.data?.data || movieRes?.data;
          if (movieData) setMovie(movieData);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch theater layout.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showtimeId]);

 
  const rows = useMemo(() => {
    if (!showtime?.seats) return [];
    
    const groups: Record<string, Seat[]> = {};
    showtime.seats.forEach((seat) => {
      const rowChar = seat.seatNumber.charAt(0);
      if (!groups[rowChar]) groups[rowChar] = [];
      groups[rowChar].push(seat);
    });

    return Object.keys(groups).sort().map((label) => ({
      label,
      seats: groups[label].sort((a, b) => 
        parseInt(a.seatNumber.substring(1)) - parseInt(b.seatNumber.substring(1))
      ),
    }));
  }, [showtime]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "booked" || seat.status === "reserved") {
      toast.error(`Seat ${seat.seatNumber} is already ${seat.status}`);
      return;
    }
    
    setSelectedSeats((prev) =>
      prev.includes(seat.seatNumber)
        ? prev.filter((s) => s !== seat.seatNumber)
        : [...prev, seat.seatNumber]
    );
  };

 
  const handleProceedPayment = async () => {
    if (!showtime || selectedSeats.length === 0) return;

    setIsProcessing(true);
    try {
     
      const payload = {
        userId: loggedInUser?._id, 
        movieId: showtime.movieId,
        showtimeId: showtime._id,
        seats: selectedSeats.map((num) => ({ seatNumber: num })),
        totalAmount: selectedSeats.length * showtime.price,
      };

      const res = await authSvc.postRequest("/booking", payload,{
        headers: {
         "Content-Type": "application/json",
             "Authorization": `Bearer `+ localStorage.getItem("_at_movieticket"), 
        },
      });
      
      
      const bookingId = res.data?._id || res.data?.data?._id ;
      console.log("Booking response:", res);
      
      
      toast.success("Seats reserved successfully!");
      router.push(`/checkout/${bookingId}`);

    } catch (err: any) {
     
      if(!loggedInUser)
      {
        toast.error("Please login first!")
      }
      else{
        toast.error(err.response?.data?.message || "Failed to reserve seats. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const ticketPrice = showtime?.price || 0;
  const totalAmount = selectedSeats.length * ticketPrice;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p>Syncing Auditorium...</p>
      </div>
    </div>
  );

  if (!showtime) return <div className="p-20 text-center font-medium">Showtime not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">
              <Ticket className="w-4 h-4" /> Now Booking
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
              {movie?.title || "Movie Name"} <span className="text-slate-400 font-light">/ {showtime.screen}</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {showtime.language} • {showtime.startTime} • Rs. {ticketPrice} per seat
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] border border-slate-200 p-8 md:p-16 shadow-sm overflow-hidden">
              <div className="flex flex-wrap justify-center gap-6 mb-16">
                <LegendItem color="bg-emerald-500" label="Available" />
                <LegendItem color="bg-rose-500" label="Booked" />
                <LegendItem color="bg-amber-500" label="Reserved" />
                <LegendItem color="bg-indigo-600" label="Selected" />
              </div>

              <div className="relative mb-20 text-center">
                <div className="w-4/5 h-1.5 `bg-gradient-to-r` from-transparent via-slate-800 to-transparent mx-auto rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.2)]" />
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 flex items-center justify-center gap-2">
                  <Monitor className="w-3 h-3" /> Screen
                </p>
              </div>

             
              <div className="flex flex-col gap-10 items-center overflow-x-auto pb-8">
                {rows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-5 w-full border-b border-slate-50 pb-8 last:border-0">
                    <div className="flex items-start gap-8">
                      <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl bg-slate-900 text-white text-sm font-black shadow-lg">
                        {row.label}
                      </div>
                      <div className="flex flex-col gap-5">
                        {Array.from({ length: Math.ceil(row.seats.length / 10) }).map((_, chunkIdx) => {
                          const start = chunkIdx * 10;
                          const chunk = row.seats.slice(start, start + 10);
                          return (
                            <div key={`${row.label}-chunk-${chunkIdx}`} className="flex gap-12 items-start">
                              <div className="grid grid-cols-2 gap-2">
                                {chunk.slice(0, 2).map(seat => (
                                  <SeatItem key={seat._id} seat={seat} selected={selectedSeats.includes(seat.seatNumber)} onClick={() => toggleSeat(seat)} />
                                ))}
                              </div>
                              <div className="grid grid-cols-6 gap-2">
                                {chunk.slice(2, 8).map(seat => (
                                  <SeatItem key={seat._id} seat={seat} selected={selectedSeats.includes(seat.seatNumber)} onClick={() => toggleSeat(seat)} />
                                ))}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {chunk.slice(8, 10).map(seat => (
                                  <SeatItem key={seat._id} seat={seat} selected={selectedSeats.includes(seat.seatNumber)} onClick={() => toggleSeat(seat)} />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl sticky top-8">
              <h2 className="text-2xl font-bold mb-8">Summary</h2>

              {selectedSeats.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4 mb-10">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Seats ({selectedSeats.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(seat => (
                        <div key={seat} className="px-4 py-2 bg-white/10 rounded-xl text-sm font-black border border-white/10">
                          {seat}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/10">
                    <div className="flex justify-between text-3xl font-black pt-4">
                      <span>Total</span>
                      <span className="text-emerald-400">Rs. {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleProceedPayment}
                    disabled={isProcessing}
                    className="w-full mt-10 py-5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                  >
                    {isProcessing ? "Reserving..." : "Proceed to Payment"} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 opacity-30">
                  <Armchair className="w-16 h-16 mx-auto stroke-1" />
                  <p className="font-medium">No seats selected.<br/>Select your preferred view.</p>
                </div>
              )}
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-4xl p-6 flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-indigo-900 text-sm">Need Help?</p>
                <p className="text-indigo-700 text-xs leading-relaxed mt-1">Final price includes all applicable taxes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function SeatItem({ seat, selected, onClick }: { seat: Seat; selected: boolean; onClick: () => void }) {
  const getStyles = () => {
    if (seat.status === "booked") return "bg-rose-500 text-white cursor-not-allowed opacity-80";
    if (seat.status === "reserved") return "bg-amber-500 text-white cursor-wait";
    if (selected) return "bg-indigo-600 text-white scale-110 ring-4 ring-indigo-100 z-10 shadow-xl";
    return "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-sm";
  };

  return (
    <button
      onClick={onClick}
      disabled={seat.status !== "available"}
      className={`relative w-8 h-9 rounded-t-xl transition-all duration-200 flex items-center justify-center ${getStyles()}`}
    >
      <Armchair size={16} />
      {selected && (
        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 border border-indigo-600">
           <Check size={8} className="text-indigo-600" strokeWidth={4} />
        </div>
      )}
    </button>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3.5 h-3.5 rounded-full ${color}`} />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}