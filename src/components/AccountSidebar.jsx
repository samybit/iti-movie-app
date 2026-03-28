import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { User, Mail, ShieldCheck, ShieldX, LogOut } from "lucide-react";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { History, Trash2, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router";

export default function AccountSidebar({ isOpen, onClose, user, onLogout }) {

  const [userName, setUserName] = useState(null);
  const [visitedHistory, setVisitedHistory] = useState([]);

  // Load History from localStorage
  useEffect(() => {
    if (isOpen) {
      const history = JSON.parse(localStorage.getItem('visitedHistory') || '[]');
      setVisitedHistory(history);
    }
  }, [isOpen]);

  const clearHistory = () => {
    localStorage.removeItem('visitedHistory');
    setVisitedHistory([]);
  };

  //fetch name from Firestore
  useEffect(() => {
    const fetchName = async () => {
      if (!user?.uid) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setUserName(snap.data()?.name);
    };
    fetchName();
  }, [user]);

  const displayName = userName || user?.displayName || user?.email?.split("@")[0] || "—";

  const initials = displayName !== "—"
    ? displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>

      <SheetContent side="right" className="w-[340px] p-0 flex flex-col dark:bg-slate-950 dark:border-slate-800 transition-colors duration-300">

        {/* Header gradient */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-8 pb-10">

          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-white/80 text-sm font-medium tracking-wide uppercase">
              My Account
            </SheetTitle>
          </SheetHeader>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="
              w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm
              text-white text-2xl font-bold flex items-center justify-center
              ring-2 ring-white/30 shadow-lg
            ">
              {initials || <User size={24} />}
            </div>
            <div>
              <p className="text-white text-lg font-semibold leading-tight">
                {displayName}
              </p>
              <p className="text-white/60 text-sm mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-6 space-y-4 -mt-4 flex flex-col min-h-0 overflow-hidden">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shrink-0">

            {/* Email */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-blue-500 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Email</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {user?.email || "—"}
                </p>
              </div>
            </div>

            {/* Verified */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className={`
                w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                ${user?.emailVerified ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-red-50 dark:bg-red-500/10"}
              `}>
                {user?.emailVerified
                  ? <ShieldCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
                  : <ShieldX size={14} className="text-red-400 dark:text-red-500" />
                }
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Email Verified</p>
                <p className={`text-sm font-semibold ${user?.emailVerified ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                  {user?.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>

          </div>

          {/* 🕒 Visited History Section */}
          <div className="flex flex-col flex-1 min-h-0 bg-slate-50/50 dark:bg-slate-900/40 rounded-3xl p-4 overflow-hidden border border-slate-100 dark:border-slate-800 -mx-1">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100/50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <History size={14} />
                </div>
                <h3 className="text-[11px] font-black tracking-widest text-slate-800 dark:text-slate-200 uppercase italic">Your Activity</h3>
              </div>
              {visitedHistory.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="p-1 px-2 rounded-lg text-[10px] text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} className="inline mr-1" /> Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2.5 custom-scrollbar transition-all">
              {visitedHistory.length > 0 ? (
                visitedHistory.map(item => (
                  <Link 
                    key={item.id}
                    to={`/${item.mediaType}/${item.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-all group"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-sm font-black text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight leading-tight">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border dark:border-slate-700">
                          {item.mediaType}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">
                          {item.vote_average?.toFixed(1)} ★
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 mr-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 opacity-60">
                   <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600">
                     <Clock size={24} />
                   </div>
                   <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-[140px] leading-relaxed tracking-tight">You haven't viewed any movies yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-8 shrink-0">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="
              w-full h-11 rounded-xl
              text-red-500 font-semibold text-sm
              border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10
              hover:bg-red-500 dark:hover:bg-red-500 hover:text-white hover:border-red-500
              transition-all duration-200
            "
          >
            <LogOut size={15} className="mr-2" />
            Sign Out
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}