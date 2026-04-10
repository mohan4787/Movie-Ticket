"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Ticket, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import authSvc from "@/services/auth.service";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Ref to ensure the API is only called once per mount
  const verificationStarted = useRef(false);

  const pidx = searchParams.get("pidx");

  useEffect(() => {
    const verifyPayment = async () => {
      // 1. Check for pidx in URL
      if (!pidx) {
        setStatus("error");
        return;
      }

      // 2. Guard against double-calling (StrictMode)
      if (verificationStarted.current) return;
      verificationStarted.current = true;

      try {
        const response = await authSvc.postRequest(
          "/order/verify-payment",
          { pidx },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer `+ localStorage.getItem("_at_movieticket"), // Use stored token for auth
              // "Authorization": `Bearer rQZhtundefinedEE1undefinedkIXgABnvUzhQeEFHsS8E1Xg1ThISJ5Z5rMHgBEUJadPklymMehj6eH7T9TJTDbNITPnqSVmprhgItYundefinedYFVC5fWQBi2gDBQt2XNbfO7OQM6koJEG9aVjcYCRiO6dUbdRGIgjQN7lY725Z`,
            },
          }
        );

        // Logic: Success if status is correct OR the backend confirms it was already paid
        const isSuccess =
          response.data?.status === "PAYMENT_SUCCESS" ||
          response.data?.paymentStatus === "paid";

        if (isSuccess) {
          setOrderDetails(response.data.data || response.data.order);
          setStatus("success");
          toast.success("Payment Verified Successfully!");
        } else {
          throw new Error("Verification check failed");
        }
      } catch (error: any) {
        // CATCH: If backend throws 400/500 because it's already verified, treat as success
        const errorMsg = error.response?.data?.message?.toLowerCase() || "";
        
        if (errorMsg.includes("already verified") || error.response?.data?.paymentStatus === "paid") {
          console.log("Payment already confirmed in previous attempt.");
          setOrderDetails(error.response?.data?.data || error.response?.data?.order);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 text-center">
        
        {/* LOADING STATE */}
        {status === "loading" && (
          <div className="space-y-6 py-10">
            <div className="relative flex justify-center">
              <Loader2 className="animate-spin text-indigo-500" size={60} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <ShieldCheckIcon size={24} className="text-indigo-200" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Verifying</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium leading-relaxed">
                Checking payment status with Khalti. <br />Please stay on this page.
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
          <div className="animate-in zoom-in-95 duration-500 space-y-8">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="text-emerald-500" size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Success!</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">Your movie tickets are now confirmed.</p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</span>
                <span className="text-[10px] font-mono font-bold text-slate-700 truncate ml-4 uppercase">
                  {pidx?.substring(0, 18)}...
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                <span className="bg-emerald-100 text-emerald-600 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">Verified</span>
              </div>
            </div>

            <button 
              onClick={() => router.push("/my-bookings")}
              className="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-200"
            >
              View My Tickets <Ticket size={18} />
            </button>
          </div>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <div className="animate-in fade-in duration-500 space-y-8 py-6">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="text-rose-500" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Verification Failed</h2>
              <p className="text-slate-400 text-sm mt-3 font-medium leading-relaxed">
                We couldn't confirm your payment. If money was deducted, it will be refunded or your ticket will be updated shortly.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.push("/")}
                className="w-full py-4 text-slate-400 font-bold flex items-center justify-center gap-2 hover:text-slate-900 transition-all uppercase text-[10px] tracking-widest"
              >
                Go to Home <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Support Icon
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