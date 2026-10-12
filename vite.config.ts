import {defineConfig} from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({plugins:[react(),{name:"docs-licenses",configureServer(server){server.middlewares.use("/licenses.txt",async (_req,res,next)=>{try{const {licenseText}=await import("./scripts/docs-notices.mjs");res.setHeader("Content-Type","text/plain; charset=utf-8");res.end(licenseText)}catch(error){next(error)}})}}],test:{environment:"jsdom",setupFiles:["./tests/setup.ts"]}});
