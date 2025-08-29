import { gmailServiceAccount } from '../src/lib/gmailServiceAccount';

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: 'NOREPLY' | 'NOTIFICATIONS' | 'SUPPORT' | 'ADMIN';
}

export async function sendEmailServer(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await gmailServiceAccount.sendEmail(emailData);
    return result;
  } catch (error) {
    console.error('Server email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Export the same email templates
export { emailTemplates } from './email';
