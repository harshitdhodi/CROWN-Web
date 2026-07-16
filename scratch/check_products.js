async function test() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";
    console.log("API URL:", apiBase);
    const res = await fetch(`${apiBase}/api/data/our_products`);
    if (res.ok) {
      const json = await res.json();
      console.log("Products Count:", json.data?.length);
      if (json.data && json.data.length > 0) {
        console.log("Sample Product:", JSON.stringify(json.data[0], null, 2));
      }
    } else {
      console.log("Response failed with status:", res.status);
    }
  } catch (err) {
    console.error("Error fetching:", err);
  }
}

test();
