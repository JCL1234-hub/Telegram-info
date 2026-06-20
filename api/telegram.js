import fetch from "node-fetch";

export default async function handler(req, res) {
  // শুধুমাত্র GET রিকোয়েস্ট অ্যালাউ করার জন্য
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed. Use GET request."
    });
  }

  const { username } = req.query;

  // ইউজারনেম চেক
  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username required"
    });
  }

  const apiKey = process.env.RAPIDAPI_KEY;

  // এপিআই কী সেট করা আছে কিনা চেক
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error: RAPIDAPI_KEY environment variable is not defined."
    });
  }

  try {
    // encodeURIComponent ব্যবহার করা হয়েছে যাতে স্পেশাল ক্যারেক্টার থাকলে ইউআরএল ভেঙে না যায়
    const response = await fetch(
      `https://telegram-user-info-api.p.rapidapi.com/api/scamtag/scammer?username=${encodeURIComponent(username)}`,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "telegram-user-info-api.p.rapidapi.com"
        }
      }
    );

    // রেসপন্স সাকসেসফুল কিনা চেক
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `RapidAPI returned status: ${response.status}`
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
