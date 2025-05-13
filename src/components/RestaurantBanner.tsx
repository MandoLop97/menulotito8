import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Share2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const RestaurantBanner = () => {
  const [showHours, setShowHours] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const isMobile = useIsMobile();

  const businessHours = [
    { day: "Lunes", hours: "Abierto todo el día" },
    { day: "Martes", hours: "Abierto todo el día" },
    { day: "Miércoles", hours: "Abierto todo el día" },
    { day: "Jueves", hours: "Abierto todo el día" },
    { day: "Viernes", hours: "Abierto todo el día" },
    { day: "Sábado", hours: "Abierto todo el día" },
    { day: "Domingo", hours: "Abierto todo el día" },
  ];

  const location = {
    address: "Calle 44 #398, Los Pinos, Mérida, Yucatán (Frente a la escuela secundaria ESFER)",
    mapUrl: "https://maps.google.com/?q=Mérida,+Yucatán"
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodeURIComponent('Mira este restaurante: ' + window.location.href)}`
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Mira este restaurante')}`
    },
    {
      name: "Email",
      url: `mailto:?subject=${encodeURIComponent('Restaurante recomendado')}&body=${encodeURIComponent('Mira este restaurante: ' + window.location.href)}`
    }
  ];

  const handleShare = (option: { name: string, url: string }) => {
    window.open(option.url, '_blank');
    setShowShare(false);
    toast.success(`Compartido en ${option.name}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Enlace copiado al portapapeles");
    setShowShare(false);
  };

  return (
    <div className="restaurant-banner relative mb-4">
      {/* Banner ajustado */}
      <div className="w-full md:max-w-4xl md:mx-auto overflow-hidden relative h-72 md:h-[22rem] md:rounded-b-2xl">
        <img
          src="https://lotito.b-cdn.net/Lotito/ChatGPT+Image+12+may+2025%2C+22_22_02.png"
          alt="Restaurant Banner"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Gradiente 55% abajo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none z-10" />

        {/* Botones */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition"
            onClick={() => setShowHours(true)}
            aria-label="Ver horarios"
          >
            <Clock className="h-5 w-5 text-gray-700" />
          </button>
          <button
            className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition"
            onClick={() => setShowLocation(true)}
            aria-label="Ver ubicación"
          >
            <MapPin className="h-5 w-5 text-gray-700" />
          </button>
          <button
            className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition"
            onClick={() => setShowShare(true)}
            aria-label="Compartir"
          >
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Avatar */}
      <div className="relative">
        <div className="max-w-4xl mx-auto flex justify-center -mt-14 relative z-30">
          <Avatar className="h-28 w-28 border-4 border-white shadow-md bg-white">
            <AvatarImage src="https://lotito.b-cdn.net/Lotito/99af0886-226f-4ce1-807e-c70035257bd2.png" />
            <AvatarFallback className="text-4xl text-gray-800">M</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Diálogos reutilizados */}
      <Dialog open={showHours} onOpenChange={setShowHours}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">Horario</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {businessHours.map((item) => (
              <div key={item.day} className="flex justify-between py-2 border-b last:border-b-0">
                <div className="font-medium">{item.day}</div>
                <div className="text-gray-600">{item.hours}</div>
              </div>
            ))}
          </div>
          <Button onClick={() => setShowHours(false)} className="w-full mt-4">
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showLocation} onOpenChange={setShowLocation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">Ubicación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-6">{location.address}</p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => window.open(location.mapUrl, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver la ubicación en el mapa
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowLocation(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">Compartir</DialogTitle>
            <DialogDescription className="text-center">
              Comparte este menú en tus redes sociales
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {shareOptions.map((option) => (
              <Button
                key={option.name}
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleShare(option)}
              >
                {option.name}
              </Button>
            ))}
          </div>
          <Button
            variant="secondary"
            className="w-full mt-2"
            onClick={handleCopyLink}
          >
            Copiar enlace
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantBanner;
