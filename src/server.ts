import { createServer } from "node:http";
import { runScenario } from "./simulator.js";
import { assertSimulationOnly } from "./policy.js";

const server = createServer(async (req, res) => {
  res.setHeader("content-type", "application/json");
  if (req.method === "GET" && req.url === "/health") {
    return res.end(JSON.stringify({ status: "ok", seal: "⟐:IMMORTAL_OS:GENOME_EDITING_DIGITAL_TWIN:V42" }));
  }
  if (req.method === "POST" && req.url === "/v1/genome-sim/scenarios/run") {
    let body = "";
    for await (const chunk of req) body += chunk;
    try {
      const scenario = JSON.parse(body);
      assertSimulationOnly(scenario);
      return res.end(JSON.stringify(runScenario(scenario)));
    } catch (error) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: error instanceof Error ? error.message : "Invalid request" }));
    }
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, "127.0.0.1", () => console.log("Genome Twin listening on http://127.0.0.1:3000"));
