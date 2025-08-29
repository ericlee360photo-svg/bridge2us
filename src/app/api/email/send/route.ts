import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { gmailServiceAccount } from "@/lib/gmailServiceAccount";

const gmail = google.gmail("v1");

function b64url(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, text, html, from } = await req.json();

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and text or html" },
        { status: 400 }
      );
    }

    // Try service account first (Domain-Wide Delegation)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      console.log("Service account credentials found, attempting to send email...");
      try {
        const result = await gmailServiceAccount.sendEmail({
          to,
          subject,
          text,
          html,
          from
        });

        if (result.success) {
          return NextResponse.json({ 
            success: true, 
            message: "Email sent successfully via service account",
            method: "service_account"
          });
        } else {
          console.error("Service account failed:", result.error);
          return NextResponse.json(
            { error: `Service account failed: ${result.error}` },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error("Service account error:", error);
        return NextResponse.json(
          { error: `Service account error: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    } else {
      console.log("Service account credentials not found");
    }

    // Fallback to OAuth2 method
    if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
      return NextResponse.json(
        { error: "No email authentication configured. Please set up either service account or OAuth2 credentials." },
        { status: 500 }
      );
    }

    const auth = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID!,
      process.env.GMAIL_CLIENT_SECRET!,
      process.env.GMAIL_REDIRECT_URI!
    );
    auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN! });

    // Optional: sanity-check alias is present & verified
    try {
      const sendAsList = await gmail.users.settings.sendAs.list({
        userId: "me",
        auth,
      });
      const ok = sendAsList.data.sendAs?.some(
        a => a.sendAsEmail === "admin@bridge2us.app" && a.verificationStatus === "accepted"
      );
      if (!ok) {
        return NextResponse.json(
          { error: "Alias not verified in Gmail" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error checking send-as aliases:", error);
      // Continue anyway - the send will fail if alias isn't verified
    }

    // Build email content
    let contentType = "text/plain; charset=UTF-8";
    let content = text;
    
    if (html) {
      contentType = "text/html; charset=UTF-8";
      content = html;
    }

    const raw = [
      `From: "Bridge2Us" <admin@bridge2us.app>`,
      `To: ${to}`,
      `Reply-To: support@bridge2us.app`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: ${contentType}`,
      "",
      content,
    ].join("\r\n");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: b64url(raw) },
      auth,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Email sent successfully via OAuth2",
      method: "oauth2"
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
