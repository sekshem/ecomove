'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Leaf, Car, Settings, Home, MapPin } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for the chart (replace with actual data fetching if available)
const monthlyCO2Savings = [
  { month: 'Jan', savings: 15 },
  { month: 'Feb', savings: 28 },
  { month: 'Mar', savings: 22 },
  { month: 'Apr', savings: 35 }, // Assuming current month has data
  // Add more months as needed
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Profile Banner */}
        <Card className="border-green-200 shadow-md mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-green-600 text-white p-6 rounded-full">
                <User className="h-12 w-12" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-green-800">Saksham Mann</h1>
                <p className="text-gray-600 flex items-center justify-center md:justify-start mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Member since January 2024</span>
                </p>

                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Eco Trips</p>
                    <p className="text-xl font-bold text-green-700">42</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">kg CO₂ Saved</p>
                    <p className="text-xl font-bold text-green-700">128</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">Trees Worth</p>
                    <p className="text-xl font-bold text-green-700">12</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="border-green-200 shadow-md">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-800 font-medium border-l-4 border-green-600"
                  >
                    <Home className="h-5 w-5" />
                    <span>Overview</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile Info</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>My Bookings</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-800"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Card className="border-green-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800">Dashboard Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border-green-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Total Trips</p>
                          <p className="text-2xl font-bold text-green-700">42</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <Car className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">CO₂ Saved</p>
                          <p className="text-2xl font-bold text-green-700">128 kg</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <Leaf className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Money Saved</p>
                          <p className="text-2xl font-bold text-green-700">₹85</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <span className="text-xl font-bold text-green-600">₹</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Environmental Impact */}
                <div>
                  <h3 className="text-lg font-medium text-green-800 mb-3">Environmental Impact</h3>
                  <p className="text-sm text-gray-600 mb-4">Your eco-friendly choices are equivalent to:</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Trees Planted</p>
                        <p className="text-lg font-semibold text-green-700">12</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Car className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">km Not Driven</p>
                        <p className="text-lg font-semibold text-green-700">640</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-lg font-semibold text-green-600">₹</span>
                      <div>
                        <p className="text-xs text-gray-600">Fuel Savings</p>
                        <p className="text-lg font-semibold text-green-700">₹120</p>
                      </div>
                    </div>
                  </div>

                  {/* CO₂ Savings Chart */}
                  <h4 className="text-md font-semibold text-green-800 mb-2 mt-6">Monthly CO₂ Savings (kg)</h4>
                  <div className="h-64 bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={monthlyCO2Savings} 
                        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false}/>
                        <XAxis 
                          dataKey="month" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          dy={5}
                        />
                        <YAxis 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(value) => `${value}kg`}
                          width={40}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f0fdf4' }}
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cccccc', borderRadius: '4px' }} 
                          labelStyle={{ color: '#14532d'}}
                          formatter={(value: number) => [`${value} kg`, 'CO₂ Saved']}
                        />
                        <Bar 
                          dataKey="savings" 
                          fill="#16a34a"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Trips */}
                <div>
                  <h3 className="text-lg font-medium text-green-800 mb-3">Recent Trips</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="px-4 py-2 text-left text-sm font-medium text-green-800">Date</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-green-800">Route</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-green-800">Transport</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-green-800">CO₂ Saved</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-green-800">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-100">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700">Apr 15, 2024</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Home → Office</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-100 text-green-800 border-green-200">Metro</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-green-700">3.2 kg</td>
                          <td className="px-4 py-3 text-sm text-gray-700">₹4.50</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700">Apr 14, 2024</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Office → Mall</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-100 text-green-800 border-green-200">Bus</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-green-700">2.8 kg</td>
                          <td className="px-4 py-3 text-sm text-gray-700">₹3.75</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-700">Apr 12, 2024</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Mall → Home</td>
                          <td className="px-4 py-3">
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Rapido</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-green-700">1.5 kg</td>
                          <td className="px-4 py-3 text-sm text-gray-700">₹7.25</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
