// End-to-end smoke test. Start the server first: npm start
const B = process.env.BASE || "http://localhost:5000";
const call = async (m, p, body) => (await fetch(B + p, { method: m, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined })).json();
const ok = (name, cond) => console.log(cond ? "PASS" : "FAIL", name);
(async () => {
  console.log("Health:", await call("GET", "/health"));
  const c = await call("POST", "/chat", { userId: "test", message: "Should I take the job offer in Bengaluru or stay at my current company?" });
  ok("1. chat replies", !!c.reply);
  ok("2. decision detected", !!c.decision);
  const a = await call("POST", `/decisions/${c.decision.id}/approve`, { chosen: "Take the offer", reason: "Better growth", expectedOutcome: "Faster learning" });
  ok("3. approval creates tasks", a.tasks.length > 0);
  const c2 = await call("POST", "/chat", { userId: "test", message: "What did I decide about my job?" });
  ok("4. memory recalled on return", c2.memoriesUsed.length > 0);
  const mems = await call("GET", "/memories?userId=test");
  await call("DELETE", `/memories/${mems[0].id}`);
  const after = await call("GET", "/memories?userId=test");
  ok("5. memory deleted", after.length === mems.length - 1);
  console.log("Trace of last chat:", JSON.stringify(c2.trace));
})();
