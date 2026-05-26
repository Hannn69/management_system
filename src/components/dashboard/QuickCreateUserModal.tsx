"use client";

import { useState } from "react";
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  AtSign,
  UserSquare2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

interface QuickCreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newUser: any) => void;
  companies: any[];
  locations: any[];
}

export function QuickCreateUserModal({ open, onClose, onSuccess, companies, locations }: QuickCreateUserModalProps) {
  const { push } = useToast();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    companyId: "",
    locationId: "",
    loginEnabled: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      push("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        companyId: form.companyId ? Number(form.companyId) : undefined,
        locationId: form.locationId ? Number(form.locationId) : undefined,
      };

      const res = await fetch(`${apiBase}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create user");
      }

      const createdUser = await res.json();
      push("Manager created successfully!", "success");
      onSuccess(createdUser);
      onClose();
      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        displayName: "",
        companyId: "",
        locationId: "",
        loginEnabled: true,
      });
    } catch (err) {
      push(err instanceof Error ? err.message : "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#111216] border-white/10 p-0 overflow-hidden rounded-[28px] max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <UserSquare2 className="h-5 w-5" />
              </div>
              Quick Create Manager
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Fill in the manager details below to add a new manager.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Company */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                  <select 
                    required
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
                    value={form.companyId}
                    onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  >
                    <option value="" className="bg-[#111216]">Select Company</option>
                    {companies.map(c => <option key={c.id} value={c.id} className="bg-[#111216]">{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <select 
                    required
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#111216] pl-12 pr-10 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all appearance-none"
                    value={form.locationId}
                    onChange={(e) => setForm({ ...form, locationId: e.target.value })}
                  >
                    <option value="" className="bg-[#111216]">Select Location</option>
                    {locations.map(l => <option key={l.id} value={l.id} className="bg-[#111216]">{l.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input 
                    required
                    type="text" 
                    placeholder="John"
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all shadow-inner"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input 
                    required
                    type="text" 
                    placeholder="Doe"
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all shadow-inner"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all shadow-inner"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input 
                    required
                    type="text" 
                    placeholder="johndoe"
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all shadow-inner"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-12 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all shadow-inner"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input 
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full rounded-2xl border ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-rose-500' : 'border-zinc-200 dark:border-white/10'} bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 transition-all shadow-inner`}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                  {form.confirmPassword && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {form.password === form.confirmPassword ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Display Name</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="John Doe (Optional)"
                    className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 pl-12 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all shadow-inner"
                    value={form.displayName}
                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  />
                </div>
              </div>

              {/* Login Enabled */}
              <div className="flex items-center gap-3 pt-2 md:col-span-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={form.loginEnabled}
                    onChange={(e) => setForm({ ...form, loginEnabled: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  <span className="ml-3 text-sm font-medium text-zinc-400">Login Enabled</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-2">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-orange-600 text-sm font-bold text-white shadow-lg hover:bg-orange-500 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Manager
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
