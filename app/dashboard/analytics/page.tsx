"use client";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Droplets,
  Thermometer,
  Sun,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const analyticsData = {
  overview: {
    totalYield: 1250,
    yieldChange: 12.5,
    avgTemperature: 28.5,
    avgHumidity: 72,
    soilMoisture: 68,
    npkLevel: 85,
  },
  trends: [
    {
      metric: "Crop Yield",
      value: "1,250 kg",
      change: 12.5,
      trend: "up",
      period: "vs last month",
    },
    {
      metric: "Water Usage",
      value: "2,400 L",
      change: -8.2,
      trend: "down",
      period: "vs last month",
    },
    {
      metric: "Fertilizer Cost",
      value: "$450",
      change: 5.1,
      trend: "up",
      period: "vs last month",
    },
    {
      metric: "Energy Consumption",
      value: "180 kWh",
      change: -15.3,
      trend: "down",
      period: "vs last month",
    },
  ],
  charts: [
    {
      title: "Yield Trends",
      type: "line",
      data: "Monthly crop yield over the past 6 months",
    },
    {
      title: "Resource Usage",
      type: "bar",
      data: "Water, fertilizer, and energy consumption",
    },
    {
      title: "Environmental Factors",
      type: "area",
      data: "Temperature, humidity, and soil moisture correlation",
    },
  ],
};

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-purple-100 mt-1">
                Comprehensive insights into your farm performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Yield</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview.totalYield} kg
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +{analyticsData.overview.yieldChange}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Temperature</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview.avgTemperature}°C
                </p>
                <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Thermometer className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Soil Moisture</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.overview.soilMoisture}%
                </p>
                <p className="text-sm text-gray-500 mt-1">Current level</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Performance Trends</h2>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Last 30 days</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.trends.map((trend, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">{trend.metric}</p>
                  {trend.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {trend.value}
                </p>
                <div className="flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      trend.trend === "up"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trend.change > 0 ? "+" : ""}{trend.change}%
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {trend.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analyticsData.charts.map((chart, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{chart.title}</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">{chart.data}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Chart visualization will be implemented here
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Insights & Recommendations */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">AI Insights & Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">
                🎯 Optimization Opportunity
              </h4>
              <p className="text-sm text-green-800">
                Your water usage has decreased by 8.2% this month. Consider
                maintaining this efficiency while monitoring crop health.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                📈 Growth Trend
              </h4>
              <p className="text-sm text-blue-800">
                Crop yield is trending upward (+12.5%). Your current farming
                practices are showing positive results.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">
                ⚠️ Cost Alert
              </h4>
              <p className="text-sm text-yellow-800">
                Fertilizer costs have increased by 5.1%. Consider reviewing
                application rates and timing for cost optimization.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">
                🔋 Energy Efficiency
              </h4>
              <p className="text-sm text-purple-800">
                Energy consumption decreased by 15.3%. Your energy-saving
                measures are working effectively.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
