
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin, Share2, X, ExternalLink } from "lucide-react";
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
    { name: "WhatsApp", icon: "whatsapp", url: `https://wa.me/?text=${encodeURIComponent('Mira este restaurante: ' + window.location.href)}` },
    { name: "Facebook", icon: "facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
    { name: "Twitter", icon: "twitter", url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Mira este restaurante')}` },
    { name: "Email", icon: "mail", url: `mailto:?subject=${encodeURIComponent('Restaurante recomendado')}&body=${encodeURIComponent('Mira este restaurante: ' + window.location.href)}` },
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
    <div className="restaurant-banner relative mb-16">
      {/* Banner Image - Altura aumentada para móviles */}
      <div className={`${isMobile ? 'h-60 md:h-72' : 'h-48 md:h-64'} w-full overflow-hidden rounded-lg`}>
        <img
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
          alt="Restaurant Banner"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => setShowHours(true)}
            aria-label="Ver horarios"
          >
            <Clock className="h-5 w-5 text-gray-700" />
          </button>
          <button 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => setShowLocation(true)}
            aria-label="Ver ubicación"
          >
            <MapPin className="h-5 w-5 text-gray-700" />
          </button>
          <button 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={() => setShowShare(true)}
            aria-label="Compartir"
          >
            <Share2 className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Profile avatar - positioned to overlap the banner and content */}
    <div className="relative">
  <div className="max-w-4xl mx-auto flex justify-center -mt-12">
    <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-green-500">
      <AvatarImage src="/lovable-uploads/..." />
      <AvatarFallback className="text-4xl text-white">M</AvatarFallback>
    </Avatar>
  </div>
</div>


      
      {/* Business Hours Dialog */}
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
      
      {/* Location Dialog */}
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
      
      {/* Share Dialog */}
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
