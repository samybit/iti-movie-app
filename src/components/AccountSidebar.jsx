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

export default function AccountSidebar({ isOpen, onClose, user, onLogout }) {

  const [userName, setUserName] = useState(null);

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

      <SheetContent side="right" className="w-[340px] p-0 flex flex-col">

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
        <div className="flex-1 px-6 py-6 space-y-3 -mt-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">

            {/* Email */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 font-medium">Email</p>
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {user?.email || "—"}
                </p>
              </div>
            </div>

            {/* Verified */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className={`
                w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                ${user?.emailVerified ? "bg-emerald-50" : "bg-red-50"}
              `}>
                {user?.emailVerified
                  ? <ShieldCheck size={14} className="text-emerald-500" />
                  : <ShieldX size={14} className="text-red-400" />
                }
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Email Verified</p>
                <p className={`text-sm font-semibold ${user?.emailVerified ? "text-emerald-600" : "text-red-500"}`}>
                  {user?.emailVerified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-8">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="
              w-full h-11 rounded-xl
              text-red-500 font-semibold text-sm
              border border-red-100 bg-red-50
              hover:bg-red-500 hover:text-white hover:border-red-500
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