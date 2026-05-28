"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ResultSort({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`/results?${params.toString()}`);
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={handleSortChange}>
      <SelectTrigger size="sm" className="w-[145px] rounded-xl text-sm font-medium active:scale-[0.96]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="rounded-xl p-2">
        <SelectItem 
          value="seeders" 
          className="font-sans font-medium rounded-full data-[state=checked]:bg-brand-surface data-[state=checked]:text-primary mb-1"
        >
          Most seeders
        </SelectItem>
        <SelectItem 
          value="recent" 
          className="font-sans font-medium rounded-full data-[state=checked]:bg-brand-surface data-[state=checked]:text-primary mb-1"
        >
          Recent
        </SelectItem>
        <SelectItem 
          value="relevance" 
          className="font-sans font-medium rounded-full data-[state=checked]:bg-brand-surface data-[state=checked]:text-primary"
        >
          Relevance
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
