import os from "os";

export async function GET() {
  const data = {
    memory: {
      rss: process.memoryUsage().rss,
      heap: process.memoryUsage().heapUsed,
    },
    cpuLoad: os.loadavg(),
    uptime: process.uptime(),
    timestamp: Date.now(),
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
