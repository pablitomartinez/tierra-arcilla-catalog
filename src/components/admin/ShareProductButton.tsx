import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleShareProduct, formatProductShareText } from "@/utils/shareProduct";
import { Product } from "@/types/product";
import { toast } from "sonner";

interface ShareButtonProps {
  product: Product;
}

export const ShareProductButton = ({ product }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  // Adaptamos tu producto al formato que espera nuestra utilidad
  const shareData = {
    id: product.id,
    title: product.title,
    description: product.description || "",
    price: product.price,
    imageUrl: product.image
  };

  const copyToClipboard = () => {
    const text = formatProductShareText(shareData);
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("¡Texto copiado listo para pegar en tu Estado o Instagram!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" title="Compartir">
          <Share2 className="h-4 w-4 text-emerald-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleShareProduct(shareData)} className="cursor-pointer">
          <Share2 className="mr-2 h-4 w-4 text-emerald-600" />
          <span>Compartir en WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          {copied ? <Check className="mr-2 h-4 w-4 text-emerald-500" /> : <Copy className="mr-2 h-4 w-4" />}
          <span>Copiar info completa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};