"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Armchair, ChevronRight, Info, Check, Monitor, Ticket } from "lucide-react";
import { toast } from "sonner";

// --- Configuration ---
const SCREEN_CONFIGS = {
  "Screen 1": { rows: 9, cols: 10, total: 90, price: 12 },
  "Screen 2": { rows: 10, cols: 12, total: 120, price: 15 },
  "Screen 3": { rows: 10, cols: 13, total: 130, price: 18 },
};

type ScreenKey = keyof typeof SCREEN_CONFIGS;

// --- Mock Data (Simulating existing bookings) ---
const MOCK_BOOKED_SEATS = ["A1", "A2", "C5", "C6", "E7", "F2"];
const MOCK_RESERVED_SEATS = ["B1", "B2", "D10"];

export default function MovieBookingSystem() {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("Screen 1");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const config = SCREEN_CONFIGS[activeScreen];
  const rowLabels = useMemo(() => 
    Array.from({ length: config.rows }, (_, i) => String.fromCharCode(65 + i)),
    [config]
  );

  // Reset selection when changing screens
  const handleScreenChange = (screen: ScreenKey) => {
    setLoading(true);
    setTimeout(() => {
      setActiveScreen(screen);
      setSelectedSeats([]);
      setLoading(false);
    }, 400);
  };

  const getSeatStatus = (seatId: string) => {
    if (MOCK_BOOKED_SEATS.includes(seatId)) return "booked";
    if (MOCK_RESERVED_SEATS.includes(seatId)) return "reserved";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  const toggleSeat = (seatId: string, status: string) => {
    if (status === "booked" || status === "reserved") {
      toast.error("This seat is already taken");
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const subtotal = selectedSeats.length * config.price;
  const bookingFee = selectedSeats.length > 0 ? 2.50 : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs mb-2">
              <Ticket className="w-4 h-4" /> Now Booking
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
              Interstellar <span className="text-slate-400 font-light">/ IMAX</span>
            </h1>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-full lg:w-auto">
            {(Object.keys(SCREEN_CONFIGS) as ScreenKey[]).map((screen) => (
              <button
                key={screen}
                onClick={() => handleScreenChange(screen)}
                className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeScreen === screen
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {screen}
              </button>
            ))}
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* SEAT MAP COLUMN */}
          <div className="lg:col-span-8">
            <div className={`bg-white rounded-[3rem] border border-slate-200 p-8 md:p-16 shadow-sm transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
              
              {/* Legends */}
              <div className="flex flex-wrap justify-center gap-6 mb-16">
                <LegendItem color="bg-emerald-500" label="Available" />
                <LegendItem color="bg-rose-500" label="Booked" />
                <LegendItem color="bg-amber-500" label="Reserved" />
                <LegendItem color="bg-indigo-600" label="Selected" />
              </div>

              {/* Screen Visual */}
              <div className="relative mb-20 text-center">
                <div className="w-4/5 h-2 bg-gradient-to-r from-transparent via-slate-800 to-transparent mx-auto rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.2)]" />
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 flex items-center justify-center gap-2">
                  <Monitor className="w-3 h-3" /> Screen
                </p>
              </div>

              {/* Layout Grid */}
              <div className="flex flex-col gap-5 min-w-max md:min-w-0 overflow-x-auto pb-4 items-center">
                {rowLabels.map((row) => (
                  <div key={row} className="flex items-center gap-4">
                    <span className="w-6 text-xs font-black text-slate-300">{row}</span>
                    <div className="flex gap-2">
                      {Array.from({ length: config.cols }).map((_, i) => {
                        const seatId = `${row}${i + 1}`;
                        const status = getSeatStatus(seatId);
                        const isAisle = (i + 1) % 5 === 0 && i + 1 !== config.cols;

                        return (
                          <React.Fragment key={seatId}>
                            <button
                              onClick={() => toggleSeat(seatId, status)}
                              className={`
                                group relative w-8 h-9 rounded-t-xl transition-all duration-200 flex items-center justify-center
                                ${status === "available" && "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white shadow-sm"}
                                ${status === "booked" && "bg-rose-500 text-white cursor-not-allowed opacity-90"}
                                ${status === "reserved" && "bg-amber-500 text-white cursor-wait opacity-90"}
                                ${status === "selected" && "bg-indigo-600 text-white scale-110 shadow-xl ring-4 ring-indigo-100 z-10"}
                              `}
                            >
                              <Armchair className={`w-4 h-4 ${status === 'selected' ? 'animate-in zoom-in-75' : ''}`} />
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity whitespace-nowrap">
                                {seatId}
                              </span>
                              {status === "selected" && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white text-indigo-600 rounded-full border border-indigo-600 flex items-center justify-center">
                                  <Check className="w-2 h-2" strokeWidth={4} />
                                </div>
                              )}
                            </button>
                            {isAisle && <div className="w-8" />} {/* AISLE GAP */}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CHECKOUT SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl sticky top-8">
              <h2 className="text-2xl font-bold mb-8">Booking Summary</h2>

              {selectedSeats.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4 mb-10">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Selected Seats ({selectedSeats.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map(seat => (
                        <div key={seat} className="px-4 py-2 bg-white/10 rounded-xl text-sm font-black border border-white/10">
                          {seat}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/10">
                    <div className="flex justify-between text-slate-400 font-medium">
                      <span>{activeScreen} Tickets</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-medium">
                      <span>Convenience Fee</span>
                      <span>${bookingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-3xl font-black pt-4 border-t border-white/5">
                      <span>Total</span>
                      <span className="text-emerald-400">${(subtotal + bookingFee).toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => toast.success("Redirecting to secure payment...")}
                    className="w-full mt-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
                  >
                    Proceed to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 opacity-30">
                  <Armchair className="w-16 h-16 mx-auto stroke-1" />
                  <p className="font-medium">No seats selected.<br/>Select your preferred view.</p>
                </div>
              )}
            </div>

            {/* Support Box */}
            <div className="bg-indigo-50 border border-indigo-100 `rounded-4xl` p-6 flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-indigo-900 text-sm">Need Help?</p>
                <p className="text-indigo-700 text-xs leading-relaxed mt-1">Seats are held for 10 minutes once selected. For group bookings larger than 10, contact support.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3.5 h-3.5 rounded-full ${color}`} />
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
}