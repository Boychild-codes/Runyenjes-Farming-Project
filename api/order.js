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
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; background: #f4faf6; padding: 20px; color: #1a1f1c;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background: #0F3D2E; padding: 24px 28px;">
      <h1 style="color: white; margin: 0; font-size: 22px;">ShambaLink Harvest</h1>
      <p style="color: #c9a227; margin: 6px 0 0; font-size: 14px;">New Wholesale Order</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr>
          <td style="padding: 10px 0; color: #5c6b62; width: 160px;">Name / Business</td>
          <td style="padding: 10px 0; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #5c6b62;">Phone / WhatsApp</td>
          <td style="padding: 10px 0; font-weight: 600;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #5c6b62;">Product</td>
          <td style="padding: 10px 0; font-weight: 600;">${product}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #5c6b62;">Quantity</td>
          <td style="padding: 10px 0; font-weight: 600;">${quantity}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #5c6b62;">Delivery Location</td>
          <td style="padding: 10px 0; font-weight: 600;">${location}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #5c6b62;">Distance</td>
          <td style="padding: 10px 0; font-weight: 600;">${distance || "Not provided"} km</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #5c6b62;">Transport Cost</td>
          <td style="padding: 10px 0; font-weight: 600; color: #0F3D2E;">${transportCost || "Not calculated"}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #5c6b62; vertical-align: top;">Notes</td>
          <td style="padding: 10px 0;">${notes || "None"}</td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="background: #f4faf6; padding: 16px 28px; font-size: 13px; color: #5c6b62; border-top: 1px solid #e5e7eb;">
      Received on ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}
    </div>
  </div>
</body>
</html>
    `;

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
        html: emailBody
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