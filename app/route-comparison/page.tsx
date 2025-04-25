"use client"

import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { Search } from "lucide-react"
import { RouteOption } from "@/components/route-option"
import { useState, useEffect, useRef, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { DetailedTransitDisplay } from "@/components/DetailedTransitDisplay"

// Define types for Place results
interface PlaceDetails {
  address: string | undefined;
  latLng: google.maps.LatLng | null | undefined;
}

// --- Interfaces for Processed Transit Data --- //
// Define these interfaces clearly, matching DetailedTransitDisplay expectations
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
// --- End Transit Interfaces --- //

// --- Estimation Logic (Restored Version) --- //

// Define types for transport options and CO2 emission structure
type TransportType = 'Bus' | 'Train' | 'Rapido Bike' | 'Rapido Auto' | 'Cab';
type CO2Category = 'low' | 'medium' | 'high';
interface CO2EmissionResult {
  value: string; // Formatted string (e.g., "1500 g CO₂")
  category: CO2Category;
}

// Placeholder fare estimation function (returns number)
const estimateFare = (type: Extract<TransportType, 'Rapido Bike' | 'Rapido Auto' | 'Cab'>, distanceKm: number): number => {
  let fare = 0;
  const validDistanceKm = Math.max(0, distanceKm);
  switch (type) {
    // Only include estimation cases for non-transit types
    case 'Rapido Bike': fare = 20 + validDistanceKm * 5; break;
    case 'Rapido Auto': fare = 30 + validDistanceKm * 8; break;
    case 'Cab': fare = 50 + validDistanceKm * 12; break;
    default: fare = 0; // Should not happen with Extract
  }
  return Math.round(fare);
};

// Placeholder CO2 estimation function (returns grams)
const estimateCO2 = (type: TransportType, distanceKm: number): CO2EmissionResult => {
  let factor = 0; // g CO₂e/passenger-km
  let category: CO2Category = 'medium';
  const validDistanceKm = Math.max(0, distanceKm);
  switch (type) {
    case 'Bus': factor = 50; category = 'low'; break;
    case 'Train': factor = 30; category = 'low'; break;
    case 'Rapido Bike': factor = 70; category = 'medium'; break;
    case 'Rapido Auto': factor = 80; category = 'medium'; break;
    case 'Cab': factor = 150; category = 'high'; break;
  }
  const co2Grams = Math.round(validDistanceKm * factor);
  return {
    value: `${co2Grams} g CO₂`,
    category: category,
  };
};

// Helper function to format seconds into a readable duration string
function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  if (totalSeconds < 60) return `${Math.round(totalSeconds)} sec`;
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = "";
  if (hours > 0) result += `${hours} hr `;
  if (minutes > 0 || hours === 0) result += `${minutes} min`;
  return result.trim();
}

// Placeholder function to estimate duration based on mode
const estimateDuration = (type: TransportType, baseDurationSeconds: number): string => {
  let multiplier = 1.0;
  let fixedAdditionSeconds = 0;
  switch (type) {
    case 'Bus': multiplier = 1.5; fixedAdditionSeconds = 5 * 60; break;
    case 'Train': multiplier = 1.1; fixedAdditionSeconds = 8 * 60; break;
    case 'Rapido Bike': multiplier = 0.9; fixedAdditionSeconds = 3 * 60; break;
    case 'Rapido Auto': multiplier = 1.1; fixedAdditionSeconds = 4 * 60; break;
    case 'Cab': multiplier = 1.0; fixedAdditionSeconds = 5 * 60; break;
  }
  const estimatedSeconds = baseDurationSeconds * multiplier + fixedAdditionSeconds;
  return formatDuration(estimatedSeconds);
};

// List of available transport types
const transportTypes: TransportType[] = ['Bus', 'Train', 'Rapido Bike', 'Rapido Auto', 'Cab'];

