import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ScalabilityConsiderations() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">📊 Scalability Architecture</CardTitle>
          <CardDescription>Horizontal and vertical scaling strategies for GLX platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Horizontal Scaling */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🔄 Horizontal Scaling Strategies</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Microservices Auto-Scaling</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Kubernetes HPA (Horizontal Pod Autoscaler)</li>
                    <li>CPU/Memory-based scaling (70% threshold)</li>
                    <li>Custom metrics (request queue depth)</li>
                    <li>Min 2 replicas, max 20 per service</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Database Scaling</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Read replicas for query distribution</li>
                    <li>Sharding by company_id for multi-tenancy</li>
                    <li>Connection pooling (PgBouncer)</li>
                    <li>Automated failover with RDS Multi-AZ</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Caching Strategy</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Redis Cluster for distributed caching</li>
                    <li>CDN for static assets (CloudFront)</li>
                    <li>Application-level caching (in-memory)</li>
                    <li>Cache invalidation strategies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Load Balancing</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Application Load Balancer (ALB)</li>
                    <li>Round-robin with health checks</li>
                    <li>Session affinity for stateful services</li>
                    <li>Geographic load balancing</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance Targets */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🎯 Performance Targets</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{"<"}100ms</div>
                  <div className="text-sm text-muted-foreground">API Response Time (P95)</div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">10,000+</div>
                  <div className="text-sm text-muted-foreground">Concurrent Users</div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime SLA</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Monitoring & Observability */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📈 Monitoring & Observability</h3>
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Metrics Collection</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                      <li>Prometheus for metrics aggregation</li>
                      <li>Grafana dashboards for visualization</li>
                      <li>Custom business metrics tracking</li>
                      <li>Real-time alerting (PagerDuty)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Distributed Tracing</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                      <li>OpenTelemetry instrumentation</li>
                      <li>Jaeger for trace visualization</li>
                      <li>Request correlation IDs</li>
                      <li>Performance bottleneck identification</li>
                    </ul>
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
