// Native fetch used

async function test() {
  try {
    const cmsBase = process.env.CMS_BASE_URL || "http://localhost:3012";
    console.log("CMS Base URL:", cmsBase);
    const res = await fetch(`${cmsBase}/api/data/banner?page=${encodeURIComponent('/')}`);
    if (res.ok) {
      const json = await res.json();
      console.log("Response JSON:", JSON.stringify(json, null, 2));
    } else {
      console.log("Response failed with status:", res.status);
    }
  } catch (err) {
    console.error("Error fetching:", err);
  }
}

test();
