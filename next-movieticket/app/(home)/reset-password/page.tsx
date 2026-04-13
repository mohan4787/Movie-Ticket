"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import authSvc from "@/services/auth.service";
import { Typography, Button, Progress } from "antd";

const { Title, Text } = Typography;

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Calculate password strength for visual feedback
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  useEffect(() => {
    if (!token) {
      toast.error("Security token missing. Please use the link from your email.");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return toast.error("Invalid session. Request a new link.");
    if (formData.password.length < 8) return toast.error("Security requirement: Minimum 8 characters.");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match.");

    try {
      setLoading(true);
      // 1. Verify the temporary token to get the session Bearer
      const verifyResponse = await authSvc.getRequest(`/auth/forget-password-verify/${token}`);

      // 2. Perform the actual reset using the Bearer token returned
      await authSvc.putRequest(`/auth/reset-password/`, 
        { 
          password: formData.password,
          confirmPassword: formData.confirmPassword 
        },
        { headers: { "Authorization": "Bearer " + verifyResponse.data } }
      );

      toast.success("Security update successful!");
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "This link has expired for your security.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-12 rounded-[2rem] shadow-2xl shadow-blue-100 border border-white animate-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="bg-green-50 p-5 rounded-full ring-8 ring-green-50/50">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <Title level={2} className="!mb-2 !font-black">Success!</Title>
          <Text className="text-gray-500 block text-lg">Your CineTix account is now secured with your new password.</Text>
          <div className="pt-4">
             <Button 
                type="primary" 
                block 
                className="h-14 bg-red-600 hover:!bg-red-700 border-none rounded-2xl text-lg font-bold shadow-lg shadow-red-200 transition-all"
                onClick={() => router.push("/login")}
              >
                Go to Login
              </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-white/60 relative overflow-hidden">
        
        {/* Subtle Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-60" />
        
        <div className="text-center relative z-10">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="p-1 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform duration-300">
              <Image src={logo} alt="CineTix" width={60} height={60} className="rounded-full" />
            </div>
            <h2 className="mt-4 text-3xl font-black text-red-600 tracking-tighter uppercase">CineTix</h2>
          </Link>
          <Title level={3} className="!mt-6 !mb-2 !font-bold !text-slate-800">Security Update</Title>
          <p className="text-slate-500 font-medium">Please set your new account password below.</p>
        </div>

        {!token ? (
          <div className="bg-amber-50 p-5 rounded-2xl flex items-start gap-4 border border-amber-100 animate-pulse">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={24} />
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              Security link invalid. This happens if the link was already used or has expired. Please request a new one.
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={20} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 outline-none transition-all bg-slate-50/50 hover:bg-slate-50 font-medium"
                    placeholder="Create strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {/* Strength Meter */}
                <div className="px-1 pt-1">
                  <Progress 
                    percent={passwordStrength} 
                    showInfo={false} 
                    strokeColor={passwordStrength <= 25 ? "#f87171" : passwordStrength <= 50 ? "#fbbf24" : "#10b981"} 
                    size="small" 
                  />
                  <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    Security Strength: {passwordStrength <= 50 ? "Weak" : passwordStrength <= 75 ? "Good" : "Very Strong"}
                  </Text>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">Confirm Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={20} />
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-red-50 focus:border-red-500 outline-none transition-all bg-slate-50/50 hover:bg-slate-50 font-medium"
                    placeholder="Repeat password"
                  />
                </div>
              </div>
            </div>

            <Button
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="w-full !h-14 !border-none !text-white !bg-red-600 hover:!bg-red-700 !rounded-2xl !text-base !font-black !shadow-xl !shadow-red-100 active:scale-[0.97] transition-all uppercase tracking-widest"
            >
              Update My Password
            </Button>
          </form>
        )}

        <div className="text-center pt-4 relative z-10 border-t border-slate-50">
          <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-red-600 transition-colors inline-flex items-center gap-2">
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        <Text className="mt-4 font-bold text-slate-400 uppercase tracking-widest">Authenticating Session...</Text>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;