"use client";

import { motion } from "framer-motion";
import { 
  Film, 
  Star,
  ChevronRight, 
  ShieldCheck,
  MousePointerClick
} from "lucide-react";
import { useAuth } from "@/context/auth.context";


const pillars = [
  {
    icon: MousePointerClick,
    title: "Instant Booking",
    desc: "Select seats and book tickets in seconds with a smooth, cinematic experience.",
    color: "text-red-400",
  },
  {
    icon: Film,
    title: "Now Showing",
    desc: "Explore trending movies, trailers, and showtimes all in one place.",
    color: "text-yellow-400",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    desc: "Fast and safe payments with instant ticket confirmation.",
    color: "text-purple-400",
  }
];

const movies = [
  { 
    title: "Avengers", 
    rating: "8.5",
    image: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg"
  },
  { 
    title: "Interstellar", 
    rating: "9.0",
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
  },
  { 
    title: "Joker", 
    rating: "8.8",
    image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
  }
];

export default function AboutPage() {
  const {loggedInUser}=useAuth();
console.log("LoggedInProfile:",loggedInUser);
  return (
    <div className="relative min-h-screen text-white overflow-hidden font-sans">

      {/* 🎬 CINEMA BACKGROUND */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-75 `bg-gradient-to-b` from-white/20 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.25),transparent_70%)]" />
        <div className="absolute bottom-0 w-full h-72 `bg-gradient-to-t` from-black via-[#020617] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,black_100%)]" />
      </div>
      <div className="relative z-10 pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-6 text-center mb-40">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black italic"
          >
            CINE<span className="text-red-500">TIX</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 mt-6 max-w-xl mx-auto"
          >
            Experience movies like never before. Book tickets, choose seats, and enjoy cinema digitally.
          </motion.p>
        </section>
        <section className="max-w-6xl mx-auto px-6 mb-40">
          <h2 className="text-3xl font-black mb-10 text-center text-red-400">Now Showing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {movies.map((movie, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08 }}
                className="bg-black/60 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-xl"
              >
                <div className="h-56 rounded-xl mb-4 overflow-hidden">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-lg">{movie.title}</h3>
                <div className="flex items-center gap-2 text-yellow-400 mt-2">
                  <Star size={16} /> {movie.rating}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-6 mb-40">
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-black/60 backdrop-blur-lg p-8 rounded-3xl border border-white/10"
              >
                <item.icon className={`${item.color} mb-4`} />
                <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
        <section className="text-center px-6 mb-20">
          <h2 className="text-4xl font-black mb-6 text-red-400">
            ENTER THE CINEMA
          </h2>

          <button
            onClick={() => (window.location.href = "/movie")}
            className="mt-8 px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold flex items-center gap-2 mx-auto shadow-lg shadow-red-500/30"
          >
            Book with CineTix <ChevronRight size={16} />
          </button>
        </section>
        <footer className="text-center border-t border-white/10 pt-10">
          <p className="text-gray-500 text-sm">© CineTix • Feel the Cinema</p>
        </footer>
      </div>
    </div>
  );
}