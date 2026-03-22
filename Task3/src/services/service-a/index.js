require("./tracing");

const express = require("express");
const http = require("http");

const app = express();

const serviceBUrl = process.env.SERVICE_B_URL || "http://service-b:8080";

function fetchServiceB() {
  return new Promise((resolve, reject) => {
    const url = new URL(serviceBUrl);
    const port = url.port ? Number(url.port) : url.protocol === "https:" ? 443 : 80;
    const req = http.request(
      {
        hostname: url.hostname,
        port,
        path: url.pathname || "/",
        method: "GET",
      },
      (res) => {
        res.resume();
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`service-b status ${res.statusCode}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

app.get("/", async (req, res) => {
  try {
    await fetchServiceB();
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

app.listen(8080, "0.0.0.0");
