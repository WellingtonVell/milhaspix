"use client";

import { ChevronDown, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  headers,
  programImages,
  statusConfig,
} from "@/features/offers/constants";
import type { Offer } from "@/features/offers/types";
import { cn } from "@/lib/utils";

export function ListSkeleton() {
  return (
    <main className="container sm:mx-auto">
      <div className="lg:max-w-[1216px] mx-auto lg:px-4">
        <Header />

        <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center lg:border rounded-t-2xl p-2 lg:min-h-20 lg:hidden">
          <p className="text-lg text-gray-600 hidden lg:block pl-4">
            Todas ofertas
          </p>

          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary size-5" />
            <Input
              type="text"
              placeholder="Login de acesso, ID da oferta..."
              className="w-full pr-4 py-2 border h-8 lg:h-10 rounded-full lg:min-w-[352px]"
              disabled
            />
          </div>

          <Select>
            <SelectTrigger
              className="w-full !h-8 lg:!h-10 rounded-full max-w-[96px] lg:max-w-[120px] lg:min-w-[201px]"
              icon={<ChevronDown className="size-5 text-primary" />}
              disabled
            >
              <SelectValue placeholder="Filtros" />
            </SelectTrigger>
          </Select>
        </div>

        <div className="space-y-4 px-4 lg:hidden">
          <OfferCardSkeleton />
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
  // Sample data for skeleton - matches desktop pattern
  const sampleData = Array.from({ length: 3 }, (_, index) => ({
    key: `skeleton-card-${index}`,
    program: ["Smiles", "TudoAzul", "Latam"][index % 3],
    status: ["Ativa", "Em Utilizacao", "Inativo"][
      index
    ] as Offer["offerStatus"],
  }));

  return (
    <>
      {sampleData.map(({ key, program, status }) => (
        <Card key={key} className="w-full rounded-4xl">
          <CardHeader className="!pb-2 border-b">
            <div className="flex items-center justify-between">
              <LoyaltyProgramIconSkeleton program={program} />
              <div className="flex items-end flex-col gap-2">
                <StatusBadgeSkeleton status={status} />
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
              <Skeleton className="w-8 h-3" />
              <Skeleton className="w-32 h-3 max-w-[200px]" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="w-24 h-3" />
              <Skeleton className="w-20 h-3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

function StatusBadgeSkeleton({ status }: { status: Offer["offerStatus"] }) {
  const config = statusConfig[status] || statusConfig.Inativo;

  return (
    <Badge
      variant={config.variant}
      className={cn("rounded-full blur-sm opacity-70", config.className)}
    >
      <div className={cn("w-2 h-2 rounded-full", config.dotClassName)} />
      {status}
    </Badge>
  );
}

function LoyaltyProgramIconSkeleton({ program }: { program: string }) {
  const imageSrc = programImages[program] || "/images/smiles.png";

  return (
    <div className="flex items-center gap-2 lg:translate-x-4">
      <Image
        src={imageSrc}
        alt={program}
        width={40}
        height={40}
        className="object-cover rounded-full blur-sm opacity-70"
      />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-bold text-sm blur-sm opacity-70",
            program === "Smiles" ? "text-orange-600" : "text-blue-600",
          )}
        >
          {program}
        </span>
        <span className="text-xs text-gray-600 blur-sm opacity-70">Comum</span>
      </div>
    </div>
  );
}

function DesktopTableSkeleton() {
  return (
    <div className="hidden lg:block w-full">
      {/* SubHeader skeleton - search and filter controls */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center lg:border rounded-t-2xl p-2 lg:min-h-20">
        <p className="text-lg text-gray-600 hidden lg:block pl-4">
          Todas ofertas
        </p>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary size-5" />
          <Input
            type="text"
            placeholder="Login de acesso, ID da oferta..."
            className="w-full pr-4 py-2 border h-8 lg:h-10 rounded-full lg:min-w-[352px]"
            disabled
          />
        </div>

        <Select>
          <SelectTrigger
            className="w-full !h-8 lg:!h-10 rounded-full max-w-[96px] lg:max-w-[120px] lg:min-w-[201px]"
            icon={<ChevronDown className="size-5 text-primary" />}
            disabled
          >
            <SelectValue placeholder="Filtros" />
          </SelectTrigger>
        </Select>
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
            {Array.from({ length: 3 }, (_, index) => ({
              key: `skeleton-row-${index}`,
              program: ["Smiles", "TudoAzul", "Latam", "AirPortugal", "Smiles"][
                index % 3
              ],
              status: ["Ativa", "Em Utilizacao", "Inativo", "Ativa", "Inativo"][
                index
              ] as Offer["offerStatus"],
            })).map(({ key, program, status }) => (
              <TableRow key={key} className="border-none">
                <TableCell className="flex justify-start py-4">
                  <LoyaltyProgramIconSkeleton program={program} />
                </TableCell>
                <TableCell className="text-center py-4">
                  <StatusBadgeSkeleton status={status} />
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
