import { MessageCircle } from "lucide-react";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  productName: string;
  className?: string;
}

export function WhatsAppButton({ productName, className = "" }: WhatsAppButtonProps) {
  const message = encodeURIComponent(brand.whatsapp.defaultMessage(productName));
  const url = `https://wa.me/${brand.whatsapp.number}?text=${message}`;

  return (
    <Button
      asChild
      size="lg"
      className={`bg-accent hover:bg-accent/90 text-accent-foreground gap-2 font-body font-semibold ${className}`}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-5 w-5" />
        Consultar por WhatsApp
      </a>
    </Button>
  );
}
