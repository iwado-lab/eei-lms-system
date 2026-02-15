import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Box, Server, Database, Cloud, Globe, Layers, ArrowRight } from "lucide-react"

export function SystemArchitecture() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="w-5 h-5" />
            System Architecture Overview
          </CardTitle>
          <CardDescription>High-level architecture diagram and component breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Architecture Diagram */}
          <div className="bg-muted/30 rounded-lg p-8 border-2 border-dashed border-border">
            <div className="space-y-6">
              {/* Client Layer */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-3">CLIENT LAYER</div>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-card">
                    <CardContent className="p-4 text-center">
                      <Globe className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">Web App</div>
                      <div className="text-xs text-muted-foreground">React + Next.js</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-4 text-center">
                      <Globe className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">Mobile App</div>
                      <div className="text-xs text-muted-foreground">React Native</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-4 text-center">
                      <Globe className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">Partner API</div>
                      <div className="text-xs text-muted-foreground">REST/GraphQL</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
              </div>

              {/* API Gateway */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-3">API GATEWAY</div>
                <Card className="bg-accent/10 border-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">Kong API Gateway</div>
                        <div className="text-sm text-muted-foreground">
                          Authentication, Rate Limiting, Load Balancing
                        </div>
                      </div>
                      <Badge variant="secondary">Critical</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
              </div>

              {/* Microservices Layer */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-3">MICROSERVICES LAYER</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Card className="bg-card">
                    <CardContent className="p-3">
                      <Server className="w-5 h-5 mb-2 text-chart-1" />
                      <div className="font-medium text-sm">Auth Service</div>
                      <div className="text-xs text-muted-foreground">Node.js</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-3">
                      <Server className="w-5 h-5 mb-2 text-chart-2" />
                      <div className="font-medium text-sm">Shipment Service</div>
                      <div className="text-xs text-muted-foreground">Go</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-3">
                      <Server className="w-5 h-5 mb-2 text-chart-3" />
                      <div className="font-medium text-sm">Tracking Service</div>
                      <div className="text-xs text-muted-foreground">Python</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-3">
                      <Server className="w-5 h-5 mb-2 text-chart-4" />
                      <div className="font-medium text-sm">Warehouse Service</div>
                      <div className="text-xs text-muted-foreground">Java</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-3">
                      <Server className="w-5 h-5 mb-2 text-chart-5" />
                      <div className="font-medium text-sm">Route Service</div>
                      <div className="text-xs text-muted-foreground">Python</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-3">
                      <Server className="w-5 h-5 mb-2 text-chart-1" />
                      <div className="font-medium text-sm">Billing Service</div>
                      <div className="text-xs text-muted-foreground">Node.js</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-3">
                      <Server className="w-5 h-5 mb-2 text-chart-2" />
                      <div className="font-medium text-sm">Notification Service</div>
                      <div className="text-xs text-muted-foreground">Go</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-3">
                      <Server className="w-5 h-5 mb-2 text-chart-3" />
                      <div className="font-medium text-sm">Analytics Service</div>
                      <div className="text-xs text-muted-foreground">Python</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
              </div>

              {/* Data Layer */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-3">DATA LAYER</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-card">
                    <CardContent className="p-4 text-center">
                      <Database className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">PostgreSQL</div>
                      <div className="text-xs text-muted-foreground">Primary DB</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-4 text-center">
                      <Database className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <div className="font-medium text-sm">Redis</div>
                      <div className="text-xs text-muted-foreground">Cache</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-4 text-center">
                      <Database className="w-6 h-6 mx-auto mb-2 text-chart-4" />
                      <div className="font-medium text-sm">MongoDB</div>
                      <div className="text-xs text-muted-foreground">Documents</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-card">
                    <CardContent className="p-4 text-center">
                      <Database className="w-6 h-6 mx-auto mb-2 text-chart-2" />
                      <div className="font-medium text-sm">Elasticsearch</div>
                      <div className="text-xs text-muted-foreground">Search</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90" />
              </div>

              {/* Infrastructure Layer */}
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-3">INFRASTRUCTURE</div>
                <Card className="bg-primary/5 border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Cloud className="w-6 h-6 text-primary" />
                        <div>
                          <div className="font-semibold">AWS Cloud Infrastructure</div>
                          <div className="text-sm text-muted-foreground">
                            EKS, RDS, ElastiCache, S3, CloudFront, Lambda
                          </div>
                        </div>
                      </div>
                      <Badge>Multi-Region</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Component Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Component Descriptions</h3>
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Layers className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">API Gateway (Kong)</h4>
                      <p className="text-sm text-muted-foreground">
                        Centralized entry point for all client requests. Handles authentication, authorization, rate
                        limiting, request routing, and API versioning. Implements circuit breaker patterns for fault
                        tolerance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Server className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Microservices</h4>
                      <p className="text-sm text-muted-foreground">
                        Domain-driven services with independent databases following the database-per-service pattern.
                        Each service is containerized and deployed independently with its own CI/CD pipeline.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Database className="w-5 h-5 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Data Layer</h4>
                      <p className="text-sm text-muted-foreground">
                        Polyglot persistence strategy using PostgreSQL for transactional data, MongoDB for flexible
                        documents, Redis for caching and session management, and Elasticsearch for full-text search
                        capabilities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
