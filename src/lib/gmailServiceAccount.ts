import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Service account configuration for Domain-Wide Delegation
export class GmailServiceAccount {
  private jwtClient: JWT;
  private gmail: any;

  constructor() {
    // Initialize JWT client with service account credentials
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not configured');
    }

    // Handle different private key formats
    let formattedKey = privateKey;
    if (privateKey.includes('\\n')) {
      formattedKey = privateKey.replace(/\\n/g, '\n');
    } else if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      // If it's a JSON string, try to parse it
      try {
        const keyData = JSON.parse(privateKey);
        formattedKey = keyData.private_key || privateKey;
      } catch {
        formattedKey = privateKey;
      }
    }

    this.jwtClient = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: formattedKey,
      scopes: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.settings.basic'
      ],
      subject: 'admin@bridge2us.app' // Impersonate this user
    });

    this.gmail = google.gmail({ version: 'v1', auth: this.jwtClient });
  }

  /**
   * Send email using service account with domain-wide delegation
   */
  async sendEmail(emailData: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
    from?: 'NOREPLY' | 'NOTIFICATIONS' | 'SUPPORT' | 'ADMIN';
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Ensure we're authenticated
      await this.jwtClient.authorize();

      // Determine the appropriate sender based on email type
      const senderMap = {
        'NOREPLY': 'NOREPLY@bridge2us.app',
        'NOTIFICATIONS': 'notifications@bridge2us.app', 
        'SUPPORT': 'support@bridge2us.app',
        'ADMIN': 'admin@bridge2us.app'
      };

      const fromEmail = senderMap[emailData.from || 'NOREPLY'];
      const replyToEmail = emailData.replyTo || 'support@bridge2us.app';

      // Build email content
      let contentType = 'text/plain; charset=UTF-8';
      let content = emailData.text || '';
      
      if (emailData.html) {
        contentType = 'text/html; charset=UTF-8';
        content = emailData.html;
      }

      const raw = [
        `From: "Bridge2Us" <${fromEmail}>`,
        `To: ${emailData.to}`,
        `Reply-To: ${replyToEmail}`,
        `Subject: ${emailData.subject}`,
        'MIME-Version: 1.0',
        `Content-Type: ${contentType}`,
        '',
        content,
      ].join('\r\n');

      // Encode the email in base64url format
      const encodedEmail = Buffer.from(raw)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');

      // Send the email
      await this.gmail.users.messages.send({
        userId: 'admin@bridge2us.app',
        requestBody: { raw: encodedEmail }
      });

      return { success: true };
    } catch (error) {
      console.error('Service account email sending error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Check if the send-as alias is properly configured
   */
  async checkSendAsAlias(): Promise<{ exists: boolean; verified: boolean; error?: string }> {
    try {
      await this.jwtClient.authorize();

      const response = await this.gmail.users.settings.sendAs.list({
        userId: 'admin@bridge2us.app'
      });

      const sendAsList = response.data.sendAs || [];
      const adminAlias = sendAsList.find(
        (alias: any) => alias.sendAsEmail === 'admin@bridge2us.app'
      );

      if (!adminAlias) {
        return { exists: false, verified: false };
      }

      return { 
        exists: true, 
        verified: adminAlias.verificationStatus === 'accepted' 
      };
    } catch (error) {
      console.error('Error checking send-as alias:', error);
      return { 
        exists: false, 
        verified: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Create or update send-as alias (requires gmail.settings.basic scope)
   */
  async setupSendAsAlias(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.jwtClient.authorize();

      // First check if alias already exists
      const aliasCheck = await this.checkSendAsAlias();
      
      if (aliasCheck.exists && aliasCheck.verified) {
        return { success: true }; // Already set up
      }

      // Create the send-as alias
      await this.gmail.users.settings.sendAs.create({
        userId: 'admin@bridge2us.app',
        requestBody: {
          sendAsEmail: 'admin@bridge2us.app',
          displayName: 'Bridge2Us',
          treatAsAlias: true
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error setting up send-as alias:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// Export a singleton instance
export const gmailServiceAccount = new GmailServiceAccount();
