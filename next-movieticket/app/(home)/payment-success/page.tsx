"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Ticket, ArrowRight, User, Tv } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import authSvc from "@/services/auth.service";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);

  const verificationStarted = useRef(false);
  const pidx = searchParams.get("pidx");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!pidx) {
        setStatus("error");
        return;
      }

      if (verificationStarted.current) return;
      verificationStarted.current = true;

      try {
        const response = await authSvc.postRequest(
          "/order/verify-payment",
          { pidx },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ` + localStorage.getItem("_at_movieticket"),
            },
          }
        );

        const isPaid = response.data?.paymentStatus === "paid" || response.data?.data?.paymentStatus === "paid";
        const isNewSuccess = response.status === "PAYMENT_SUCCESS";
        
        if (isNewSuccess || isPaid) {
          const data = response.data?.data?.data || response.data?.data;
          
          setOrderDetails(data);
          setIsAlreadyVerified(isPaid && !isNewSuccess); 
          setStatus("success");
          
          if (!isPaid || isNewSuccess) {
            toast.success("Payment Verified Successfully!");
          }
        } else {
          throw new Error("Verification check failed");
        }
        
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMsg = errorData?.data?.message?.toLowerCase() || errorData?.message?.toLowerCase() || "";

        
        if (errorMsg.includes("already verified") || errorData?.data?.paymentStatus === "paid") {
          const data = errorData?.data?.data || errorData?.data;
          setOrderDetails(data);
          setIsAlreadyVerified(true);
          setStatus("success");
          return;
        }

        console.error("Verification Error:", error);
        setStatus("error");
        toast.error(error.response?.data?.message || "Payment verification failed.");
      }
    };

    verifyPayment();
  }, [pidx]);

  const qrValue = orderDetails ? JSON.stringify({
    username: orderDetails.userId?.name,
    userId: orderDetails.userId?._id,
    showtimeId: orderDetails.showtimeId,
    seats: orderDetails.seats?.map((s: any) => s.seatNumber),
    movie: orderDetails.movieId?.title,
    orderId: orderDetails._id
  }) : "";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className={`w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-10 transition-all duration-700 ease-in-out ${status === "success" ? "max-w-4xl" : "max-w-md"}`}>
        
        {status === "loading" && (
          <div className="space-y-6 py-10 text-center">
            <div className="relative flex justify-center">
              <Loader2 className="animate-spin text-indigo-500" size={60} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <ShieldCheckIcon size={24} className="text-indigo-200" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900  italic uppercase tracking-tighter">Verifying</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">Securing your seats...</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              
              <div className="flex-1 space-y-6 w-full text-left">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-500" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                      {isAlreadyVerified ? "Already Verified" : "Payment Verified"}
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                      {isAlreadyVerified ? "Your booking is safe!" : `Enjoy the show, ${orderDetails?.userId?.name?.split(' ')[0]}!`}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Movie</p>
                      <p className="text-xl font-black text-slate-900 leading-tight">{orderDetails?.movieId?.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seats</p>
                      <p className="text-sm font-black text-indigo-600">
                        {orderDetails?.seats?.map((s: any) => s.seatNumber).join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-200 w-full" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-600 truncate">{orderDetails?.userId?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Tv size={14} className="text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter">Hall 1 • Screen 1</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => router.push(`/tickets/${orderDetails?._id}`)}
                    className="flex-1 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200"
                  >
                    View Full Ticket <Ticket size={18} />
                  </button>
                  <button 
                    onClick={() => router.push("/")}
                    className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                  >
                    Home
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-72 flex flex-col items-center">
                <div className="relative p-8 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center shadow-sm">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F8FAFC] border-r-2 border-dashed border-slate-200 rounded-full" />
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F8FAFC] border-l-2 border-dashed border-slate-200 rounded-full" />
                  
                  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-inner">
                    <QRCodeSVG 
                      value={qrValue} 
                      size={180} 
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <div className="mt-5 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Scan Entrance</p>
                    <p className="text-[9px] font-mono text-slate-300">ORD-{orderDetails?._id?.substring(18).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="animate-in fade-in duration-500 space-y-8 py-6 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="text-rose-500" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Verification Failed</h2>
              <p className="text-slate-400 text-sm mt-3 font-medium">
                We couldn't confirm your payment. Please contact support if your balance was deducted.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all">Try Again</button>
              <button onClick={() => router.push("/")} className="w-full py-4 text-slate-400 font-bold flex items-center justify-center gap-2 hover:text-slate-900 transition-all uppercase text-[10px] tracking-widest">Back to Movies <ArrowRight size={14} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ShieldCheckIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-300" size={40} />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}