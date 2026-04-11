import { useState, useMemo } from 'react';
import { 
  Calendar, Monitor, Clock, Film, 
  User, LogOut, Settings, ChevronDown, 
  TrendingUp, Users, BarChart3, 
  Ticket, CheckCircle2, Wallet
} from 'lucide-react';

// --- Types & Interfaces ---
interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
}

interface PaymentModes {
  upi: number;
  cash: number;
}

interface Show {
  time: string;
  tickets: number;
  capacity: number;
  revenue: number;
  status: string;
  paymentModes: PaymentModes;
}

interface Screen {
  screenName: string;
  shows: Show[];
}

interface MovieEntry {
  movie: string;
  screens: Screen[];
}

// --- Static Data ---
const CURRENT_USER: UserProfile = {
  name: " Mohan Shah",
  role: "Cinema Manager",
  avatarUrl: ""
};

const DAILY_DATA: Record<string, MovieEntry[]> = {
  "2026-04-11": [
    {
      movie: "Pushpa 2: The Rule",
      screens: [
        {
          screenName: "Screen 01 (IMAX)",
          shows: [
            { time: "10:30 AM", tickets: 250, capacity: 250, revenue: 62500, status: "Housefull", paymentModes: { upi: 50000, cash: 12500 } },
            { time: "02:30 PM", tickets: 180, capacity: 250, revenue: 45000, status: "Active", paymentModes: { upi: 40000, cash: 5000 } }
          ]
        }
      ]
    },
    {
      movie: "Singham Again",
      screens: [
        {
          screenName: "Screen 02 (Gold)",
          shows: [
            { time: "11:00 AM", tickets: 45, capacity: 100, revenue: 18000, status: "Completed", paymentModes: { upi: 15000, cash: 3000 } }
          ]
        }
      ]
    }
  ],
  "2026-04-10": [
    {
      movie: "Pushpa 2: The Rule",
      screens: [
        {
          screenName: "Screen 01 (IMAX)",
          shows: [
            { time: "06:00 PM", tickets: 200, capacity: 250, revenue: 50000, status: "Active", paymentModes: { upi: 45000, cash: 5000 } }
          ]
        }
      ]
    }
  ]
};

const formatRs = (n: number) => {
  return "Rs. " + new Intl.NumberFormat('en-NP', {
    maximumFractionDigits: 0
  }).format(n);
};

