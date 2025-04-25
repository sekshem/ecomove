import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Car, MapPin, MessageSquare } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mt-8 max-w-3xl mx-auto">
          <Card className="border-green-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-800">Welcome to ECOMOVE</CardTitle>
              <CardDescription className="text-green-700">Your eco-friendly transportation companion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                ECOMOVE envisions a seamless and intelligent urban transport ecosystem that leverages cutting-edge
                technology to enhance mobility for commuters. By integrating real-time tracking, AI-powered route
                optimization, multimodal transport comparison, and promoting sustainable choices, ECOMOVE ensures a more
                efficient, convenient, and greener commuting experience.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Button
                  asChild
                  className="h-auto py-6 bg-green-600 hover:bg-green-700 flex flex-col items-center gap-2"
                >
                  <Link href="/route-comparison">
                    <MapPin className="h-6 w-6 mb-1" />
                    <span>Compare Routes</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="h-auto py-6 bg-green-600 hover:bg-green-700 flex flex-col items-center gap-2"
                >
                  <Link href="/carpool">
                    <Car className="h-6 w-6 mb-1" />
                    <span>Join a Carpool</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  className="h-auto py-6 bg-green-600 hover:bg-green-700 flex flex-col items-center gap-2"
                >
                  <Link href="/review">
                    <MessageSquare className="h-6 w-6 mb-1" />
                    <span>Leave a Review</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
