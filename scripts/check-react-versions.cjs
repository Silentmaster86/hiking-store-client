const assert = require("node:assert/strict");
const react = require("react/package.json").version;
const dom = require("react-dom/package.json").version;
assert.equal(react, dom, `React/runtime mismatch: react ${react}, react-dom ${dom}. Update them together.`);
console.log(`React and React DOM match: ${react}`);
