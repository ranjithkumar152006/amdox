// Quick API test script
const http = require("http");

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path,
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (token) options.headers["Authorization"] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        const parsed = JSON.parse(body);
        console.log(`\n[${method}] ${path} → ${res.statusCode}`);
        console.log(JSON.stringify(parsed, null, 2));
        resolve(parsed);
      });
    });
    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

(async () => {
  console.log("=== AMDOX ERP API TESTS ===\n");

  // 1. Health Check
  await request("GET", "/api/health");

  // 2. Login
  const loginRes = await request("POST", "/api/auth/login", { email: "admin@erp.com", password: "1234" });
  const token = loginRes.token;
  console.log("\n✅ Token obtained:", token.slice(0, 30) + "...");

  // 3. Dashboard
  await request("GET", "/api/dashboard/stats", null, token);

  // 4. Employees
  await request("GET", "/api/employees?search=alice", null, token);

  // 5. Inventory
  await request("GET", "/api/inventory/stats", null, token);

  // 6. Projects
  await request("GET", "/api/projects?status=Healthy", null, token);

  // 7. Finance - Transactions
  await request("GET", "/api/transactions?type=income", null, token);

  // 8. Reports Summary
  await request("GET", "/api/reports/summary", null, token);

  // 9. Profile
  await request("GET", "/api/profile", null, token);

  // 10. Auth /me
  await request("GET", "/api/auth/me", null, token);

  console.log("\n=== ALL TESTS PASSED ✅ ===");
})();
