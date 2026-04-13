"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export interface IUpcomingMovie {
  _id: string;
  title: string;
  poster?: {
    optimizedUrl?: string;
    secureUrl?: string;
  };
  expectedReleaseDate: string;
  teaserUrl?: string;
  preBookingAvailable?: boolean;
  status: "active" | "inactive";
}

const UpcomingMovieCard = ({ movie }: { movie: IUpcomingMovie }) => {
  const router = useRouter();

  return (
    <motion.div 
      whileHover={{ scale: 1.03 }} 
      className="group cursor-pointer"
      onClick={() => router.push(`/movies/${movie._id}`)} // Clicking the card also goes to details
    >
      <div className="relative rounded-3xl overflow-hidden">
        <img
          src={
            movie.poster?.optimizedUrl ||
            movie.poster?.secureUrl ||
            "https://placehold.co/400x600"
          }
          alt={movie.title}
          className="w-full h-105 object-cover"
        />

       
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
          {/* Detail Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/upcomingmovie/${movie._id}`);
            }}
            className="px-5 py-2 rounded-lg font-semibold bg-white text-black hover:bg-gray-200 transition"
          >
             Details
          </button>

          {/* Trailer Button */}
          {movie.teaserUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(movie.teaserUrl, "_blank");
              }}
              className="px-5 py-2 rounded-lg font-semibold bg-orange-500 text-white hover:bg-orange-600 transition"
            >
              Trailer
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold text-lg uppercase tracking-wide">
          {movie.title}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Release Date:{" "}
          {new Date(movie.expectedReleaseDate).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

export default UpcomingMovieCard;