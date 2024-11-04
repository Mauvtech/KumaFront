// Function to update config.js in Vercel public directory
export async function updateConfig(newConfig) {
  try {
    // Validate the new config
    if (!newConfig || typeof newConfig !== "object") {
      throw new Error("Invalid config format");
    }

    // Convert config to string format
    const configString = `window.config = ${JSON.stringify(
      newConfig,
      null,
      2
    )};`;

    // For Vercel deployment, write to /public directory
    const fs = require("fs").promises;
    const path = require("path");

    // Ensure we're writing to the public directory
    const configPath = path.join(process.cwd(), "public", "config.js");

    // Write the new config
    await fs.writeFile(configPath, configString, "utf8");

    // Verify the file was written
    const verification = await fs.readFile(configPath, "utf8");

    if (verification !== configString) {
      throw new Error("Config verification failed");
    }

    return {
      success: true,
      message: "Config updated successfully",
      path: configPath,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.stack,
    };
  }
}

// Example usage:
const newConfig = {
  apiUrl: process.env.REACT_APP_API_URL,
  environment: "production",
  features: {
    featureA: true,
    featureB: false,
  },
};

// Update the config
const result = await updateConfig(newConfig);
console.log(result);
