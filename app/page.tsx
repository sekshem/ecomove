import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Leaf } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-green-200">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-green-600 text-white p-3 rounded-full">
              <Leaf className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">ECOMOVE</CardTitle>
          <CardDescription>Sustainable transportation for a greener future</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="your.email@example.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-green-600 hover:bg-green-700">
            <Link href="/home">Login</Link>
          </Button>
        </CardFooter>
      </Card>
      <p className="mt-4 text-sm text-green-800">Promoting eco-friendly transportation options since 2024</p>
    </div>
  )
}
