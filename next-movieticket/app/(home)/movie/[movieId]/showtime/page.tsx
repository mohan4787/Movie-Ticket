"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import movieService from "@/services/movie.service";
import { toast } from "sonner";
import Link from "next/link";
import { Calendar, Clock, Film, MapPin, ChevronRight } from "lucide-react"; // Optional icons

// --- Interfaces ---
interface IMovieDetail {
  _id: string;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  genre: string;
  slug: string;
  poster?: { secureUrl: string };
}

interface IShowtime {
  _id: string;
  date: string;
  startTime: string;
  endTime?: string;
  screen: string;
}

// --- Sub-Component: Showtime Day Group ---
function ShowtimeList({ showtimes }: { showtimes: IShowtime[] }) {
  const grouped = useMemo(() => {
    return showtimes.reduce((acc, st) => {
      const date = new Date(st.date).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(st);
      return acc;
    }, {} as Record<string, IShowtime[]>);
  }, [showtimes]);

  if (showtimes.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-500">No upcoming showtimes scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      {Object.entries(grouped).map(([date, times]) => (
        <div key={date} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {date}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {times.map((st) => (
              <button
                key={st._id}
                className="group flex flex-col items-center justify-center p-3 border border-gray-200 rounded-xl hover:border-black hover:bg-black hover:text-white transition-all duration-200 shadow-sm"
              >
                <span className="text-lg font-bold">{st.startTime}</span>
                <span className="text-[10px] uppercase opacity-60 font-medium tracking-tight">
                  {st.screen}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main Page ---
export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params?.movieId as string;

  const [movie, setMovie] = useState<IMovieDetail | null>(null);
  const [showtimes, setShowtimes] = useState<IShowtime[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!movieId) return;
    try {
      setLoading(true);
      const [movieRes, showtimeRes] = await Promise.all([
        movieService.getRequest(`/movie/${movieId}`, { params: { status: "active" } }),
        movieService.getRequest(`/showtime/${movieId}`),
      ]);

      setMovie(movieRes?.data || null);
      
      const stData = showtimeRes?.data?.data || showtimeRes?.data || [];
      setShowtimes(Array.isArray(stData) ? stData : []);
    } catch (err) {
      toast.error("Failed to fetch cinematic details");
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Preparing your experience...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Movie not found</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Poster */}
          <div className="lg:col-span-4 sticky top-12">
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={movie.poster?.secureUrl.replace("/upload/", "/upload/w_800,q_80,f_auto/")}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white text-sm font-medium flex items-center gap-1">
                  <Film className="w-4 h-4" /> Cinematic Quality
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Details & Showtimes */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {movie.genre}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" /> {movie.duration} mins
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {movie.title}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mb-10">
              {movie.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Release Date</p>
                <p className="font-semibold">{new Date(movie.releaseDate).toDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Status</p>
                <p className="font-semibold">Now Playing</p>
              </div>
            </div>

            {/* Showtime Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold tracking-tight">Available Showtimes</h2>
              </div>
              <ShowtimeList showtimes={showtimes} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}