"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import upcomingmovieService from "@/services/upcomingmovie.service";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function UpcomingMovieDetailPage() {
  const { movieId } = useParams();
  const router = useRouter();

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetail = async () => {
      try {
        setLoading(true);

        const res = await upcomingmovieService.getRequest(
          `/upcomingmovie/${movieId}`
        );

        setMovie(res.data);
      } catch (error) {
        toast.error("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e7e1cf]">
        <div className="animate-spin h-8 w-8 border-2 border-[#E36414] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20 bg-[#e7e1cf] min-h-screen">
        Movie not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e7e1cf] text-[#2b2b2b]">
      <div className="max-w-6xl mx-auto px-6 pt-8 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-600 uppercase">
          Movie Detail
        </h2>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex gap-4 bg-[#ded6c2] p-4 rounded-md items-start">

          <div className="w-70 `shrink-0`">
            <img
              src={movie.poster?.secureUrl}
              alt={movie.title}
              className="w-full h-51 object-cover rounded-sm shadow-sm"
            />
          </div>
          <div className="flex-1">
            <div className="inline-block bg-[#E36414] px-4 py-1 mb-3">
              <h1 className="text-xl font-bold text-black uppercase">
                {movie.title}
              </h1>
            </div>

            <p className="text-xs tracking-[2px] text-gray-700 mb-3 uppercase">
              {movie.genre?.join(" ") || "N/A"}
            </p>

            <p className="text-sm leading-6 text-gray-800 mb-5">
              {movie.description}
            </p>

            <div className="space-y-2 text-sm">
              <Row label="Language" value={movie.language || "N/A"} />
              <Row label="Status" value={movie.status || "N/A"} />

              <Row
                label="Release"
                value={new Date(movie.expectedReleaseDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              />

              <Row
                label="Duration"
                value={
                  movie.duration
                    ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m`
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="`w-22.5` font-semibold text-black text-sm">
        {label}:
      </span>
      <span className="text-gray-900 text-sm">{value}</span>
    </div>
  );
}