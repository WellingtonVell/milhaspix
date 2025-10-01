import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <div className="bg-primary px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center w-full">
      <Link href="/">
        <Image
          src="/images/milhaspix-logo.png"
          alt="MilhasPix"
          className="w-24 h-6 sm:w-28 sm:h-7 lg:w-32 lg:h-8 object-contain"
          width={120}
          height={32}
        />
      </Link>

      <Button
        variant="outline"
        className="bg-transparent border-accent hover:bg-accent font-medium text-xs sm:text-sm rounded-full px-3 py-1.5 sm:px-4 text-neutral-400"
      >
        R$ 283,12
      </Button>
    </div>
  );
}
