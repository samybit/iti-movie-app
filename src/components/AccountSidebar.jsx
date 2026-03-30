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
import { useLanguage } from "@/contexts/LanguageContext";

export default function AccountSidebar({ isOpen, onClose, user, onLogout }) {

  const [userName, setUserName] = useState(null);
  const [visitedHistory, setVisitedHistory] = useState([]);
  const { t } = useLanguage();

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

      <SheetContent side="right" className="w-[340px] p-0 flex flex-col bg-background border-border transition-colors duration-300">

        {/* Header gradient */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-8 pb-10">

          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-white/80 text-sm font-medium tracking-wide uppercase">
              {t('myAccount')}
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
              <Link
                to="/profile"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest border border-white/20 transition-all"
              >
                {t('viewProfile')} <ChevronRight size={10} />
              </Link>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-6 space-y-4 -mt-4 flex flex-col min-h-0 overflow-hidden">
          <div className="bg-card rounded-2xl border border-border shadow-sm divide-y divide-border overflow-hidden shrink-0">

            {/* Email */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">{t('email')}</p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.email || "—"}
                </p>
              </div>
            </div>

            {/* Verified */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className={`
                w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                ${user?.emailVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}
              `}>
                {user?.emailVerified
                  ? <ShieldCheck size={14} />
                  : <ShieldX size={14} />
                }
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{t('emailVerified')}</p>
                <p className={`text-sm font-semibold ${user?.emailVerified ? "text-emerald-500" : "text-destructive"}`}>
                  {user?.emailVerified ? t('verified') : t('notVerified')}
                </p>
              </div>
            </div>

          </div>

          {/* 🕒 Visited History Section */}
          <div className="flex flex-col flex-1 min-h-0 bg-muted/30 rounded-3xl p-4 overflow-hidden border border-border -mx-1">
            <div className="flex items-center justify-between mb-4 px-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                  <History size={14} />
                </div>
                <h3 className="text-[11px] font-black tracking-widest text-foreground uppercase italic">{t('yourActivity')}</h3>
              </div>
              {visitedHistory.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="p-1 px-2 rounded-lg text-[10px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={12} className="inline mr-1" /> {t('clear')}
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
                    className="flex items-center gap-3 p-2 rounded-2xl bg-background border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-sm font-black text-foreground line-clamp-1 group-hover:text-primary transition-colors tracking-tight leading-tight">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded-md bg-muted text-[9px] font-black text-muted-foreground uppercase tracking-widest border border-border">
                          {item.mediaType}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium italic">
                          {item.vote_average?.toFixed(1)} ★
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground mr-1 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-center space-y-3 opacity-60">
                   <div className="p-4 rounded-full bg-muted text-muted-foreground">
                     <Clock size={24} />
                   </div>
                   <p className="text-xs text-muted-foreground font-medium max-w-[140px] leading-relaxed tracking-tight">{t('noMoviesViewed')}</p>
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
              text-destructive font-semibold text-sm
              border border-destructive/20 bg-destructive/10
              hover:bg-destructive hover:hover:text-white hover:border-destructive
              transition-all duration-200
            "
          >
            <LogOut size={15} className="mr-2" />
            {t('signOut')}
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}
