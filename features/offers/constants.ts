export const headers = {
  program: "Programa",
  status: "Status",
  offerId: "ID da oferta",
  login: "Login",
  availableQuantity: "Milhas ofertadas",
  data: "Data",
};

export const options = {
  status: [
    { label: "Todos", value: "all" },
    { label: "Ativa", value: "Ativa" },
    { label: "Em Utilização", value: "Em Utilizacao" },
    { label: "Inativo", value: "Inativo" },
  ],
};

export const statusConfig = {
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

export const programImages: Record<string, string> = {
  Smiles: "/images/smiles-icon.png",
  TudoAzul: "/images/tudoazul-icon.png",
  Latam: "/images/latam.png",
  AirPortugal: "/images/airportugal.png",
};
