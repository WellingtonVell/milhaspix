"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { headers } from "@/features/offers/constants";
import { cn } from "@/lib/utils";

export function ListSkeleton() {
  return (
    <main className="container sm:mx-auto">
      <div className="lg:max-w-[1216px] mx-auto">
        <Header />

        {/* Mobile search and filter controls skeleton */}
        <div className="grid grid-cols-[1fr_auto] gap-4 items-start sm:items-center px-4 pb-4 mt-5 sm:mt-0 lg:hidden">
          <div className="relative">
            <Skeleton className="w-full h-8 rounded-full" />
          </div>
          <Skeleton className="w-full max-w-[96px] h-8 rounded-full" />
        </div>

        <div className="space-y-4 px-4 lg:hidden">
          {Array.from(
            { length: 3 },
            (_, index) => `skeleton-card-${index}`,
          ).map((key) => (
            <OfferCardSkeleton key={key} />
          ))}
        </div>

        <DesktopTableSkeleton />
      </div>
    </main>
  );
}

export function Header() {
  return (
    <div className="flex flex-row sm:flex-row items-center justify-between gap-4 border-b px-4 py-6 sm:border-b-0 lg:px-0">
      <h1 className="text-xl font-medium text-gray-700">Minhas ofertas</h1>
      <Button className="h-10 min-w-[146px] rounded-full" asChild>
        <Link href="/announcement">
          <Plus className="w-4 h-4 mr-2" />
          Nova oferta
        </Link>
      </Button>
    </div>
  );
}

function OfferCardSkeleton() {
  return (
    <Card className="w-full rounded-4xl">
      <CardHeader className="!pb-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 translate-x-4">
            {/* LoyaltyProgramIcon skeleton - 40x40px image */}
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col">
              {/* Program name - text-sm font-bold */}
              <Skeleton className="w-16 h-[14px] mb-0" />
              {/* "Comum" text - text-xs */}
              <Skeleton className="w-12 h-3 mt-0" />
            </div>
          </div>
          <div className="flex items-end flex-col gap-2">
            {/* StatusBadge skeleton - rounded-full with dot */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="w-16 h-4" />
            </div>
            {/* Date text - text-xs */}
            <Skeleton className="w-16 h-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-24 h-3" />
        </div>
        <div className="flex justify-between items-center">
          {/* "Login" label - text-xs font-bold */}
          <Skeleton className="w-8 h-3" />
          {/* Account login value - text-xs with max-w-[200px] truncate */}
          <Skeleton className="w-32 h-3 max-w-[200px]" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-20 h-3" />
        </div>
      </CardContent>
    </Card>
  );
}

function DesktopTableSkeleton() {
  return (
    <div className="hidden lg:block w-full">
      {/* SubHeader skeleton - search and filter controls */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center lg:border rounded-t-2xl p-2 lg:min-h-20">
        {/* "Todas ofertas" text */}
        <Skeleton className="w-32 h-5 ml-4" />

        {/* Search input skeleton */}
        <div className="relative">
          <Skeleton className="w-[352px] h-10 rounded-full" />
        </div>

        {/* Filter select skeleton */}
        <Skeleton className="w-[201px] h-10 rounded-full" />
      </div>

      {/* Table skeleton */}
      <div className="w-full border-x border-b rounded-b-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.values(headers).map((header) => (
                <TableHead
                  key={header}
                  className={cn(
                    "rounded-t-none text-center font-bold text-gray-700",
                  )}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(
              { length: 5 },
              (_, index) => `skeleton-row-${index}`,
            ).map((key) => (
              <TableRow key={key} className="border-none">
                <TableCell className="flex justify-start py-4">
                  <div className="flex items-center gap-2 translate-x-4">
                    {/* LoyaltyProgramIcon skeleton - 40x40px image */}
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col">
                      {/* Program name - text-sm font-bold */}
                      <Skeleton className="w-16 h-[14px] mb-0" />
                      {/* "Comum" text - text-xs */}
                      <Skeleton className="w-12 h-3 mt-0" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center py-4">
                  {/* StatusBadge skeleton - rounded-full with dot */}
                  <div className="flex items-center justify-center gap-1 px-2 py-1 rounded-full mx-auto w-fit">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600 py-4">
                  {/* Offer ID - text-sm */}
                  <Skeleton className="w-24 h-[14px] mx-auto" />
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600 py-4">
                  {/* Account login - text-sm */}
                  <Skeleton className="w-32 h-[14px] mx-auto" />
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600 py-4">
                  {/* Available quantity - text-sm */}
                  <Skeleton className="w-20 h-[14px] mx-auto" />
                </TableCell>
                <TableCell className="text-center text-sm text-gray-600 py-4">
                  {/* Date - text-sm */}
                  <Skeleton className="w-24 h-[14px] mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
