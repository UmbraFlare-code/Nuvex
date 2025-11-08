import os from "os";

export async function GET() {
  const mem = process.memoryUsage();
  const data = {
    rss: mem.rss,
    heapUsed: mem.heapUsed,
    load: os.loadavg(),
    uptime: process.uptime(),
    timestamp: Date.now()
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
