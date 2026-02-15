import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Workflow, ArrowRight, Server, Bell, CheckCircle2 } from "lucide-react"

export function DataFlowDiagram() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Data Flow Architecture
          </CardTitle>
          <CardDescription>Request flow and data processing pipelines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Shipment Creation Flow */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Badge variant="secondary">Use Case 1</Badge>
              Shipment Creation Flow
            </h3>
            <div className="bg-muted/30 rounded-lg p-6 border-2 border-dashed border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Card className="bg-card">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">1. Client Request</div>
                        <div className="text-xs text-muted-foreground mt-1">POST /api/v1/shipments</div>
                      </CardContent>
                    </Card>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Card className="bg-primary/5 border-primary">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">2. API Gateway</div>
                        <div className="text-xs text-muted-foreground mt-1">Auth + Validation</div>
                      </CardContent>
                    </Card>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Card className="bg-accent/5 border-accent">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">3. Shipment Service</div>
                        <div className="text-xs text-muted-foreground mt-1">Business Logic</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Card className="bg-card">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">4. Database Write</div>
                        <div className="text-xs text-muted-foreground mt-1">PostgreSQL Transaction</div>
                      </CardContent>
                    </Card>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Card className="bg-chart-4/5 border-chart-4">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">5. Event Published</div>
                        <div className="text-xs text-muted-foreground mt-1">Kafka: shipment.created</div>
                      </CardContent>
                    </Card>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Card className="bg-card">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">6. Event Consumers</div>
                        <div className="text-xs text-muted-foreground mt-1">Notification, Analytics</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Tracking Flow */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Badge variant="secondary">Use Case 2</Badge>
              Real-time Tracking Updates
            </h3>
            <div className="bg-muted/30 rounded-lg p-6 border-2 border-dashed border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Card className="bg-card">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">1. IoT Device</div>
                        <div className="text-xs text-muted-foreground mt-1">GPS Location Update</div>
                      </CardContent>
                    </Card>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Card className="bg-chart-2/5 border-chart-2">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">2. IoT Gateway</div>
                        <div className="text-xs text-muted-foreground mt-1">AWS IoT Core</div>
                      </CardContent>
                    </Card>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Card className="bg-accent/5 border-accent">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">3. Tracking Service</div>
                        <div className="text-xs text-muted-foreground mt-1">Process Location</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Card className="bg-card">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">4. Cache Update</div>
                        <div className="text-xs text-muted-foreground mt-1">Redis Write</div>
                      </CardContent>
                    </Card>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Card className="bg-primary/5 border-primary">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">5. WebSocket Push</div>
                        <div className="text-xs text-muted-foreground mt-1">Real-time to Clients</div>
                      </CardContent>
                    </Card>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Card className="bg-card">
                      <CardContent className="p-4">
                        <div className="font-medium text-sm">6. Client Update</div>
                        <div className="text-xs text-muted-foreground mt-1">Map Visualization</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event-Driven Architecture */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Event-Driven Communication</h3>
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Server className="w-4 h-4 text-primary" />
                      Event Publishers
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-chart-1" />
                        <span>Shipment Service</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-chart-2" />
                        <span>Tracking Service</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-chart-3" />
                        <span>Warehouse Service</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-chart-4" />
                        <span>Billing Service</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-accent" />
                      Event Types
                    </h4>
                    <div className="space-y-2">
                      <Badge variant="outline" className="mr-2">
                        shipment.created
                      </Badge>
                      <Badge variant="outline" className="mr-2">
                        shipment.updated
                      </Badge>
                      <Badge variant="outline" className="mr-2">
                        location.changed
                      </Badge>
                      <Badge variant="outline" className="mr-2">
                        delivery.completed
                      </Badge>
                      <Badge variant="outline" className="mr-2">
                        invoice.generated
                      </Badge>
                      <Badge variant="outline" className="mr-2">
                        alert.triggered
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium mb-2">Message Broker: Apache Kafka</div>
                  <div className="text-sm text-muted-foreground">
                    High-throughput, distributed event streaming platform with guaranteed message delivery, partitioning
                    for scalability, and event replay capabilities for debugging and recovery.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
