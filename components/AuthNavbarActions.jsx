"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export function AuthNavbarActions() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/home");
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard"
          className="border border-zinc-700 px-4 py-2 text-sm font-bold text-white hover:border-white transition-colors">
          Dashboard
        </Link>
        <button onClick={handleLogout}
          className="border border-white bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login"
        className="border border-zinc-700 px-4 py-2 text-sm font-bold text-white hover:border-white transition-colors">
        Log In
      </Link>
      <Link href="/register"
        className="border border-white bg-white px-4 py-2 text-sm font-bold text-black hover:bg-zinc-200 transition-colors">
        Sign Up
      </Link>
    </div>
  );
}