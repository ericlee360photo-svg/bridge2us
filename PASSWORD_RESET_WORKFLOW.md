# Bridge2Us Password Reset Workflow

## Overview

Bridge2Us now includes a comprehensive password reset workflow that allows users to securely reset their passwords through multiple access points:

1. **Standalone Pages**: `/forgot-password` and `/reset-password`
2. **User Settings**: Integrated into the dashboard settings modal
3. **Sign-in Page**: Link to forgot password page

## Features

### 🔐 Security Features
- **1-hour token expiration** for security
- **Secure token generation** using crypto.randomBytes
- **Password confirmation validation** to prevent typos
- **Minimum 8-character password requirement**
- **Token deletion after use** to prevent reuse
- **No user enumeration** (same response for existing/non-existing emails)
- **Professional email from support@bridge2us.app**

### 📧 Email Integration
- **Domain-Wide Delegation (DWD)** for automated sending
- **Multiple email aliases**:
  - `NOREPLY@bridge2us.app` - General notifications
  - `notifications@bridge2us.app` - Welcome emails
  - `support@bridge2us.app` - Password reset, verification
  - `admin@bridge2us.app` - Administrative emails
- **Professional email templates** with HTML and plain text
- **Fallback to OAuth2** if DWD fails
- **Proper error handling** and user feedback

### 🎨 User Experience
- **Beautiful UI** with loading states and animations
- **Form validation** with real-time feedback
- **Mobile-responsive design** that works on all devices
- **Clear success/error messages** via alerts
- **Automatic redirect** after successful password reset
- **Consistent design** with existing Bridge2Us theme

## Access Points

### 1. Standalone Pages

#### Forgot Password Page (`/forgot-password`)
- Clean, focused interface for password reset requests
- Email input with validation
- Clear instructions and feedback
- Link back to sign-in page

#### Reset Password Page (`/reset-password?token=TOKEN`)
- Token validation on page load
- Password and confirmation fields
- Real-time validation feedback
- Automatic redirect after success

### 2. User Settings Integration

#### Security Tab in Dashboard Settings
- **Password Management Section**:
  - Clear instructions about the process
  - "Send Password Reset Link" button
  - Professional blue color coding
  
- **Email Verification Section**:
  - Email verification functionality
  - "Send Verification Email" button
  - Professional green color coding
  
- **Security Tips Section**:
  - Best practices for account security
  - Visual indicators with warning colors
  - Helpful guidance for users

### 3. Sign-in Page Integration
- "Forgot your password?" link in footer
- Seamless navigation to forgot password page

## Technical Implementation

### API Endpoints

#### POST `/api/auth/reset-password`
- **Purpose**: Request password reset
- **Body**: `{ email: string }`
- **Response**: Success message (same for all emails)
- **Actions**:
  - Generates secure token
  - Stores token in database with expiration
  - Sends professional email with reset link

#### PUT `/api/auth/reset-password`
- **Purpose**: Update password with token
- **Body**: `{ token: string, newPassword: string }`
- **Response**: Success/error message
- **Actions**:
  - Validates token and expiration
  - Updates user password
  - Deletes used token
  - Redirects to sign-in

### Database Schema

```sql
-- Password Reset Tokens Table
CREATE TABLE password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);

-- Email Verification Tokens Table
CREATE TABLE email_verification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);
```

### Email Templates

#### Password Reset Email
- **From**: `support@bridge2us.app`
- **Subject**: "Reset Your Bridge2Us Password 🔐"
- **Features**:
  - Professional HTML design
  - Clear call-to-action button
  - Security tips
  - 1-hour expiration notice
  - Plain text fallback

#### Email Verification Email
- **From**: `support@bridge2us.app`
- **Subject**: "Verify Your Bridge2Us Email Address ✉️"
- **Features**:
  - Professional HTML design
  - Verification button
  - Account security benefits
  - Plain text fallback

## Testing

### Manual Testing
1. **Start development server**: `npm run dev`
2. **Test standalone pages**:
   - Visit `/forgot-password`
   - Enter email and submit
   - Check email for reset link
   - Click link to go to `/reset-password`
   - Enter new password and confirm
3. **Test settings integration**:
   - Go to dashboard
   - Click settings icon
   - Navigate to Security tab
   - Test password reset and email verification buttons

### Automated Testing
```bash
# Test password reset workflow
node scripts/test-password-reset.js

# Test security settings
node scripts/test-security-settings.js
```

### API Testing
```bash
# Request password reset
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Reset password with token
curl -X PUT http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN","newPassword":"newpassword123"}'
```

## Security Considerations

### Token Security
- **Cryptographically secure** random generation
- **1-hour expiration** to limit exposure window
- **Single-use tokens** deleted after use
- **Database storage** with proper indexing

### Email Security
- **No sensitive data** in email content
- **Secure reset links** with tokens
- **Professional sender** addresses
- **HTTPS links** for all actions

### User Experience Security
- **No user enumeration** (same response for all emails)
- **Clear security messaging** to users
- **Password strength requirements**
- **Confirmation validation** to prevent errors

## Maintenance

### Database Cleanup
- **Expired token cleanup** function available
- **Scheduled cleanup** can be enabled with pg_cron
- **Manual cleanup** scripts provided

### Monitoring
- **Email delivery tracking** via Gmail API
- **Error logging** for failed attempts
- **Success rate monitoring** for user experience

## Future Enhancements

### Potential Improvements
- **Two-factor authentication** integration
- **Password strength meter** in UI
- **Account lockout** after failed attempts
- **Security questions** as backup
- **SMS verification** as alternative
- **Password history** to prevent reuse

### Scalability
- **Rate limiting** for API endpoints
- **Email queue** for high-volume sending
- **Token cleanup** optimization
- **Database indexing** for performance

## Support

For technical support or questions about the password reset workflow:

- **Email**: support@bridge2us.app
- **Documentation**: This file and inline code comments
- **Testing**: Use provided test scripts
- **Database**: Check migration files in `supabase-migration/`

---

**Last Updated**: December 2024
**Version**: 1.0
**Status**: Production Ready ✅
