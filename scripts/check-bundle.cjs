const fs = require("node:fs"), path = require("node:path"), assert = require("node:assert/strict");
const total = fs.readdirSync("dist/assets").filter(name => name.endsWith(".js")).reduce((sum, name) => sum + fs.statSync(path.join("dist/assets", name)).size, 0);
assert.ok(total <= 450 * 1024, `JavaScript bundle is ${total} bytes; budget is 450 KiB`);
console.log(`JavaScript bundle: ${total} bytes / 460800-byte budget`);
