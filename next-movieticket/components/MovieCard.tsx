"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export interface IMovieData {
  _id: string;
  title: string;
  poster?: { optimizedUrl?: string };
  rating: number;
  duration?: number;
  status: "active" | "inactive";
}

const MovieCard = ({ movie }: { movie: IMovieData }) => {
  const router = useRouter();
  const isInactive = movie.status !== "active";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="group cursor-pointer"
      onClick={() => {
        if (!isInactive) router.push(`/booking/${movie._id}`);
      }}
    >
      <div className="relative rounded-3xl overflow-hidden">
        <img
          src={movie.poster?.optimizedUrl || "https://placehold.co/400x600"}
          alt={movie.title}
          className="w-full h-105 object-cover"
        />

        <div className="absolute top-3 right-3 bg-orange-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold">
          {Math.round(movie.rating)}
        </div>

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <button
            disabled={isInactive}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              isInactive
                ? "bg-gray-300 text-gray-500"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            🎟 Buy Now
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold text-lg uppercase tracking-wide">
          {movie.title}
        </h2>

        {movie.duration && (
          <p className="text-gray-500 text-sm mt-1">
            {Math.floor(movie.duration / 60)} HOURS {movie.duration % 60} MINS
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;