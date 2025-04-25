import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Leaf } from "lucide-react"

// Define the structure for CO2 emission data
type CO2Category = 'low' | 'medium' | 'high';
interface CO2Emission {
  value: string; // Keep as string for formatted display (e.g., "1.5 kg")
  category: CO2Category;
}

// Define TransportType here or import if defined globally
type TransportType = 'Bus' | 'Train' | 'Rapido Bike' | 'Rapido Auto' | 'Cab';

// Update Props Interface to include optional onClick with specific signature
interface RouteOptionProps {
  type: TransportType;
  fare: number; // Expecting the numeric fare value
  duration: string;
  co2Emission: CO2Emission; // New prop for combined CO2 data
  // Accept function that takes only Bus or Train
  onClick?: (type: Extract<TransportType, 'Bus' | 'Train'>) => void; 
}

const routeLinks: { [key: string]: string } = {
  "Rapido Bike": "https://www.rapido.bike/Home",
  "Rapido Auto": "https://www.rapido.bike/Home",
  Cab: "https://www.uber.com/in/en/ride/?ad_id=729031234265&adg_id=175098167174&campaign_id=22341117997&cre=729031234265&dev=c&dev_m=&fi_id=&gad_source=1&gbraid=0AAAAADiA3jqpMcPCzVq577LXl_KyEialx&gclid=CjwKCAjwwqfABhBcEiwAZJjC3l718J3pr83lkHSaEdIITf9n1MiuPJaH_Z4nO-IrBXPqYdIQrg7bHRoC7s4QAvD_BwE&gclsrc=aw.ds&kw=uber%20auto&kwid=kwd-297339083264&match=b&net=g&placement=&tar=&utm_campaign=CM2561733-search-google-brand_77_-99_IN-National_r_web_acq_cpc_en_T1_Generic_BM_Southern_HM_uber%20auto_kwd-297339083264_729031234265_175098167174_b_c&utm_source=AdWords_Brand",
}

// Updated component to use new props
export function RouteOption({ type, fare, duration, co2Emission, onClick }: RouteOptionProps) {

  // Helper to get Badge color based on CO2 category
  const getEcoColor = (category: CO2Category) => {
    switch (category) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  // Helper to get Border color based on CO2 category
  const getBorderColor = (category: CO2Category) => {
    switch (category) {
      case "low":
        return "border-green-200 border-l-4 border-l-green-600"
      case "medium":
        return "border-yellow-200 border-l-4 border-l-yellow-500"
      case "high":
        return "border-red-200 border-l-4 border-l-red-500"
    }
  }

  // Helper to get text color based on CO2 category
  const getTextColor = (category: CO2Category) => {
      switch (category) {
        case "low": return "text-green-600";
        case "medium": return "text-yellow-600";
        case "high": return "text-red-600";
      }
  }

  const isClickable = type === 'Bus' || type === 'Train';
  const href = !isClickable ? routeLinks[type] : undefined;

  // Content to be rendered inside link or div
  const CardContentInner = (
      <Card className={`shadow-sm ${getBorderColor(co2Emission.category)} h-full transition-shadow duration-200 ${isClickable ? 'hover:shadow-md' : ''}`}>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <h3 className="font-medium text-gray-800">{type}</h3>
              {/* Use co2Emission.category for Badge color and update text */}
              <Badge variant="outline" className={getEcoColor(co2Emission.category)}>
                 CO₂ Impact
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Display fare in the format "Fare : ₹{value}" */}
              <div className="flex items-center text-sm text-gray-600">
                <span>Fare : ₹{fare}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{duration} (est.)</span>
              </div>

              {/* Display CO2 emission value with category color */}
              <div className="flex items-center text-sm">
                <Leaf
                  className={`h-4 w-4 mr-1 ${getTextColor(co2Emission.category)}`}
                />
                <span className={`${getTextColor(co2Emission.category)}`}>
                  {co2Emission.value}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );

  // Render as link or clickable div
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg"
      >
        {CardContentInner}
      </a>
    );
  } else {
    return (
      <div 
        onClick={() => { 
            // Type assertion is safe here because onClick is only passed for Bus/Train 
            // and isClickable ensures type is correct before calling.
            if (isClickable && onClick) {
                 onClick(type as Extract<TransportType, 'Bus' | 'Train'>);
            }
        }}
        className={`block rounded-lg ${isClickable ? 'cursor-pointer' : ''}`}
      >
         {CardContentInner}
      </div>
    );
  }
}
