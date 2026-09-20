"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import Image from "next/image";

type Species = Database["public"]["Tables"]["species"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function SpeciesDetailDialog({
  species,
  author,
}: {
  species: Species;
  author: Profile | null;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          <DialogDescription>{species.common_name}</DialogDescription>
        </DialogHeader>

        {species.image && (
          <div className="relative h-56 w-full">
            <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
          </div>
        )}

        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Kingdom: </span>
            {species.kingdom}
          </p>
          <p>
            <span className="font-semibold">Total population: </span>
            {species.total_population ?? "Unknown"}
          </p>
          <p>{species.description}</p>
        </div>

        {author && (
          <div className="mt-4 border-t pt-3 text-sm text-muted-foreground">
            Added by {author.display_name} ({author.email})
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}