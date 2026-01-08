// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

const config = defineCloudflareConfig({
});

// @ts-ignore - 'build' property is valid in OpenNextConfig but generic definition might hide it
config.build = {
    external: ['stripe'],
};

export default config;
