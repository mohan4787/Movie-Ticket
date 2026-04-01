"use client";

import { useEffect, useState } from "react";
import UpcomingMovieCard, { IUpcomingMovie } from "@/components/UpcomingMovieCard";
import upcomingmovieService from "@/services/upcomingmovie.service";
import { toast } from "sonner";

export default function UpcomingMoviesPage() {
  const [movies, setMovies] = useState<IUpcomingMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingMovies = async () => {
    try {
      const res = await upcomingmovieService.getRequest("/upcomingmovie");
      const moviesList: IUpcomingMovie[] = res.data?.data || res.data || [];
      const upcomingMovies = moviesList.filter(
        (movie: IUpcomingMovie) => new Date(movie.expectedReleaseDate) > new Date()
      );
      setMovies(upcomingMovies);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load upcoming movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F1E8] px-6 py-12">
      <h1 className="text-4xl font-bold mb-12 tracking-wide">
        UPCOMING MOVIES
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading upcoming movies...</p>
      ) : movies.length === 0 ? (
        <p className="text-gray-500 text-center">No upcoming movies available</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {movies.map((movie) => (
            <UpcomingMovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}