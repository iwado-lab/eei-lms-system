"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Database,
  Zap,
  Code,
  Shield,
  Network,
  Layers,
  Box,
  CheckCircle2,
  Globe,
  Users,
  Package,
  Truck,
  BarChart3,
  FileCode,
  Workflow,
} from "lucide-react"
import { SystemArchitecture } from "@/components/system-architecture"
import { DataFlowDiagram } from "@/components/data-flow-diagram"
import { DatabaseSchema } from "@/components/database-schema"
import { APIDesign } from "@/components/api-design"
import { SecurityMeasures } from "@/components/security-measures"
import { TechnologyStack } from "@/components/technology-stack"
import { ScalabilityConsiderations } from "@/components/scalability-considerations"

export default function SystemDesignPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">GLX System Design</h1>
                <p className="text-sm text-muted-foreground">Global Logistics Exchange Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">v1.0.0</Badge>
              <Button variant="outline" size="sm">
                <FileCode className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Comprehensive System Design Documentation
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A complete technical specification for the Global Logistics Exchange (GLX) platform - a next-generation
              logistics management system designed for scalability, security, and real-time operations.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">10K+</div>
                    <div className="text-xs text-muted-foreground">Concurrent Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">50K+</div>
                    <div className="text-xs text-muted-foreground">Daily Shipments</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-chart-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">150+</div>
                    <div className="text-xs text-muted-foreground">Countries</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">99.9%</div>
                    <div className="text-xs text-muted-foreground">Uptime SLA</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto gap-2 bg-muted/50 p-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="architecture" className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline">Architecture</span>
            </TabsTrigger>
            <TabsTrigger value="dataflow" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              <span className="hidden sm:inline">Data Flow</span>
            </TabsTrigger>
            <TabsTrigger value="technology" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Tech Stack</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Database</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span className="hidden sm:inline">API Design</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="scalability" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Scalability</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  System Overview
                </CardTitle>
                <CardDescription>
                  High-level introduction to the GLX platform architecture and design principles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Executive Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    GLX (Global Logistics Exchange) is a comprehensive logistics management platform designed to handle
                    end-to-end supply chain operations. The system supports real-time tracking, route optimization,
                    warehouse management, and multi-party collaboration across shippers, carriers, and receivers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Core Design Principles</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Microservices Architecture</div>
                        <div className="text-sm text-muted-foreground">
                          Loosely coupled services for independent scaling and deployment
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Event-Driven Design</div>
                        <div className="text-sm text-muted-foreground">
                          Asynchronous communication for real-time updates and resilience
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">API-First Approach</div>
                        <div className="text-sm text-muted-foreground">
                          RESTful and GraphQL APIs for seamless integration
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">Cloud-Native Infrastructure</div>
                        <div className="text-sm text-muted-foreground">
                          Containerized deployment with Kubernetes orchestration
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <Truck className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold mb-1">Shipment Management</h4>
                        <p className="text-sm text-muted-foreground">
                          End-to-end tracking, documentation, and status updates
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <Network className="w-8 h-8 text-accent mb-2" />
                        <h4 className="font-semibold mb-1">Route Optimization</h4>
                        <p className="text-sm text-muted-foreground">AI-powered routing for cost and time efficiency</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <BarChart3 className="w-8 h-8 text-chart-4 mb-2" />
                        <h4 className="font-semibold mb-1">Analytics Dashboard</h4>
                        <p className="text-sm text-muted-foreground">Real-time insights and predictive analytics</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture">
            <SystemArchitecture />
          </TabsContent>

          {/* Data Flow Tab */}
          <TabsContent value="dataflow">
            <DataFlowDiagram />
          </TabsContent>

          {/* Technology Stack Tab */}
          <TabsContent value="technology">
            <TechnologyStack />
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database">
            <DatabaseSchema />
          </TabsContent>

          {/* API Design Tab */}
          <TabsContent value="api">
            <APIDesign />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <SecurityMeasures />
          </TabsContent>

          {/* Scalability Tab */}
          <TabsContent value="scalability">
            <ScalabilityConsiderations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
