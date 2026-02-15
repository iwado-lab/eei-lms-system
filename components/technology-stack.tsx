import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, CheckCircle2 } from "lucide-react"

export function TechnologyStack() {
  const techStack = {
    frontend: [
      { name: "React 18", purpose: "UI Library", reason: "Component-based, large ecosystem" },
      { name: "Next.js 14", purpose: "Framework", reason: "SSR, API routes, optimized performance" },
      { name: "TypeScript", purpose: "Language", reason: "Type safety, better DX" },
      { name: "Tailwind CSS", purpose: "Styling", reason: "Utility-first, rapid development" },
      { name: "React Query", purpose: "Data Fetching", reason: "Caching, synchronization" },
      { name: "Zustand", purpose: "State Management", reason: "Lightweight, simple API" },
    ],
    backend: [
      { name: "Node.js", purpose: "Runtime", reason: "Auth, Billing services" },
      { name: "Go", purpose: "Language", reason: "High-performance services" },
      { name: "Python", purpose: "Language", reason: "ML, analytics, routing algorithms" },
      { name: "Java Spring Boot", purpose: "Framework", reason: "Enterprise warehouse management" },
      { name: "Express.js", purpose: "Framework", reason: "Lightweight API development" },
      { name: "FastAPI", purpose: "Framework", reason: "High-performance Python APIs" },
    ],
    database: [
      { name: "PostgreSQL 15", purpose: "Primary DB", reason: "ACID compliance, reliability" },
      { name: "MongoDB", purpose: "Document Store", reason: "Flexible schema for logs" },
      { name: "Redis", purpose: "Cache", reason: "In-memory speed, pub/sub" },
      { name: "Elasticsearch", purpose: "Search Engine", reason: "Full-text search, analytics" },
      { name: "TimescaleDB", purpose: "Time-Series", reason: "IoT tracking data" },
    ],
    infrastructure: [
      { name: "AWS EKS", purpose: "Orchestration", reason: "Managed Kubernetes" },
      { name: "Docker", purpose: "Containerization", reason: "Consistent environments" },
      { name: "Terraform", purpose: "IaC", reason: "Infrastructure as code" },
      { name: "AWS RDS", purpose: "Managed DB", reason: "Automated backups, scaling" },
      { name: "AWS S3", purpose: "Object Storage", reason: "Document storage" },
      { name: "CloudFront", purpose: "CDN", reason: "Global content delivery" },
    ],
    messaging: [
      { name: "Apache Kafka", purpose: "Event Streaming", reason: "High throughput, durability" },
      { name: "RabbitMQ", purpose: "Message Queue", reason: "Task queues, reliability" },
      { name: "AWS SNS/SQS", purpose: "Pub/Sub", reason: "Managed messaging" },
      { name: "Socket.io", purpose: "WebSockets", reason: "Real-time bidirectional" },
    ],
    monitoring: [
      { name: "Prometheus", purpose: "Metrics", reason: "Time-series monitoring" },
      { name: "Grafana", purpose: "Visualization", reason: "Dashboards, alerting" },
      { name: "ELK Stack", purpose: "Logging", reason: "Centralized log management" },
      { name: "Jaeger", purpose: "Tracing", reason: "Distributed tracing" },
      { name: "Sentry", purpose: "Error Tracking", reason: "Real-time error monitoring" },
    ],
    security: [
      { name: "OAuth 2.0", purpose: "Authentication", reason: "Industry standard" },
      { name: "JWT", purpose: "Tokens", reason: "Stateless authentication" },
      { name: "AWS WAF", purpose: "Firewall", reason: "DDoS protection" },
      { name: "HashiCorp Vault", purpose: "Secrets", reason: "Secure secret management" },
      { name: "Let's Encrypt", purpose: "SSL/TLS", reason: "Free certificates" },
    ],
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Technology Stack
          </CardTitle>
          <CardDescription>Comprehensive technology choices and justifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {Object.entries(techStack).map(([category, technologies]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2">
                <Badge variant="secondary">{category.replace(/([A-Z])/g, " $1").trim()}</Badge>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {technologies.map((tech) => (
                  <Card key={tech.name} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{tech.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {tech.purpose}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{tech.reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Technology Decision Criteria */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Technology Selection Criteria</h3>
            <Card className="bg-primary/5 border-primary">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Primary Factors</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Performance and scalability requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Team expertise and learning curve</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Community support and ecosystem maturity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Long-term maintenance and support</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Secondary Factors</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Cost efficiency and licensing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Integration capabilities with existing tools</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Security features and compliance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Vendor lock-in considerations</span>
                      </li>
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
