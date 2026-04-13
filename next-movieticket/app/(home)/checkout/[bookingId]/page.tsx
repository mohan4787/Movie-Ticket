"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Film,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import authSvc from "@/services/auth.service";

export default function MovieCheckoutPage({ params }: any) {
  const resolvedParams: any = use(params);
  const bookingId = resolvedParams.bookingId;

  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

 
  useEffect(() => {
    const fetchBookingInfo = async () => {
      try {
        const response = await authSvc.getRequest(`/booking/${bookingId}`);
        const data = response.data?.data || response.data;
        if (data) {
          setBookingData(data);
        }
      } catch (error) {
        console.error("Booking Fetch Error:", error);
        toast.error("Could not load booking details.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBookingInfo();
  }, [bookingId]);

  
  const handleCheckoutProcess = async () => {
    if (!bookingData) return;

    setIsPaying(true);
    try {
     
      const orderResponse = await authSvc.postRequest(
        `/order`,
        {
          bookingId: bookingId,
          userId: bookingData?.userId?._id || "69a3e1d86a900581dba87db2",
          paymentMethod: "khalti",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ` + localStorage.getItem("_at_movieticket"),
          },
        },
      );

      const order = orderResponse.data?.data || orderResponse.data;
      const orderId = order?._id;

      if (!orderId) throw new Error("Order creation failed.");

    
      const paymentResponse = await authSvc.postRequest(
        `/order/initiate-payment/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ` + localStorage.getItem("_at_movieticket")
          },
        },
      );

      
      const paymentData = paymentResponse.data;

   
      if (paymentData && paymentData.payment_url) {
        toast.success("Redirecting to Khalti Secure Gateway...");

      
        window.location.href = paymentData.payment_url;
      } else {
        console.error("Payment Data Mismatch:", paymentData);
        throw new Error("Payment URL not found in server response");
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(
        error.response?.data?.message || "Checkout failed. Please try again.",
      );
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-500 mb-2" size={40} />
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
          Loading your reservation...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-6 font-sans">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Film size={100} strokeWidth={1} />
            </div>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
              Secure Checkout
            </p>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Confirm & Pay
            </h1>
          </div>

          <div className="p-10 space-y-8">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                  <Monitor size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                    Movie & Theatre
                  </p>
                  <p className="font-bold text-slate-900">
                    {bookingData?.movieId?.title || "Movie Name"} /{" "}
                    {bookingData?.showtimeId?.screen || "Theatre"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Reserved Seats
                  </p>
                  <p className="font-black text-indigo-600 text-lg">
                    {bookingData?.seats
                      ?.map((s: any) => s.seatNumber)
                      .join(", ") || "None"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Showtime
                  </p>
                  <p className="font-bold text-slate-900">
                    {bookingData?.showtimeId?.startTime || "--:--"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-2">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Total Payable
                </p>
                <h2 className="text-4xl font-black text-slate-900">
                  Rs. {bookingData?.totalAmount?.toLocaleString() || "0"}
                </h2>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-purple-100 text-[#5C2D91] px-3 py-1 rounded-full font-black text-[10px] uppercase border border-purple-200">
                  Khalti Wallet
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <button
                onClick={handleCheckoutProcess}
                disabled={isPaying}
                className="w-full h-20 bg-[#5C2D91] hover:bg-[#4c247d] text-white rounded-3xl font-black text-xl shadow-xl shadow-purple-100 transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPaying ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    CONFIRM & PAY
                    <CheckCircle2 className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secured by Khalti Gateway
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-8 mx-auto flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-[10px] tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> Back to Seat Selection
        </button>
      </div>
    </div>
  );
}
