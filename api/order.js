export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      phone,
      product,
      quantity,
      location,
      distance,
      notes,
      transportCost
    } = req.body;

    // Basic validation
    if (!name || !phone || !product || !quantity || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const emailBody = `
New Wholesale Order - ShambaLink Harvest

Name / Business: ${name}
Phone / WhatsApp: ${phone}
Product: ${product}
Quantity: ${quantity}
Delivery Location: ${location}
Distance: ${distance || "Not provided"} km
Estimated Transport: ${transportCost || "Not calculated"}

Additional Notes:
${notes || "None"}

---
Received on: ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}
    `.trim();

    // Send email using Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "ShambaLink Orders <onboarding@resend.dev>",
        to: ["stephenjiru@gmail.com"],
        subject: `New Order: ${product} - ${name}`,
        text: emailBody
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);
      return res.status(500).json({ error: "Failed to send email", details: data });
    }

    return res.status(200).json({ success: true, message: "Order received successfully" });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}