export default function CinemaAdminDashboard() {
  const [selectedDate, setSelectedDate] = useState("2026-04-11");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const dayData = DAILY_DATA[selectedDate] || [];

  // --- Logic: Daily Stats Aggregator ---
  const dailyTotals = useMemo(() => {
    return dayData.reduce((acc, movie) => {
      movie.screens.forEach(screen => {
        screen.shows.forEach(show => {
          acc.revenue += show.revenue;
          acc.sold += show.tickets;
          acc.capacity += show.capacity;
        });
      });
      return acc;
    }, { revenue: 0, sold: 0, capacity: 0 });
  }, [dayData]);

  // --- Logic: Cumulative Lifetime Movie Collection Report ---
  const cumulativeReport = useMemo(() => {
    const report: Record<string, any> = {};
    Object.values(DAILY_DATA).flat().forEach((movieEntry) => {
      const title = movieEntry.movie;
      if (!report[title]) {
        report[title] = { title, revenue: 0, tickets: 0, shows: 0 };
      }
      movieEntry.screens.forEach(s => s.shows.forEach(sh => {
        report[title].revenue += sh.revenue;
        report[title].tickets += sh.tickets;
        report[title].shows += 1;
      }));
    });
    return Object.values(report);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 1. TOP NAVIGATION & USER PROFILE SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
                <TrendingUp size={24} className="text-white"/>
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase leading-none mb-1">Cine-Ledger</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Admin Gateway</p>
             </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-slate-200 shadow-sm hover:border-indigo-300 transition-all active:scale-95"
            >
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 overflow-hidden border border-slate-200 font-bold text-xs">
                  {CURRENT_USER.avatarUrl ? <img src={CURRENT_USER.avatarUrl} className="w-full h-full object-cover" /> : CURRENT_USER.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-tight">{CURRENT_USER.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">{CURRENT_USER.role}</p>
              </div>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase">Signed in as</p>
                     <p className="text-xs font-bold text-slate-800">{CURRENT_USER.name}</p>
                  </div>
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-600 font-medium">
                    <User size={16} /> My Account
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-600 font-medium">
                    <Settings size={16} /> Dashboard Settings
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button 
                    onClick={() => alert("Logged Out Successfully")}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 font-bold"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* 2. CUMULATIVE LIFETIME MOVIE COLLECTION REPORT */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-indigo-600" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Total Collection Report</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cumulativeReport.map((movie: any, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Film size={60} />
                </div>
                <h3 className="text-sm font-black text-indigo-600 uppercase mb-4 tracking-tighter">{movie.title}</h3>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none">{formatRs(movie.revenue)}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Lifetime Gross</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">{movie.tickets} Tickets Sold</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{movie.shows} Total Shows</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. DAILY PERFORMANCE METRICS & TOTAL CAPACITY */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Calendar size={18} className="text-indigo-600" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 font-mono">Daily Performance Snapshot</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ledger Date</p>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  className="text-lg font-black bg-transparent outline-none cursor-pointer text-indigo-600 w-full" 
                />
             </div>
             <div className="bg-slate-900 p-5 rounded-3xl shadow-xl flex flex-col justify-between text-white border-b-4 border-indigo-500">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Day Gross Revenue</p>
                <p className="text-2xl font-black text-indigo-400 leading-tight">{formatRs(dailyTotals.revenue)}</p>
             </div>
             <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Occupancy Count</p>
                <div className="flex items-baseline gap-1">
                   <p className="text-2xl font-black text-slate-800">{dailyTotals.sold}</p>
                   <p className="text-xs font-bold text-slate-400 uppercase">/ {dailyTotals.capacity} Total Seats</p>
                </div>
             </div>
             <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Fill Rate</p>
                <div className="flex items-center gap-3">
                   <p className="text-2xl font-black text-slate-800">{dailyTotals.capacity > 0 ? Math.round((dailyTotals.sold/dailyTotals.capacity)*100) : 0}%</p>
                   <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{width: `${(dailyTotals.sold/dailyTotals.capacity)*100}%`}}></div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* 4. DAILY SHOWTIME DETAILS (MOVIE -> SCREEN -> SHOW) */}
        <section className="space-y-8">
          {dayData.length > 0 ? (
            dayData.map((movieEntry, mIdx) => (
              <div key={mIdx} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm">
                <div className="bg-slate-800 p-5 px-8 flex justify-between items-center text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
                      <Film size={20} />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight">{movieEntry.movie}</h3>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Movie Daily Collection</p>
                     <p className="text-lg font-black text-indigo-400 leading-none">
                       {formatRs(movieEntry.screens.reduce((acc, s) => acc + s.shows.reduce((sh, v) => sh + v.revenue, 0), 0))}
                     </p>
                  </div>
                </div>

                <div className="p-8">
                  {movieEntry.screens.map((screen, sIdx) => (
                    <div key={sIdx} className="mb-10 last:mb-0">
                      <div className="flex items-center gap-2 mb-6 text-slate-400 border-b border-slate-100 pb-2">
                        <Monitor size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{screen.screenName}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {screen.shows.map((show, shIdx) => (
                          <div key={shIdx} className="bg-slate-50 p-6 rounded-[2.3rem] border border-slate-100 hover:bg-white transition-all shadow-sm hover:shadow-md">
                            <div className="flex justify-between items-center mb-6">
                              <div className="bg-white px-3 py-1.5 rounded-xl border shadow-sm font-black text-xs text-slate-700 flex items-center gap-2">
                                <Clock size={12} className="text-indigo-500" /> {show.time}
                              </div>
                              {show.status === 'Housefull' ? (
                                <span className="flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 uppercase">
                                  <CheckCircle2 size={10} /> Housefull
                                </span>
                              ) : (
                                <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase">
                                  {show.status}
                                </span>
                              )}
                            </div>

                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                                  <Users size={12}/> Capacity Details
                                </p>
                                <p className="text-xs font-black text-slate-800">{show.tickets} Sold / {show.capacity} Total</p>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-700" style={{width: `${(show.tickets/show.capacity)*100}%`}}></div>
                              </div>

                              <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Net Collection</p>
                                  <p className="text-xl font-black text-slate-900 leading-none">{formatRs(show.revenue)}</p>
                                </div>
                                <div className="text-right space-y-0.5">
                                  <div className="flex items-center justify-end gap-1.5 text-[8px] font-black text-slate-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> UPI: {formatRs(show.paymentModes.upi)}
                                  </div>
                                  <div className="flex items-center justify-end gap-1.5 text-[8px] font-black text-slate-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> CASH: {formatRs(show.paymentModes.cash)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
               <Ticket size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-300 font-black uppercase text-xs tracking-[0.4em]">No Daily Ledger Data Found</p>
            </div>
          )}
        </section>

        <footer className="mt-20 text-center pb-12 opacity-20 border-t border-slate-300 pt-8">
           <p className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.5em]">Cine-Ledger Digital System v1.5.8</p>
        </footer>
      </div>
    </div>
  );
}