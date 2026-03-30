import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export function AuthBrand() {
  return (
    <div className="flex justify-center mb-8">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-linear-to-tr from-purple-600 to-blue-500 p-2 rounded-xl group-hover:scale-105 transition-transform">
          <Briefcase size={24} className="text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-black dark:text-white">
          BuildForJob
        </span>
      </Link>
    </div>
  );
}