// --- Component --- //
export default function RouteComparisonPage() {
  const [showRouteOptions, setShowRouteOptions] = useState(false)
  const [startPlace, setStartPlace] = useState<PlaceDetails | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<PlaceDetails | null>(null);
  // Restore state for driving route distance/duration
  const [routeDistanceKm, setRouteDistanceKm] = useState<number | null>(null);
  const [baseRouteDurationSeconds, setBaseRouteDurationSeconds] = useState<number | null>(null);
  const [isLoadingDrivingRoute, setIsLoadingDrivingRoute] = useState(false); // Generic loading state
  const [drivingRouteErrorMsg, setDrivingRouteErrorMsg] = useState<string | null>(null); // Generic error state

  // New state for detailed transit view
  const [selectedTransitMode, setSelectedTransitMode] = useState<Extract<TransportType, 'Bus' | 'Train'> | null>(null);
  const [detailedTransitRoute, setDetailedTransitRoute] = useState<ProcessedTransitRoute | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailErrorMsg, setDetailErrorMsg] = useState<string | null>(null);

  // Keep Refs
  const startInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const startAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Keep initializeMapAndServices and its useEffect
  const initializeMapAndServices = useCallback(async () => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      libraries: ["places", "maps", "routes"],
    });
    try {
      const google = await loader.load();
      if (!mapRef.current || !startInputRef.current || !destinationInputRef.current) return;
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, zoom: 12, mapId: "ECOMOVE_MAP_ID",
      });
      directionsServiceRef.current = new google.maps.DirectionsService();
      directionsRendererRef.current = new google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(mapInstanceRef.current);
      const autocompleteOptions = { fields: ["formatted_address", "geometry.location", "name"], strictBounds: false };
      startAutocompleteRef.current = new google.maps.places.Autocomplete(startInputRef.current, autocompleteOptions);
      startAutocompleteRef.current.addListener("place_changed", () => {
        const place = startAutocompleteRef.current?.getPlace();
        setStartPlace({ address: place?.formatted_address, latLng: place?.geometry?.location });
        destinationInputRef.current?.focus();
      });
      destinationAutocompleteRef.current = new google.maps.places.Autocomplete(destinationInputRef.current, autocompleteOptions);
      destinationAutocompleteRef.current.addListener("place_changed", () => {
        const place = destinationAutocompleteRef.current?.getPlace();
        setDestinationPlace({ address: place?.formatted_address, latLng: place?.geometry?.location });
      });
    } catch (error) {
      console.error("Error loading Google Maps API:", error);
      setDrivingRouteErrorMsg("Failed to load Google Maps.");
    }
  }, []);

  useEffect(() => { initializeMapAndServices(); }, [initializeMapAndServices]);


  // --- Effect to Calculate DRIVING Route and trigger estimations ---
  useEffect(() => {
    // Clear previous results and errors
    setRouteDistanceKm(null);
    setBaseRouteDurationSeconds(null);
    setShowRouteOptions(false);
    setDrivingRouteErrorMsg(null);
    setDetailedTransitRoute(null);
    setSelectedTransitMode(null);
    setDetailErrorMsg(null);
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ request: {} as google.maps.DirectionsRequest, geocoded_waypoints: [], routes: [] });
    }

    if (!startPlace?.latLng || !destinationPlace?.latLng || !directionsServiceRef.current || !directionsRendererRef.current) {
      return;
    }

    setIsLoadingDrivingRoute(true);

    const request: google.maps.DirectionsRequest = {
      origin: startPlace.latLng,
      destination: destinationPlace.latLng,
      travelMode: google.maps.TravelMode.DRIVING, // *** USE DRIVING MODE ***
    };

    directionsServiceRef.current.route(request, (result, status) => {
      setIsLoadingDrivingRoute(false);
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRendererRef.current?.setDirections(result); // Display driving route

        // Extract Distance and Duration for estimations
        if (result.routes.length > 0 && result.routes[0].legs.length > 0) {
          const leg = result.routes[0].legs[0];
          if (leg.distance && leg.duration) {
            setRouteDistanceKm(leg.distance.value / 1000);
            setBaseRouteDurationSeconds(leg.duration.value);
            setShowRouteOptions(true);
          } else {
            setDrivingRouteErrorMsg("Could not retrieve distance/duration for estimations.");
            setShowRouteOptions(false);
          }
        } else {
          setDrivingRouteErrorMsg("No driving route found.");
          setShowRouteOptions(false);
        }
      } else {
        console.error(`Driving Directions request failed due to ${status}`);
        setDrivingRouteErrorMsg(`Failed to get driving directions: ${status}`);
        setShowRouteOptions(false);
      }
    });

  }, [startPlace, destinationPlace]);

  // --- Function to Fetch Detailed TRANSIT Route --- //
  const fetchTransitDetails = useCallback(async (mode: Extract<TransportType, 'Bus' | 'Train'>) => {
    if (!startPlace?.latLng || !destinationPlace?.latLng || !directionsServiceRef.current) {
      setDetailErrorMsg("Start/Destination missing for detailed search.");
      return;
    }

    setIsLoadingDetails(true);
    setDetailedTransitRoute(null);
    setDetailErrorMsg(null);
    setSelectedTransitMode(mode);

    let transitModeOption: google.maps.TransitMode | undefined = undefined;
    if (mode === 'Bus') transitModeOption = google.maps.TransitMode.BUS;
    if (mode === 'Train') transitModeOption = google.maps.TransitMode.TRAIN;
    
    if (!transitModeOption) {
         setIsLoadingDetails(false);
         setDetailErrorMsg("Invalid mode selected for transit details.");
         return;
    }

    const request: google.maps.DirectionsRequest = {
      origin: startPlace.latLng,
      destination: destinationPlace.latLng,
      travelMode: google.maps.TravelMode.TRANSIT,
      transitOptions: {
         modes: [transitModeOption],
      },
    };

    directionsServiceRef.current.route(request, (result, status) => {
      setIsLoadingDetails(false);
      if (status === google.maps.DirectionsStatus.OK && result && result.routes.length > 0) {
         const route = result.routes[0];
         const leg = route.legs[0];
         const steps: ProcessedTransitStep[] = leg.steps.map(step => {
            let transitDetails: ProcessedTransitStep['transitDetails'] = undefined;
            if (step.travel_mode === 'TRANSIT' && step.transit) {
              transitDetails = {
                lineName: step.transit.line.name || 'Unknown Line',
                lineShortName: step.transit.line.short_name,
                lineColor: step.transit.line.color,
                vehicleType: step.transit.line.vehicle.type || 'UNKNOWN',
                vehicleIcon: step.transit.line.vehicle.icon,
                numStops: step.transit.num_stops,
                departureStop: step.transit.departure_stop?.name || '-',
                arrivalStop: step.transit.arrival_stop?.name || '-',
                departureTime: step.transit.departure_time?.text || '-',
                arrivalTime: step.transit.arrival_time?.text || '-',
              };
            }
            return {
              travelMode: step.travel_mode as 'WALKING' | 'TRANSIT',
              instructions: step.instructions || '',
              duration: step.duration?.text || '-',
              distance: step.distance?.text || '-',
              transitDetails: transitDetails,
            };
          });
         
          const processedRoute: ProcessedTransitRoute = {
            id: `detail-${mode}-${new Date().getTime()}`,
            totalDuration: leg.duration?.text || '-',
            totalDistance: leg.distance?.text || '-',
            departureTime: leg.departure_time?.text || '-',
            arrivalTime: leg.arrival_time?.text || '-',
            steps: steps,
          };
          setDetailedTransitRoute(processedRoute);
          // Ensure the correct mode is still selected after async operation
          setSelectedTransitMode(mode); 
      } else {
        console.error(`Detailed ${mode} request failed: ${status}`);
        setDetailedTransitRoute(null);
        setDetailErrorMsg(`No specific ${mode} routes found.`);
        // Don't clear selected mode on error, so error message shows under correct section
      }
    });
  }, [startPlace, destinationPlace]);

  // --- Helper to clear detailed view state --- //
  const clearTransitDetails = () => {
      setSelectedTransitMode(null);
      setDetailedTransitRoute(null);
      setIsLoadingDetails(false);
      setDetailErrorMsg(null);
  };

  // --- Click Handler for Bus/Train options with Toggle --- //
  const handleTransitOptionClick = (mode: Extract<TransportType, 'Bus' | 'Train'>) => {
      if (selectedTransitMode === mode) {
          // If clicking the already selected mode, close it
          clearTransitDetails();
      } else {
          // Otherwise, fetch details for the new mode
          fetchTransitDetails(mode);
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-green-800 mb-6">Compare Route Estimates</h1>

          {/* Keep Input Fields and Map Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Input Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                 <label htmlFor="start" className="text-sm font-medium text-green-800">Set Starting Point</label>
                 <div className="relative">
                   <Input ref={startInputRef} id="start" placeholder="Enter your starting location" className="pl-10 border-green-300 focus:border-green-500" />
                   <Search className="absolute left-3 top-2.5 h-5 w-5 text-green-500" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label htmlFor="destination" className="text-sm font-medium text-green-800">Set Destination</label>
                 <div className="relative">
                   <Input ref={destinationInputRef} id="destination" placeholder="Enter your destination" className="pl-10 border-green-300 focus:border-green-500" />
                   <Search className="absolute left-3 top-2.5 h-5 w-5 text-green-500" />
                 </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700" disabled={isLoadingDrivingRoute || !startPlace || !destinationPlace}>
                 {isLoadingDrivingRoute ? "Calculating Driving Route..." : showRouteOptions ? "Estimates Displayed" : "Enter Locations Above"}
              </Button>
            </div>
            {/* Right Column - Map Display */}
            <div ref={mapRef} className="h-[400px] bg-gray-200 rounded-lg border border-green-200 shadow-md">
            </div>
          </div>

          {/* Display Area for Estimated Route Options */}
          <div className="mt-8">
             {isLoadingDrivingRoute && <p className="text-center text-gray-600">Calculating route and estimates...</p>}
             {drivingRouteErrorMsg && !isLoadingDrivingRoute && (
                 <p className="text-center text-red-600 bg-red-100 p-3 rounded-md">{drivingRouteErrorMsg}</p>
             )}

             {showRouteOptions && routeDistanceKm !== null && baseRouteDurationSeconds !== null && (
                 <div className="space-y-4">
                   <h2 className="text-xl font-semibold text-green-800">Available Route Estimates</h2>
                   <div className="space-y-3">
                     {transportTypes.map((type) => {
                       // Calculate estimations based on DRIVING route data
                       // Note: Fare estimation only for non-Bus/Train types now
                       const fare = (type !== 'Bus' && type !== 'Train') ? estimateFare(type, routeDistanceKm) : 0; // Set bus/train fare to 0 or handle differently
                       const co2 = estimateCO2(type, routeDistanceKm);
                       const duration = estimateDuration(type, baseRouteDurationSeconds);
                       
                       // Determine if this option's details should be shown
                       const showDetails = selectedTransitMode === type;

                       return (
                         <React.Fragment key={type}> 
                           <RouteOption
                             type={type}
                             fare={fare}
                             co2Emission={co2}
                             duration={duration}
                             // Pass the new handler for Bus/Train
                             onClick={(type === 'Bus' || type === 'Train') ? handleTransitOptionClick : undefined}
                           />
                           
                           {/* Conditionally render details directly below if selected */}
                           {showDetails && (
                             <div className="ml-4 pl-4 border-l-2 border-gray-200 mt-2 mb-3"> {/* Indent details slightly */}
                               {isLoadingDetails && (
                                  <p className="text-center text-gray-600 p-4 bg-gray-50 rounded-md">Loading {selectedTransitMode} details...</p>
                               )}
                               {detailErrorMsg && (
                                  <p className="text-center text-red-600 bg-red-100 p-3 rounded-md">{detailErrorMsg}</p>
                               )}
                               {detailedTransitRoute && (
                                  <DetailedTransitDisplay 
                                     route={detailedTransitRoute} 
                                     mode={selectedTransitMode!} // Type assertion OK here as showDetails confirms selectedTransitMode matches
                                  />
                               )}
                             </div>
                           )}
                         </React.Fragment>
                       );
                     })}
                   </div>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
