let lastTriggerAt = 0;

const triggerStaticRebuild = async (reason) => {
  const hookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
  if (!hookUrl) return;

  const now = Date.now();
  if (now - lastTriggerAt < 30000) return;
  lastTriggerAt = now;

  try {
    const response = await fetch(hookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trigger: reason }),
    });

    if (!response.ok) {
      console.error(`Netlify rebuild hook failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Netlify rebuild hook error:", error.message);
  }
};

module.exports = { triggerStaticRebuild };
