import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network, Code } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function APIDesign() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            API Design Specification
          </CardTitle>
          <CardDescription>RESTful API endpoints and GraphQL schema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rest" className="space-y-6">
            <TabsList>
              <TabsTrigger value="rest">REST API</TabsTrigger>
              <TabsTrigger value="graphql">GraphQL</TabsTrigger>
              <TabsTrigger value="websocket">WebSocket</TabsTrigger>
            </TabsList>

            <TabsContent value="rest" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Authentication Endpoints</h3>
                <div className="space-y-3">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-chart-2">POST</Badge>
                        <div className="flex-1">
                          <code className="text-sm font-mono">/api/v1/auth/register</code>
                          <p className="text-sm text-muted-foreground mt-2">Register a new user account</p>
                          <div className="mt-3 p-3 bg-background rounded border">
                            <div className="text-xs font-semibold mb-2">Request Body:</div>
                            <pre className="text-xs font-mono overflow-x-auto">
                              {`{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "shipper",
  "companyId": "uuid"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-chart-2">POST</Badge>
                        <div className="flex-1">
                          <code className="text-sm font-mono">/api/v1/auth/login</code>
                          <p className="text-sm text-muted-foreground mt-2">Authenticate user and return JWT</p>
                          <div className="mt-3 p-3 bg-background rounded border">
                            <div className="text-xs font-semibold mb-2">Response:</div>
                            <pre className="text-xs font-mono overflow-x-auto">
                              {`{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "user": { "id": "uuid", "email": "...", "role": "..." }
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Shipment Endpoints</h3>
                <div className="space-y-3">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-chart-2">POST</Badge>
                        <div className="flex-1">
                          <code className="text-sm font-mono">/api/v1/shipments</code>
                          <p className="text-sm text-muted-foreground mt-2">Create a new shipment</p>
                          <div className="mt-3 p-3 bg-background rounded border">
                            <div className="text-xs font-semibold mb-2">Request Body:</div>
                            <pre className="text-xs font-mono overflow-x-auto">
                              {`{
  "carrierId": "uuid",
  "receiverId": "uuid",
  "origin": {
    "address": "123 Main St, City, Country",
    "coordinates": { "lat": 40.7128, "lng": -74.0060 }
  },
  "destination": { ... },
  "weight": 25.5,
  "dimensions": { "length": 50, "width": 40, "height": 30 },
  "estimatedDelivery": "2025-01-15T10:00:00Z"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-primary">GET</Badge>
                        <div className="flex-1">
                          <code className="text-sm font-mono">/api/v1/shipments/:id</code>
                          <p className="text-sm text-muted-foreground mt-2">Get shipment details by ID</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-primary">GET</Badge>
                        <div className="flex-1">
                          <code className="text-sm font-mono">/api/v1/shipments</code>
                          <p className="text-sm text-muted-foreground mt-2">List shipments with pagination</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Query params: ?page=1&limit=20&status=in_transit&sort=-createdAt
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-accent">PATCH</Badge>
                        <div className="flex-1">
                          <code className="text-sm font-mono">/api/v1/shipments/:id</code>
                          <p className="text-sm text-muted-foreground mt-2">Update shipment status or details</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-destructive">DELETE</Badge>
                        <div className="flex-1">
                          <code className="text-sm font-mono">/api/v1/shipments/:id</code>
                          <p className="text-sm text-muted-foreground mt-2">Cancel shipment (soft delete)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Tracking Endpoints</h3>
                <div className="space-y-3">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-primary">GET</Badge>
                        <div className="flex-1">
                          <code className="text-sm font-mono">/api/v1/tracking/:trackingNumber</code>
                          <p className="text-sm text-muted-foreground mt-2">
                            Public endpoint for tracking by tracking number
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-chart-2">POST</Badge>
                        <div className="flex-1">
                          <code className="text-sm font-mono">/api/v1/tracking/events</code>
                          <p className="text-sm text-muted-foreground mt-2">Add tracking event (IoT/carrier only)</p>
                          <div className="mt-3 p-3 bg-background rounded border">
                            <div className="text-xs font-semibold mb-2">Request Body:</div>
                            <pre className="text-xs font-mono overflow-x-auto">
                              {`{
  "shipmentId": "uuid",
  "eventType": "location_update",
  "location": { "lat": 40.7128, "lng": -74.0060 },
  "address": "456 Transit Ave, City",
  "description": "Package in transit",
  "timestamp": "2025-01-10T14:30:00Z"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">API Design Principles</h3>
                <Card className="bg-primary/5 border-primary">
                  <CardContent className="p-6">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Code className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Versioning:</strong> All endpoints prefixed with /api/v1 for future compatibility
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Code className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Authentication:</strong> Bearer token in Authorization header for protected endpoints
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Code className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Pagination:</strong> Cursor-based pagination for large datasets, page-based for simple
                          lists
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Code className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Error Handling:</strong> Consistent error response format with error codes and
                          messages
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Code className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Rate Limiting:</strong> 1000 requests/hour for authenticated users, 100/hour for
                          public endpoints
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="graphql" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">GraphQL Schema</h3>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <pre className="text-sm font-mono overflow-x-auto">
                      {`type Query {
  shipment(id: ID!): Shipment
  shipments(
    page: Int
    limit: Int
    status: ShipmentStatus
    sort: SortOrder
  ): ShipmentConnection!
  tracking(trackingNumber: String!): TrackingInfo!
  user(id: ID!): User
  warehouse(id: ID!): Warehouse
}

type Mutation {
  createShipment(input: CreateShipmentInput!): Shipment!
  updateShipment(id: ID!, input: UpdateShipmentInput!): Shipment!
  cancelShipment(id: ID!): Shipment!
  addTrackingEvent(input: TrackingEventInput!): TrackingEvent!
}

type Subscription {
  shipmentUpdated(id: ID!): Shipment!
  trackingEventAdded(shipmentId: ID!): TrackingEvent!
}

type Shipment {
  id: ID!
  trackingNumber: String!
  shipper: User!
  carrier: User!
  receiver: User!
  origin: Location!
  destination: Location!
  status: ShipmentStatus!
  weight: Float!
  dimensions: Dimensions!
  estimatedDelivery: DateTime!
  actualDelivery: DateTime
  trackingEvents: [TrackingEvent!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type TrackingEvent {
  id: ID!
  shipment: Shipment!
  eventType: String!
  location: GeoPoint!
  address: String!
  description: String
  timestamp: DateTime!
}

enum ShipmentStatus {
  PENDING
  IN_TRANSIT
  DELIVERED
  CANCELLED
}`}
                    </pre>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Example Queries</h3>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold mb-2">Get Shipment with Tracking</div>
                        <pre className="text-xs font-mono overflow-x-auto p-3 bg-background rounded border">
                          {`query GetShipment($id: ID!) {
  shipment(id: $id) {
    id
    trackingNumber
    status
    estimatedDelivery
    shipper {
      firstName
      lastName
      company {
        name
      }
    }
    trackingEvents {
      eventType
      location {
        lat
        lng
      }
      address
      timestamp
    }
  }
}`}
                        </pre>
                      </div>

                      <div>
                        <div className="text-sm font-semibold mb-2">Subscribe to Tracking Updates</div>
                        <pre className="text-xs font-mono overflow-x-auto p-3 bg-background rounded border">
                          {`subscription TrackingUpdates($shipmentId: ID!) {
  trackingEventAdded(shipmentId: $shipmentId) {
    eventType
    location {
      lat
      lng
    }
    address
    timestamp
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="websocket" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">WebSocket Events</h3>
                <div className="space-y-3">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="font-semibold mb-2">Connection</div>
                      <code className="text-sm">wss://api.glx.com/ws?token=JWT_TOKEN</code>
                      <p className="text-sm text-muted-foreground mt-2">
                        Authenticate via query parameter or initial message
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="font-semibold mb-2">Subscribe to Shipment</div>
                      <pre className="text-xs font-mono overflow-x-auto p-3 bg-background rounded border mt-2">
                        {`{
  "type": "subscribe",
  "channel": "shipment",
  "shipmentId": "uuid"
}`}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="font-semibold mb-2">Receive Location Update</div>
                      <pre className="text-xs font-mono overflow-x-auto p-3 bg-background rounded border mt-2">
                        {`{
  "type": "location_update",
  "shipmentId": "uuid",
  "data": {
    "location": { "lat": 40.7128, "lng": -74.0060 },
    "address": "Current location",
    "timestamp": "2025-01-10T14:30:00Z"
  }
}`}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="font-semibold mb-2">Status Change Notification</div>
                      <pre className="text-xs font-mono overflow-x-auto p-3 bg-background rounded border mt-2">
                        {`{
  "type": "status_change",
  "shipmentId": "uuid",
  "data": {
    "oldStatus": "in_transit",
    "newStatus": "delivered",
    "timestamp": "2025-01-10T16:00:00Z"
  }
}`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
