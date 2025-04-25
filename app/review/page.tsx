import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { StarRating } from "@/components/star-rating"
import { MessageSquare } from "lucide-react"

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mt-8 max-w-2xl mx-auto">
          <Card className="border-green-200 shadow-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-600 text-white p-3 rounded-full">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-green-800">Share Your Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">How would you rate your experience?</label>
                <div className="flex justify-center">
                  <StarRating />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="comments" className="text-sm font-medium text-green-800">
                  Comments or Suggestions
                </label>
                <Textarea
                  id="comments"
                  placeholder="Tell us about your experience with ECOMOVE..."
                  className="min-h-[120px] border-green-300 focus:border-green-500"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Submit Review</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
