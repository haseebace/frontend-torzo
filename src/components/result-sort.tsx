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
      <SelectTrigger
        aria-label="Sort results"
        className="h-12 w-[180px] rounded-[10px] border-selection-border bg-selection-field px-3.5 text-sm font-medium text-selection-content hover:border-selection-border hover:bg-selection-field data-[state=open]:h-10 data-[state=open]:rounded-[7px] data-[state=open]:border-transparent data-[state=open]:bg-selection-option data-[state=open]:px-2.5 data-[state=open]:font-semibold"
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="rounded-[10px] border-selection-border bg-selection-field p-1.5">
        <SelectItem
          value="relevance"
          className="mb-0.5 min-h-[38px] rounded-[7px] px-2.5 py-0 font-sans text-[13px] font-normal text-selection-content data-[state=checked]:bg-selection-option data-[state=checked]:font-semibold data-[highlighted]:bg-selection-option"
        >
          Most relevant
        </SelectItem>
        <SelectItem
          value="recent"
          className="mb-0.5 min-h-[38px] rounded-[7px] px-2.5 py-0 font-sans text-[13px] font-normal text-selection-content data-[state=checked]:bg-selection-option data-[state=checked]:font-semibold data-[highlighted]:bg-selection-option"
        >
          Recently added
        </SelectItem>
        <SelectItem
          value="size"
          className="mb-0.5 min-h-[38px] rounded-[7px] px-2.5 py-0 font-sans text-[13px] font-normal text-selection-content data-[state=checked]:bg-selection-option data-[state=checked]:font-semibold data-[highlighted]:bg-selection-option"
        >
          Largest size
        </SelectItem>
        <SelectItem
          value="seeders"
          className="min-h-[38px] rounded-[7px] px-2.5 py-0 font-sans text-[13px] font-normal text-selection-content data-[state=checked]:bg-selection-option data-[state=checked]:font-semibold data-[highlighted]:bg-selection-option"
        >
          Most seeders
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
