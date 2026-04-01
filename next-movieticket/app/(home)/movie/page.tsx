"use client";

import { useEffect, useState } from "react";
import MovieCard, { IMovieData } from "@/components/MovieCard";
import movieService from "@/services/movie.service";
import { toast } from "sonner";

export default function MoviePage() {
  const [movies, setMovies] = useState<IMovieData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const res = await movieService.getRequest("/movie", {
        params: { status: "active", limit: 20 },
      });
      setMovies(res.data.data || res.data);
    } catch {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F1E8] px-6 py-12">
      <h1 className="text-4xl font-bold mb-12 tracking-wide">
        NOW SHOWING
      </h1>

      {movies.length === 0 ? (
        <p className="text-gray-500">No movies available</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}