import {defineConfig} from "vitest/config";
import react from "@vitejs/plugin-react";
import {fileURLToPath} from "node:url";
// The site imports the package build from dist/ while developing. Keep Vite's
// own output elsewhere so its watcher does not ignore those package modules.
const packageBuildDir=fileURLToPath(new URL("./dist/",import.meta.url));
let packageReload:ReturnType<typeof setTimeout>|undefined;
export default defineConfig({plugins:[react(),{name:"docs-package-build-reload",hotUpdate({file,server}){
 if(!file.startsWith(packageBuildDir))return;
 // A package build rewrites many modules; reload once after the write burst.
 clearTimeout(packageReload);
 packageReload=setTimeout(()=>server.ws.send({type:"full-reload"}),800);
 return [];
}},{name:"docs-licenses",configureServer(server){server.middlewares.use("/licenses.txt",async (_req,res,next)=>{try{const {licenseText}=await import("./scripts/docs-notices.mjs");res.setHeader("Content-Type","text/plain; charset=utf-8");res.end(licenseText)}catch(error){next(error)}})}}],build:{outDir:"site-dist"},test:{environment:"jsdom",setupFiles:["./tests/setup.ts"],maxWorkers:2,testTimeout:15000}});
