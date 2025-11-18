import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const phoneNumber = "5571992056669"; // Formato internacional
  const message = "Olá! Gostaria de saber mais sobre os produtos Vem Colando.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <Button
        size="lg"
        className="h-16 w-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-2xl transition-all hover:scale-110 group-hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]"
      >
        <MessageCircle className="h-8 w-8 text-white" />
      </Button>
      <span className="absolute -top-2 -left-2 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366]"></span>
      </span>
    </a>
  );
};

export default WhatsAppButton;
