"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SupplyDateFilter({ initialDate }: { initialDate: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState(initialDate);

  useEffect(() => {
    const queryDate = searchParams.get('date');
    if (queryDate && queryDate !== date) {
      setDate(queryDate);
    }
  }, [searchParams]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", newDate);
    router.push(`/supply?` + params.toString());
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-2 py-1.5 shadow-sm">
      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <input 
        type="date" 
        value={date} 
        onChange={handleDateChange}
        className="text-sm border-none bg-transparent focus:ring-0 text-slate-900 font-semibold cursor-pointer outline-none"
      />
    </div>
  );
}
