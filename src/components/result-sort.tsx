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
      <SelectTrigger size="sm" className="w-[145px] rounded-pill text-sm font-bold">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="rounded-[24px] p-2">
        <SelectItem 
          value="seeders" 
          className="font-heading font-extrabold data-[state=checked]:bg-brand-surface data-[state=checked]:text-primary"
        >
          Most seeders
        </SelectItem>
        <SelectItem 
          value="recent" 
          className="font-heading font-extrabold data-[state=checked]:bg-brand-surface data-[state=checked]:text-primary"
        >
          Recent
        </SelectItem>
        <SelectItem 
          value="relevance" 
          className="font-heading font-extrabold data-[state=checked]:bg-brand-surface data-[state=checked]:text-primary"
        >
          Relevance
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
