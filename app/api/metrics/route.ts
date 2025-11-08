import os from "os";

export async function GET() {
  const data = {
    memory: process.memoryUsage(),
    load: os.loadavg(),
    uptime: process.uptime(),
    platform: process.platform,
    timestamp: Date.now()
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
