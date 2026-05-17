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
      <SelectTrigger size="sm" className="w-[130px] rounded-pill text-xs">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="seeders">Most seeders</SelectItem>
        <SelectItem value="recent">Recent</SelectItem>
        <SelectItem value="relevance">Relevance</SelectItem>
      </SelectContent>
    </Select>
  );
}
