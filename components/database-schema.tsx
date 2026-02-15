import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Table, Key } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DatabaseSchema() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Schema Design
          </CardTitle>
          <CardDescription>Relational and NoSQL database schemas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="relationships">ERD</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    users
                  </CardTitle>
                  <CardDescription>User accounts and authentication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Key className="w-3 h-3 text-primary" />
                      <span className="font-semibold">id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        PRIMARY KEY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>email</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(255)
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        UNIQUE
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>password_hash</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(255)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>first_name</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(100)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>last_name</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(100)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>role</span>
                      <Badge variant="outline" className="text-xs">
                        ENUM
                      </Badge>
                      <span className="text-xs text-muted-foreground">(shipper, carrier, receiver, admin)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>company_id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        FOREIGN KEY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>phone</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(20)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>is_verified</span>
                      <Badge variant="outline" className="text-xs">
                        BOOLEAN
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>created_at</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>updated_at</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    companies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Key className="w-3 h-3 text-primary" />
                      <span className="font-semibold">id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        PRIMARY KEY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>name</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(255)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>type</span>
                      <Badge variant="outline" className="text-xs">
                        ENUM
                      </Badge>
                      <span className="text-xs text-muted-foreground">(shipper, carrier, warehouse)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>tax_id</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(50)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>address</span>
                      <Badge variant="outline" className="text-xs">
                        JSONB
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>created_at</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipments" className="space-y-4">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    shipments
                  </CardTitle>
                  <CardDescription>Core shipment information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Key className="w-3 h-3 text-primary" />
                      <span className="font-semibold">id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        PRIMARY KEY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>tracking_number</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(50)
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        UNIQUE
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>shipper_id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        FOREIGN KEY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>carrier_id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        FOREIGN KEY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>receiver_id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        FOREIGN KEY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>origin</span>
                      <Badge variant="outline" className="text-xs">
                        JSONB
                      </Badge>
                      <span className="text-xs text-muted-foreground">(address, coordinates)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>destination</span>
                      <Badge variant="outline" className="text-xs">
                        JSONB
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>status</span>
                      <Badge variant="outline" className="text-xs">
                        ENUM
                      </Badge>
                      <span className="text-xs text-muted-foreground">(pending, in_transit, delivered, cancelled)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>weight_kg</span>
                      <Badge variant="outline" className="text-xs">
                        DECIMAL(10,2)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>dimensions</span>
                      <Badge variant="outline" className="text-xs">
                        JSONB
                      </Badge>
                      <span className="text-xs text-muted-foreground">(length, width, height)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>estimated_delivery</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>actual_delivery</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>created_at</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>updated_at</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    tracking_events
                  </CardTitle>
                  <CardDescription>Real-time location and status updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Key className="w-3 h-3 text-primary" />
                      <span className="font-semibold">id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        PRIMARY KEY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>shipment_id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        FOREIGN KEY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>event_type</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(50)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>location</span>
                      <Badge variant="outline" className="text-xs">
                        GEOGRAPHY(POINT)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>address</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(500)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>description</span>
                      <Badge variant="outline" className="text-xs">
                        TEXT
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>metadata</span>
                      <Badge variant="outline" className="text-xs">
                        JSONB
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>timestamp</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        INDEXED
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 bg-accent/10 rounded-lg border border-accent">
                <div className="text-sm font-medium mb-2">Note: TimescaleDB Hypertable</div>
                <div className="text-sm text-muted-foreground">
                  The tracking_events table is converted to a TimescaleDB hypertable partitioned by timestamp for
                  efficient time-series queries and automatic data retention policies.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="warehouses" className="space-y-4">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    warehouses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Key className="w-3 h-3 text-primary" />
                      <span className="font-semibold">id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>name</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(255)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>company_id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>location</span>
                      <Badge variant="outline" className="text-xs">
                        GEOGRAPHY(POINT)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>capacity_m3</span>
                      <Badge variant="outline" className="text-xs">
                        DECIMAL(10,2)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>operating_hours</span>
                      <Badge variant="outline" className="text-xs">
                        JSONB
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    inventory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Key className="w-3 h-3 text-primary" />
                      <span className="font-semibold">id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>warehouse_id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>shipment_id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>location_code</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(50)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>received_at</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>dispatched_at</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    invoices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Key className="w-3 h-3 text-primary" />
                      <span className="font-semibold">id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>invoice_number</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(50)
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        UNIQUE
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>shipment_id</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>billed_to</span>
                      <Badge variant="outline" className="text-xs">
                        UUID
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>amount</span>
                      <Badge variant="outline" className="text-xs">
                        DECIMAL(10,2)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>currency</span>
                      <Badge variant="outline" className="text-xs">
                        VARCHAR(3)
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>status</span>
                      <Badge variant="outline" className="text-xs">
                        ENUM
                      </Badge>
                      <span className="text-xs text-muted-foreground">(pending, paid, overdue)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>due_date</span>
                      <Badge variant="outline" className="text-xs">
                        DATE
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pl-5">
                      <span>paid_at</span>
                      <Badge variant="outline" className="text-xs">
                        TIMESTAMP
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="relationships" className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-8 border-2 border-dashed border-border">
                <h3 className="text-lg font-semibold mb-6 text-center">Entity Relationship Diagram</h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-primary/10 border-primary">
                      <CardContent className="p-4 text-center">
                        <div className="font-semibold">companies</div>
                        <div className="text-xs text-muted-foreground mt-1">1:N with users</div>
                        <div className="text-xs text-muted-foreground">1:N with warehouses</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-accent/10 border-accent">
                      <CardContent className="p-4 text-center">
                        <div className="font-semibold">users</div>
                        <div className="text-xs text-muted-foreground mt-1">N:1 with companies</div>
                        <div className="text-xs text-muted-foreground">1:N with shipments</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-chart-4/10 border-chart-4">
                      <CardContent className="p-4 text-center">
                        <div className="font-semibold">shipments</div>
                        <div className="text-xs text-muted-foreground mt-1">N:1 with users (3x)</div>
                        <div className="text-xs text-muted-foreground">1:N with tracking_events</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      Each shipment has three user relationships: shipper, carrier, and receiver. Tracking events are
                      linked to shipments for location history.
                    </p>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Indexing Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        B-Tree
                      </Badge>
                      <div>
                        <div className="font-medium">Primary and Foreign Keys</div>
                        <div className="text-muted-foreground">All UUID keys automatically indexed</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        GiST
                      </Badge>
                      <div>
                        <div className="font-medium">Geographic Indexes</div>
                        <div className="text-muted-foreground">
                          Location columns for spatial queries (nearest warehouse, route optimization)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        GIN
                      </Badge>
                      <div>
                        <div className="font-medium">JSONB Indexes</div>
                        <div className="text-muted-foreground">Metadata and address fields for flexible querying</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">
                        Composite
                      </Badge>
                      <div>
                        <div className="font-medium">Multi-Column Indexes</div>
                        <div className="text-muted-foreground">
                          (shipment_id, timestamp) for efficient tracking queries
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
