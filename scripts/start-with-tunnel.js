/**
 * 一键启动 Cloudflare Tunnel + 自动更新 NEXTAUTH_URL
 *
 * 用法: node scripts/start-with-tunnel.js
 *
 * 功能:
 * 1. 启动 Next.js 开发服务器（如果未运行）
 * 2. 启动 Cloudflare Tunnel 并捕获生成的域名
 * 3. 自动更新 .env.local 中的 NEXTAUTH_URL
 * 4. 提示用户更新 GitHub OAuth 回调地址
 */

const { spawn, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const http = require("http");

const ENV_PATH = path.join(__dirname, "..", ".env.local");
const DEV_PORT = 3000;
const CLOUDFLARED_PATHS = [
  "C:\\Users\\86193\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe\\cloudflared.exe",
  "cloudflared.exe",
  "cloudflared",
];

function findCloudflared() {
  for (const p of CLOUDFLARED_PATHS) {
    try {
      execSync(`"${p}" --version`, { stdio: "ignore" });
      return p;
    } catch {
      continue;
    }
  }
  return null;
}

function readEnv() {
  try {
    return fs.readFileSync(ENV_PATH, "utf-8");
  } catch {
    return "";
  }
}

function writeEnv(content) {
  fs.writeFileSync(ENV_PATH, content, "utf-8");
}

function updateNexauthUrl(newUrl) {
  let env = readEnv();

  // Normalize URL (remove trailing slash)
  const cleanUrl = newUrl.replace(/\/+$/, "");

  if (env.includes("NEXTAUTH_URL=")) {
    env = env.replace(/^NEXTAUTH_URL=.*$/m, `NEXTAUTH_URL=${cleanUrl}`);
  } else {
    env += `\nNEXTAUTH_URL=${cleanUrl}`;
  }

  // Also update NEXTAUTH_URL_INTERNAL if it exists
  if (env.includes("NEXTAUTH_URL_INTERNAL=")) {
    env = env.replace(/^NEXTAUTH_URL_INTERNAL=.*$/m, `NEXTAUTH_URL_INTERNAL=${cleanUrl}`);
  }

  writeEnv(env);
  return cleanUrl;
}

function waitForServer(url, maxRetries = 30) {
  return new Promise((resolve, reject) => {
    let retries = 0;
    const check = () => {
      http
        .get(url, (res) => {
          resolve(true);
        })
        .on("error", () => {
          retries++;
          if (retries > maxRetries) {
            reject(new Error("Server did not start in time"));
          } else {
            setTimeout(check, 1000);
          }
        });
    };
    check();
  });
}

function startDevServer() {
  return new Promise((resolve, reject) => {
    // Check if already running
    http
      .get(`http://localhost:${DEV_PORT}`, () => {
        console.log("✓ Next.js 开发服务器已在运行");
        resolve(null);
      })
      .on("error", () => {
        console.log("正在启动 Next.js 开发服务器...");
        const proc = spawn("npm.cmd", ["run", "dev"], {
          cwd: path.join(__dirname, ".."),
          stdio: ["ignore", "pipe", "pipe"],
          detached: true,
          shell: true,
        });

        let started = false;
        const onData = (data) => {
          const text = data.toString();
          process.stdout.write(text);
          if (!started && (text.includes("ready") || text.includes("localhost"))) {
            started = true;
            // Give it a moment to stabilize
            setTimeout(() => resolve(proc), 2000);
          }
        };

        proc.stdout.on("data", onData);
        proc.stderr.on("data", onData);

        proc.on("error", reject);
        setTimeout(() => {
          if (!started) resolve(proc); // Resolve anyway
        }, 15000);
      });
  });
}

function startTunnel(cloudflaredPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n正在启动 Cloudflare Tunnel...`);

    const proc = spawn(cloudflaredPath, ["tunnel", "--url", `http://localhost:${DEV_PORT}`], {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });

    let tunnelUrl = null;

    const rl = readline.createInterface({
      input: proc.stderr,
    });

    rl.on("line", (line) => {
      // cloudflared outputs the URL to stderr
      const match = line.match(/https?:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
      if (match && !tunnelUrl) {
        tunnelUrl = match[0];
        console.log(`\n✓ Tunnel 域名: ${tunnelUrl}`);
        resolve(tunnelUrl);
      }
    });

    proc.stdout.on("data", (data) => {
      process.stdout.write(data);
    });

    proc.on("error", reject);

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!tunnelUrl) {
        reject(new Error("Tunnel did not start in time"));
      }
    }, 30000);
  });
}

async function main() {
  console.log("========================================");
  console.log("  一键启动 Cloudflare Tunnel");
  console.log("========================================\n");

  // 1. Find cloudflared
  const cfPath = findCloudflared();
  if (!cfPath) {
    console.error("✕ 未找到 cloudflared，请确保已安装");
    console.error("   安装: winget install Cloudflare.cloudflared");
    process.exit(1);
  }
  console.log(`✓ 找到 cloudflared: ${cfPath}`);

  try {
    // 2. Start dev server
    await startDevServer();

    // 3. Wait for server
    console.log(`\n等待 localhost:${DEV_PORT} 就绪...`);
    await waitForServer(`http://localhost:${DEV_PORT}`);
    console.log("✓ 开发服务器已就绪");

    // 4. Start tunnel and get URL
    const tunnelUrl = await startTunnel(cfPath);

    // 5. Update .env.local
    console.log("\n正在更新 NEXTAUTH_URL...");
    const cleanUrl = updateNexauthUrl(tunnelUrl);
    console.log(`✓ 已更新 .env.local → NEXTAUTH_URL=${cleanUrl}`);

    // 6. Final instructions
    console.log("\n========================================");
    console.log("  ✅ 全部就绪！");
    console.log(`  🌐 ${cleanUrl}`);
    console.log("========================================");
    console.log("\n⚠️  重要: 如果 GitHub OAuth 登录不好使，请到以下地址更新回调:");
    console.log(`   https://github.com/settings/developers`);
    console.log(`   将回调 URL 改为: ${cleanUrl}/api/auth/callback/github`);
    console.log("\n按 Ctrl+C 停止服务器和 Tunnel\n");

    // Keep running
    process.stdin.resume();
  } catch (error) {
    console.error(`\n✕ 错误: ${error.message}`);
    process.exit(1);
  }
}

main();
