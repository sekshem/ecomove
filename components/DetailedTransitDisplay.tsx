'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button" // Import Button
import { Clock, MapPin, DollarSign, Leaf, Footprints, Bus, Train, TramFront, CheckCircle } from 'lucide-react'

// --- Interfaces (Should match those defined/used in the page component) ---
type TransportType = 'Bus' | 'Train' | 'Rapido Bike' | 'Rapido Auto' | 'Cab'; // Include all relevant types

interface ProcessedTransitStep {
  travelMode: 'WALKING' | 'TRANSIT';
  instructions: string;
  duration: string;
  distance: string;
  transitDetails?: {
    lineName: string;
    lineShortName?: string;
    lineColor?: string;
    vehicleType: string;
    vehicleIcon?: string;
    numStops?: number;
    departureStop: string;
    arrivalStop: string;
    departureTime: string;
    arrivalTime: string;
  };
}

interface ProcessedTransitRoute {
  id: string;
  totalDuration: string;
  totalDistance: string;
  departureTime: string;
  arrivalTime: string;
  steps: ProcessedTransitStep[];
}
// --- End Interfaces ---

interface DetailedTransitDisplayProps {
  route: ProcessedTransitRoute;
  mode: Extract<TransportType, 'Bus' | 'Train'>; // Expect only Bus or Train
}

// --- Icon Helper --- //
const getVehicleIcon = (vehicleType: string): React.ReactNode => {
  switch (vehicleType) {
    case 'BUS':
      return <Bus className="h-5 w-5 mr-2 text-blue-700" />;
    case 'SUBWAY':
    case 'METRO_RAIL':
    case 'TRAIN':
    case 'RAIL':
      return <Train className="h-5 w-5 mr-2 text-red-700" />;
    case 'TRAM':
      return <TramFront className="h-5 w-5 mr-2 text-purple-700" />;
    default:
      return <CheckCircle className="h-5 w-5 mr-2 text-gray-500" />;
  }
};

// --- Instruction Renderer (Basic Text) --- //
const renderInstructions = (html: string) => {
  if (typeof window === 'undefined') return html;
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

// --- Booking Links --- //
const bookingLinks: { [key in Extract<TransportType, 'Bus' | 'Train'>]: string } = {
  Bus: "https://mtcbus.tn.gov.in/",
  Train: "https://www.utsonmobile.indianrail.gov.in/login;id=65D856E11A9E19BC8495E6414988C6D7?0",
};

export function DetailedTransitDisplay({ route, mode }: DetailedTransitDisplayProps) {
  const bookingLink = bookingLinks[mode];

  return (
    <Card className="shadow-lg border border-gray-300 mt-4 bg-white">
      <CardHeader className="p-4 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between">
           <CardTitle className="text-lg font-semibold text-gray-800">Detailed {mode} Route</CardTitle>
           <div className="text-sm text-gray-600">
              <Clock className="inline h-4 w-4 mr-1" />
              {route.departureTime} - {route.arrivalTime} ({route.totalDuration})
           </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Steps rendering */}
        {route.steps.map((step, index) => (
          <div key={`${route.id}-step-${index}`} className="pb-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-start gap-4">
              {/* Icon Column */}
              <div className="flex-shrink-0 pt-1">
                {step.travelMode === 'WALKING' ? (
                  <Footprints className="h-6 w-6 text-blue-600" />
                ) : (
                  step.transitDetails ? getVehicleIcon(step.transitDetails.vehicleType) : <CheckCircle className="h-6 w-6 text-gray-500" />
                )}
              </div>

              {/* Details Column */}
              <div className="flex-grow">
                <p className="text-base font-medium text-gray-900 mb-1">
                    {renderInstructions(step.instructions)}
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                    {/* Duration/Distance for all steps */} 
                    <p><Clock className="inline h-4 w-4 mr-1.5 text-gray-400"/>{step.duration} ({step.distance})</p>
                    
                    {/* Transit Specific Details */} 
                    {step.transitDetails && (
                      <>
                        <p className="flex items-center">
                            <span
                                className="font-semibold px-1.5 py-0.5 rounded mr-2 text-xs"
                                style={{ backgroundColor: step.transitDetails.lineColor || '#cccccc', color: '#ffffff' }}
                            >
                                {step.transitDetails.lineShortName || step.transitDetails.lineName}
                            </span>
                            <span>{step.transitDetails.numStops} stops</span>
                        </p>
                        <p><MapPin className="inline h-4 w-4 mr-1.5 text-gray-400"/>From: {step.transitDetails.departureStop} ({step.transitDetails.departureTime})</p>
                        <p><MapPin className="inline h-4 w-4 mr-1.5 text-gray-400"/>To: {step.transitDetails.arrivalStop} ({step.transitDetails.arrivalTime})</p>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Booking Button */}
        <div className="pt-4 text-right">
           <Button asChild className="bg-green-600 hover:bg-green-700">
             <a href={bookingLink} target="_blank" rel="noopener noreferrer">
               Book {mode} Tickets
             </a>
           </Button>
        </div>
      </CardContent>
    </Card>
  );
} 