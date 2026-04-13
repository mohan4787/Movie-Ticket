"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import authSvc from "@/services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return toast.error("Please enter your email address");
    }

    try {
      setLoading(true);
      await authSvc.postRequest("/auth/forget-password", {
        email: email
      }); 
      
      toast.success("Reset link sent! Please check your email inbox.");
      setEmail(""); 
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Failed to send reset link.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center">
            <Image
              src={logo}
              alt="CineTix Logo"
              width={60}
              height={60}
              className="rounded-full shadow-md mb-2"
            />
            <h2 className="text-3xl font-black text-red-600 tracking-tighter">
              CineTix
            </h2>
          </Link>
          <h3 className="mt-6 text-2xl font-bold text-gray-900">
            Forgot Password?
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            No worries! Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative group">
            <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-red-200 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </form>

       
        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;