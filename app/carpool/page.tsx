import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Users } from "lucide-react"

export default function CarpoolPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mt-8 max-w-3xl mx-auto">
          <Card className="border-green-200 shadow-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-600 text-white p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-green-800">Community Carpooling</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-green-700 mb-4">Coming Soon!</h2>
              <p className="text-gray-700 max-w-md mx-auto">
                We're working on connecting you with fellow commuters for shared rides. This feature will help reduce
                carbon emissions and make your commute more affordable.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
