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
  welcome: (userName: string, verificationLink?: string) => ({
    subject: 'Welcome to Bridge2Us! 🎉',
    from: 'NOTIFICATIONS' as const,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Bridge2Us!</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Your journey to staying connected begins here</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hi ${userName},</p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Welcome to Bridge2Us! We're excited to help you stay connected with your partner across any distance. 
            Whether you're in a long-distance relationship or just want to strengthen your bond, we're here to help.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #333; margin-top: 0;">Here's what you can do with Bridge2Us:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>📅 <strong>Sync your calendars</strong> and coordinate schedules seamlessly</li>
              <li>🌍 <strong>Bridge time zones</strong> with real-time displays</li>
              <li>🎵 <strong>Share music experiences</strong> with Spotify integration</li>
              <li>📝 <strong>Keep a shared journal</strong> of your journey together</li>
              <li>📍 <strong>Plan meetups</strong> with countdown timers</li>
              <li>💕 <strong>Stay connected</strong> no matter the distance</li>
            </ul>
          </div>
          
          ${verificationLink ? `
          <div style="background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
            <p style="color: #2e7d32; margin: 0 0 15px 0; font-weight: bold;">🔐 Verify Your Email Address</p>
            <p style="color: #2e7d32; margin: 0 0 20px 0;">Please verify your email address to complete your account setup:</p>
            <a href="${verificationLink}" style="background: #4caf50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.bridge2us.app/dashboard" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
              🚀 Get Started
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
Welcome to Bridge2Us!

Hi ${userName},

Welcome to Bridge2Us! We're excited to help you stay connected with your partner across any distance. 
Whether you're in a long-distance relationship or just want to strengthen your bond, we're here to help.

Here's what you can do with Bridge2Us:
- Sync your calendars and coordinate schedules seamlessly
- Bridge time zones with real-time displays
- Share music experiences with Spotify integration
- Keep a shared journal of your journey together
- Plan meetups with countdown timers
- Stay connected no matter the distance

${verificationLink ? `
🔐 Verify Your Email Address
Please verify your email address to complete your account setup:
${verificationLink}
` : ''}

Ready to get started? Visit your dashboard: https://www.bridge2us.app/dashboard

Best regards,
The Bridge2Us Team
support@bridge2us.app
    `
  }),

  partnerInvitation: (inviterName: string, invitationLink: string, inviterEmail?: string) => {
    // Extract first name from inviterName
    const firstName = inviterName.split(' ')[0];
    
    return {
      subject: `${firstName} has invited you to create an account!`,
      from: 'NOTIFICATIONS' as const,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Hello! 👋</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">${firstName} wants to connect with you</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Hello!</p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              <strong>${inviterName}</strong> has invited you to join Bridge2Us, a platform designed to help couples stay connected across any distance.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin-top: 0;">Key Features:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>📅 <strong>Smart Calendar Sync</strong> - Coordinate your schedules seamlessly</li>
                <li>🌍 <strong>Timezone Bridge</strong> - See both your times at a glance</li>
                <li>🎵 <strong>Shared Music Experience</strong> - Connect through Spotify integration</li>
                <li>📝 <strong>Shared Journal</strong> - Keep your memories together</li>
                <li>📍 <strong>Meetup Planning</strong> - Countdown to your next reunion</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationLink}" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                Create Your Account
              </a>
            </div>
            
            <div style="background: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <p style="color: #1976d2; margin: 0; font-size: 14px;">
                🔒 <strong>Secure Invitation:</strong> This link will automatically connect your accounts when you sign up. 
                Expires in 7 days.
              </p>
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
Hello!

${inviterName} has invited you to join Bridge2Us, a platform designed to help couples stay connected across any distance.

Key Features:
- Smart Calendar Sync - Coordinate your schedules seamlessly
- Timezone Bridge - See both your times at a glance  
- Shared Music Experience - Connect through Spotify integration
- Shared Journal - Keep your memories together
- Meetup Planning - Countdown to your next reunion

Create your account: ${invitationLink}

🔒 Secure Invitation: This link will automatically connect your accounts when you sign up. Expires in 7 days.

Best regards,
The Bridge2Us Team
support@bridge2us.app
      `
    };
  },

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
