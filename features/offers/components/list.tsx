"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOffersData } from "@/features/offers/api/queries";
import { Header, ListSkeleton } from "@/features/offers/components/skeleton";
import { headers, options } from "@/features/offers/constants";
import type { Offer } from "@/features/offers/types";
import { cn } from "@/lib/utils";

/**
 * Main offers list component with responsive design
 * Displays offers in table format on desktop and card format on mobile
 */
export function OffersList() {
  const { data, isLoading, error } = useOffersData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (isLoading) {
    return <ListSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Erro: {error.message}</div>
      </div>
    );
  }

  if (!data?.offers) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Nenhuma oferta encontrada</div>
      </div>
    );
  }

  const filteredOffers = data.offers.filter((offer) => {
    const matchesSearch =
      offer.offerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.accountLogin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.loyaltyProgram.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || offer.offerStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="container sm:mx-auto">
      <div className="lg:max-w-[1216px] mx-auto lg:px-4">
        <Header />

        <SubHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <div className="space-y-4 px-4 lg:hidden">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.offerId} offer={offer} />
          ))}
        </div>

        <DesktopTableView offers={filteredOffers} />
      </div>
    </main>
  );
}

/**
 * Status badge component with proper styling based on offer status
 * @param status - The offer status to display
 */
export function StatusBadge({ status }: { status: Offer["offerStatus"] }) {
  const statusConfig = {
    Ativa: {
      variant: "default" as const,
      className: "bg-green-100 text-green-800 border-green-200",
      dotClassName: "bg-green-500",
    },
    "Em Utilizacao": {
      variant: "secondary" as const,
      className: "bg-blue-100 text-blue-800 border-blue-200",
      dotClassName: "bg-blue-500",
    },
    Inativo: {
      variant: "outline" as const,
      className: "bg-gray-100 text-gray-600 border-gray-200",
      dotClassName: "bg-gray-500",
    },
  };

  const config = statusConfig[status] || statusConfig.Inativo;

  return (
    <Badge
      variant={config.variant}
      className={cn("rounded-full", config.className)}
    >
      <div className={cn("w-2 h-2 rounded-full", config.dotClassName)} />
      {status}
    </Badge>
  );
}

export function LoyaltyProgramIcon({ program }: { program: string }) {
  const programImages: Record<string, string> = {
    Smiles: "/images/smiles-icon.png",
    TudoAzul: "/images/tudoazul-icon.png",
    Latam: "/images/latam.png",
    AirPortugal: "/images/airportugal.png",
  };

  const imageSrc = programImages[program] || "/images/smiles.png";

  return (
    <div className="flex items-center gap-2 lg:translate-x-4">
      <Image
        src={imageSrc}
        alt={program}
        width={40}
        height={40}
        className="object-cover rounded-full"
      />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-bold text-sm",
            program === "Smiles" ? "text-orange-600" : "text-blue-600",
          )}
        >
          {program}
        </span>
        <span className="text-xs text-gray-600">Comum</span>
      </div>
    </div>
  );
}

/**
 * Mobile offer card component
 * @param offer - The offer data to display
 */
function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card className="w-full rounded-4xl">
      <CardHeader className="!pb-2 border-b">
        <div className="flex items-center justify-between">
          <LoyaltyProgramIcon program={offer.loyaltyProgram} />
          <div className="flex items-end flex-col gap-2">
            <StatusBadge status={offer.offerStatus} />
            <span className="text-xs text-gray-600">
              {format(new Date(offer.createdAt), "d MMM yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-700">ID da oferta</span>
          <span className="text-xs text-gray-600">{offer.offerId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-700">Login</span>
          <span className="text-xs text-gray-600 truncate max-w-[200px]">
            {offer.accountLogin}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-700">
            Milhas ofertadas
          </span>
          <span className="text-xs text-gray-600">
            {offer.availableQuantity.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Desktop table view component
 * @param offers - Array of offers to display
 */
function DesktopTableView({ offers }: { offers: Offer[] }) {
  return (
    <div className="hidden lg:block w-full border-x border-b rounded-b-lg">
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
          {offers.map((offer) => (
            <TableRow key={offer.offerId} className="border-none">
              <TableCell className="flex justify-start py-4">
                <LoyaltyProgramIcon program={offer.loyaltyProgram} />
              </TableCell>
              <TableCell className="text-center py-4">
                <StatusBadge status={offer.offerStatus} />
              </TableCell>
              <TableCell className="text-center text-sm text-gray-600 py-4">
                {offer.offerId}
              </TableCell>
              <TableCell className="text-center text-sm text-gray-600 py-4">
                {offer.accountLogin}
              </TableCell>
              <TableCell className="text-center text-sm text-gray-600 py-4">
                {offer.availableQuantity.toLocaleString()}
              </TableCell>
              <TableCell className="text-center text-sm text-gray-600 py-4">
                {new Date(offer.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * Subheader component with search and status filter
 * @param searchTerm - The search term
 * @param setSearchTerm - The function to set the search term
 * @param statusFilter - The status filter
 * @param setStatusFilter - The function to set the status filter
 */
function SubHeader({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto] gap-4 items-start sm:items-center lg:border rounded-t-2xl p-0 lg:p-2 px-4 pb-4 lg:min-h-20 mt-5 sm:mt-0">
      <p className="text-lg text-gray-600 hidden lg:block pl-4">
        Todas ofertas
      </p>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary size-5" />
        <Input
          type="text"
          placeholder="Login de acesso, ID da oferta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-4 py-2 border h-8 lg:h-10 rounded-full lg:min-w-[352px]"
        />
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger
          className="w-full !h-8 lg:!h-10 rounded-full max-w-[96px] lg:max-w-[120px] lg:min-w-[201px]"
          icon={<ChevronDown className="size-5 text-primary" />}
        >
          <SelectValue placeholder="Filtros" />
        </SelectTrigger>
        <SelectContent>
          {options.status.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
