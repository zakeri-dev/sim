#!/usr/bin/env node

/**
 * Port Changer Script for SimStudio
 * این اسکریپت پورت‌های پیش‌فرض را تغییر می‌دهد
 */

const fs = require("fs");
const path = require("path");

// Default port configuration
const DEFAULT_PORTS = {
  simstudio: 3000,
  realtime: 3002,
  db: 5432,
  redis: 6379,
};

// Custom port configuration (change these as needed)
const CUSTOM_PORTS = {
  simstudio: 8081, // Change from 3000 to 8081
  realtime: 8080, // Change from 3002 to 8080
  db: 5432, // Keep database port unchanged
  redis: 6379, // Keep Redis port unchanged
};

// Files to modify (relative to project root)
const FILES_TO_MODIFY = ["../docker-compose.local.yml"];

// Backup directory
const BACKUP_DIR = "backup-before-port-change";

async function createBackup() {
  console.log("📦 Creating backup of current configuration...");

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
  fs.mkdirSync(backupPath, { recursive: true });

  for (const file of FILES_TO_MODIFY) {
    if (fs.existsSync(file)) {
      const backupFile = path.join(backupPath, file.replace(/\//g, "_"));
      fs.copyFileSync(file, backupFile);
      console.log(`✅ Backed up: ${file}`);
    }
  }

  console.log(`📁 Backup created in: ${backupPath}`);
  return backupPath;
}

function updateDockerCompose() {
  console.log("🐳 Updating docker-compose.local.yml ports...");

  const filePath = "../docker-compose.local.yml";
  if (!fs.existsSync(filePath)) {
    console.log("⚠️  docker-compose.local.yml not found, skipping...");
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let updated = false;

  // Update simstudio service ports
  if (content.includes("simstudio:")) {
    const simstudioPortPattern =
      /(simstudio:\s*\n\s*[^#]*?ports:\s*\n\s*[^#]*?)(\d+):(\d+)/;
    const simstudioMatch = content.match(simstudioPortPattern);

    if (simstudioMatch) {
      const before = simstudioMatch[1];
      const oldHostPort = simstudioMatch[2];
      const containerPort = simstudioMatch[3];

      if (oldHostPort !== CUSTOM_PORTS.simstudio.toString()) {
        const newPortMapping = `${CUSTOM_PORTS.simstudio}:${containerPort}`;
        content = content.replace(
          simstudioPortPattern,
          `${before}${newPortMapping}`
        );
        console.log(
          `✅ Updated simstudio ports: ${oldHostPort}:${containerPort} → ${newPortMapping}`
        );
        updated = true;
      } else {
        console.log(
          `ℹ️  Simstudio ports already set to: ${CUSTOM_PORTS.simstudio}:${containerPort}`
        );
      }
    }
  }

  // Update realtime service ports
  if (content.includes("realtime:")) {
    const realtimePortPattern =
      /(realtime:\s*\n\s*[^#]*?ports:\s*\n\s*[^#]*?)(\d+):(\d+)/;
    const realtimeMatch = content.match(realtimePortPattern);

    if (realtimeMatch) {
      const before = realtimeMatch[1];
      const oldHostPort = realtimeMatch[2];
      const containerPort = realtimeMatch[3];

      if (oldHostPort !== CUSTOM_PORTS.realtime.toString()) {
        const newPortMapping = `${CUSTOM_PORTS.realtime}:${containerPort}`;
        content = content.replace(
          realtimePortPattern,
          `${before}${newPortMapping}`
        );
        console.log(
          `✅ Updated realtime ports: ${oldHostPort}:${containerPort} → ${newPortMapping}`
        );
        updated = true;
      } else {
        console.log(
          `ℹ️  Realtime ports already set to: ${CUSTOM_PORTS.realtime}:${containerPort}`
        );
      }
    }
  }

  // Update environment variables for new URLs
  if (content.includes("simstudio:")) {
    // Update NEXT_PUBLIC_APP_URL
    const appUrlPattern = /(NEXT_PUBLIC_APP_URL:\s*["'])([^"']*)(["'])/;
    const appUrlMatch = content.match(appUrlPattern);

    if (appUrlMatch) {
      const oldUrl = appUrlMatch[2];
      const newUrl = oldUrl.replace(/:\d+/, `:${CUSTOM_PORTS.simstudio}`);

      if (oldUrl !== newUrl) {
        content = content.replace(appUrlPattern, `$1${newUrl}$3`);
        console.log(`✅ Updated NEXT_PUBLIC_APP_URL: ${oldUrl} → ${newUrl}`);
        updated = true;
      }
    }

    // Update BETTER_AUTH_URL
    const authUrlPattern = /(BETTER_AUTH_URL:\s*["'])([^"']*)(["'])/;
    const authUrlMatch = content.match(authUrlPattern);

    if (authUrlMatch) {
      const oldUrl = authUrlMatch[2];
      const newUrl = oldUrl.replace(/:\d+/, `:${CUSTOM_PORTS.simstudio}`);

      if (oldUrl !== newUrl) {
        content = content.replace(authUrlPattern, `$1${newUrl}$3`);
        console.log(`✅ Updated BETTER_AUTH_URL: ${oldUrl} → ${newUrl}`);
        updated = true;
      }
    }
  }

  // Update NEXT_PUBLIC_SOCKET_URL for realtime service
  if (content.includes("realtime:")) {
    const socketUrlPattern = /(NEXT_PUBLIC_SOCKET_URL:\s*["'])([^"']*)(["'])/;
    const socketUrlMatch = content.match(socketUrlPattern);

    if (socketUrlMatch) {
      const oldUrl = socketUrlMatch[2];
      const newUrl = oldUrl.replace(/:\d+/, `:${CUSTOM_PORTS.realtime}`);

      if (oldUrl !== newUrl) {
        content = content.replace(socketUrlPattern, `$1${newUrl}$3`);
        console.log(`✅ Updated NEXT_PUBLIC_SOCKET_URL: ${oldUrl} → ${newUrl}`);
        updated = true;
      }
    }
  }

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log("✅ docker-compose.local.yml updated successfully");
    return true;
  } else {
    console.log("ℹ️  No port changes needed in docker-compose.local.yml");
    return false;
  }
}

function generatePortConfig() {
  console.log("📝 Generating port configuration file...");

  const configContent = `# Port Configuration for SimStudio
# Generated by Port Changer Script

# Default Ports (Original)
DEFAULT_SIMSTUDIO_PORT=${DEFAULT_PORTS.simstudio}
DEFAULT_REALTIME_PORT=${DEFAULT_PORTS.realtime}
DEFAULT_DB_PORT=${DEFAULT_PORTS.db}
DEFAULT_REDIS_PORT=${DEFAULT_PORTS.redis}

# Custom Ports (New)
CUSTOM_SIMSTUDIO_PORT=${CUSTOM_PORTS.simstudio}
CUSTOM_REALTIME_PORT=${CUSTOM_PORTS.realtime}
CUSTOM_DB_PORT=${CUSTOM_PORTS.db}
CUSTOM_REDIS_PORT=${CUSTOM_PORTS.redis}

# Service URLs
SIMSTUDIO_URL=http://localhost:${CUSTOM_PORTS.simstudio}
REALTIME_URL=http://localhost:${CUSTOM_PORTS.realtime}
DB_URL=postgresql://postgres:postgres@localhost:${CUSTOM_PORTS.db}/simstudio
REDIS_URL=redis://localhost:${CUSTOM_PORTS.redis}

# Usage Instructions:
# 1. Restart Docker Compose services
# 2. Access SimStudio at: http://localhost:${CUSTOM_PORTS.simstudio}
# 3. Socket connection at: http://localhost:${CUSTOM_PORTS.realtime}
# 4. If needed, restore from backup using the backup directory
`;

  fs.writeFileSync("port-config.env", configContent);
  console.log("✅ Port configuration file generated: port-config.env");
}

function checkPortAvailability() {
  console.log("🔍 Checking port availability...");

  const net = require("net");
  const portsToCheck = [CUSTOM_PORTS.simstudio, CUSTOM_PORTS.realtime];
  const unavailablePorts = [];

  for (const port of portsToCheck) {
    const server = net.createServer();

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        unavailablePorts.push(port);
        console.log(`⚠️  Port ${port} is already in use`);
      }
    });

    server.once("listening", () => {
      server.close();
      console.log(`✅ Port ${port} is available`);
    });

    server.listen(port);
  }

  if (unavailablePorts.length > 0) {
    console.log(
      `\n🚨 Warning: Ports ${unavailablePorts.join(", ")} are already in use!`
    );
    console.log(
      "   You may need to stop other services or choose different ports."
    );
  }

  return unavailablePorts.length === 0;
}

async function runPortChange() {
  console.log("🚀 Starting Port Change for SimStudio...\n");

  try {
    // Check port availability
    const portsAvailable = checkPortAvailability();

    if (!portsAvailable) {
      console.log("\n⚠️  Some ports are not available. Continuing anyway...");
    }

    // Create backup
    const backupPath = await createBackup();

    // Update files
    const results = {
      dockerCompose: updateDockerCompose(),
    };

    // Generate port config
    generatePortConfig();

    // Summary
    console.log("\n📊 Port Change Summary:");
    console.log(
      `✅ Docker Compose: ${results.dockerCompose ? "Updated" : "Skipped"}`
    );

    console.log("\n🎯 Port Change completed successfully!");
    console.log(`📁 Backup created in: ${backupPath}`);
    console.log("📝 Port config generated in: port-config.env");

    console.log("\n🔧 Next steps:");
    console.log("1. Review the changes in the updated files");
    console.log("2. Restart Docker Compose services");
    console.log(
      `3. Access SimStudio at: http://localhost:${CUSTOM_PORTS.simstudio}`
    );
    console.log(
      `4. Socket connection at: http://localhost:${CUSTOM_PORTS.realtime}`
    );
    console.log("5. If needed, restore from backup using the backup directory");

    console.log("\n📋 New Port Configuration:");
    console.log(
      `   SimStudio: ${DEFAULT_PORTS.simstudio} → ${CUSTOM_PORTS.simstudio}`
    );
    console.log(
      `   Realtime:  ${DEFAULT_PORTS.realtime} → ${CUSTOM_PORTS.realtime}`
    );
    console.log(
      `   Database:  ${DEFAULT_PORTS.db} → ${CUSTOM_PORTS.db} (unchanged)`
    );
    console.log(
      `   Redis:     ${DEFAULT_PORTS.redis} → ${CUSTOM_PORTS.redis} (unchanged)`
    );
  } catch (error) {
    console.error("❌ Port change failed:", error.message);
    process.exit(1);
  }
}

// Run port change if this file is executed directly
if (require.main === module) {
  runPortChange().catch(console.error);
}

module.exports = { runPortChange };
