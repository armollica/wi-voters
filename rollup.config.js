import json from "rollup-plugin-json";

export default {
  entry: "src/index.js",
  format: "iife",
  plugins: [ json() ],
  dest: "bundle.js"
};