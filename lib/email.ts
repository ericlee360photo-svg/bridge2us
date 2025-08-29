export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: 'NOREPLY' | 'NOTIFICATIONS' | 'SUPPORT' | 'ADMIN';
}

export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to send email' };
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Network error while sending email' };
  }
}

// Pre-built email templates
export const emailTemplates = {
  welcome: (userName: string, verificationUrl?: string) => ({
    subject: `Welcome to Bridge2Us, ${userName}!`,
    text: `Welcome to Bridge2Us, ${userName}!\n\nWe're excited to have you join our community.\n\n${verificationUrl ? `Please verify your email by clicking this link: ${verificationUrl}` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Bridge2Us, ${userName}!</h1>
        <p>We're excited to have you join our community.</p>
        ${verificationUrl ? `<p><a href="${verificationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Your Email</a></p>` : ''}
        <p>Best regards,<br>The Bridge2Us Team</p>
      </div>
    `,
    from: 'NOREPLY' as const
  }),
  
  partnerInvitation: (inviterName: string, invitationUrl: string) => ({
    subject: `${inviterName} invited you to Bridge2Us!`,
    text: `${inviterName} has invited you to join Bridge2Us!\n\nClick this link to accept the invitation: ${invitationUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">You've been invited to Bridge2Us!</h1>
        <p>${inviterName} has invited you to join our community.</p>
        <p><a href="${invitationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Invitation</a></p>
        <p>Best regards,<br>The Bridge2Us Team</p>
      </div>
    `,
    from: 'NOREPLY' as const
  }),

  meetupReminder: (partnerName: string, meetupTitle: string, meetupDate: string, countdown: string) => ({
    subject: `Meetup Reminder: ${meetupTitle} 🗓️`,
    from: 'NOREPLY' as const,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Meetup Reminder 🗓️</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Your special time is coming up!</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi there,</p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Your meetup with <strong>${partnerName}</strong> is coming up! Get ready for your special time together.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ec4899;">
            <h2 style="margin-top: 0; color: #333; font-size: 20px;">${meetupTitle}</h2>
            <p style="color: #666; margin: 10px 0;"><strong>📅 Date:</strong> ${meetupDate}</p>
            <p style="color: #666; margin: 10px 0;"><strong>⏰ Time until meetup:</strong> ${countdown}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Make sure to check your calendar and prepare for your special time together! 
            Don't forget to sync your schedules and check the time zones.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.bridge2us.app/dashboard" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              📊 View Dashboard
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 25px; margin-top: 30px;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>The Bridge2Us Team</strong><br>
              <a href="mailto:support@bridge2us.app" style="color: #ec4899;">support@bridge2us.app</a>
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
Meetup Reminder 🗓️

Hi there,

Your meetup with ${partnerName} is coming up! Get ready for your special time together.

${meetupTitle}
📅 Date: ${meetupDate}
⏰ Time until meetup: ${countdown}

Make sure to check your calendar and prepare for your special time together! 
Don't forget to sync your schedules and check the time zones.

View your dashboard: https://www.bridge2us.app/dashboard

Best regards,
The Bridge2Us Team
support@bridge2us.app
    `
  }),

  emailVerification: (userName: string, verificationLink: string) => ({
    subject: 'Verify Your Email Address - Bridge2Us 🔐',
    from: 'NOREPLY' as const,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #4caf50, #45a049); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email 🔐</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Complete your Bridge2Us account setup</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi ${userName},</p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thanks for signing up for Bridge2Us! To complete your account setup and start connecting with your partner, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background: #4caf50; color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              ✅ Verify Email Address
            </a>
          </div>
          
          <div style="background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="color: #2e7d32; margin: 0; font-size: 14px;">
              🔒 <strong>Security Note:</strong> This verification link will expire in 24 hours for your security. 
              If you didn't create a Bridge2Us account, you can safely ignore this email.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Once verified, you'll be able to:
          </p>
          
          <ul style="color: #666; line-height: 1.8; margin-bottom: 25px;">
            <li>📅 Sync your calendars and coordinate schedules</li>
            <li>🌍 Bridge time zones with real-time displays</li>
            <li>🎵 Share music experiences with Spotify integration</li>
            <li>📝 Keep a shared journal of your journey</li>
            <li>📍 Plan meetups with countdown timers</li>
          </ul>
          
          <div style="border-top: 1px solid #eee; padding-top: 25px; margin-top: 30px;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>The Bridge2Us Team</strong><br>
              <a href="mailto:support@bridge2us.app" style="color: #ec4899;">support@bridge2us.app</a>
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
Verify Your Email Address - Bridge2Us 🔐

Hi ${userName},

Thanks for signing up for Bridge2Us! To complete your account setup and start connecting with your partner, 
please verify your email address by clicking the link below.

Verify your email: ${verificationLink}

🔒 Security Note: This verification link will expire in 24 hours for your security. 
If you didn't create a Bridge2Us account, you can safely ignore this email.

Once verified, you'll be able to:
- Sync your calendars and coordinate schedules
- Bridge time zones with real-time displays
- Share music experiences with Spotify integration
- Keep a shared journal of your journey
- Plan meetups with countdown timers

Best regards,
The Bridge2Us Team
support@bridge2us.app
    `
  }),

  passwordReset: (userName: string, resetLink: string) => ({
    subject: 'Reset Your Password - Bridge2Us 🔑',
    from: 'SUPPORT' as const,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #ff9800, #f57c00); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password 🔑</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Secure your Bridge2Us account</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi ${userName},</p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            We received a request to reset your Bridge2Us password. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #ff9800; color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              🔑 Reset Password
            </a>
          </div>
          
          <div style="background: #fff3e0; border: 1px solid #ff9800; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="color: #e65100; margin: 0; font-size: 14px;">
              🔒 <strong>Security Note:</strong> This password reset link will expire in 1 hour for your security. 
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="background: #f5f5f5; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 12px; color: #666; word-break: break-all;">
            ${resetLink}
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 25px; margin-top: 30px;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>The Bridge2Us Team</strong><br>
              <a href="mailto:support@bridge2us.app" style="color: #ec4899;">support@bridge2us.app</a>
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
Reset Your Password - Bridge2Us 🔑

Hi ${userName},

We received a request to reset your Bridge2Us password. Click the link below to create a new password.

Reset your password: ${resetLink}

🔒 Security Note: This password reset link will expire in 1 hour for your security. 
If you didn't request a password reset, you can safely ignore this email.

If the link doesn't work, you can copy and paste this URL into your browser:
${resetLink}

Best regards,
The Bridge2Us Team
support@bridge2us.app
    `
  })
};
