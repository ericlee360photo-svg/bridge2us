# Bridge2Us - Long Distance Relationship Companion

A beautiful web application designed to help long-distance couples stay connected across time zones. Bridge2Us provides countdown timers to meetups, calendar syncing, timezone management, and partner time tracking.

## Features

### 🕐 Countdown Clock
- Real-time countdown to your next meetup
- Beautiful visual display with days, hours, minutes, and seconds
- Automatic updates every second

### 🌍 Timezone Management
- Real-time partner time display
- Timezone difference calculations
- Partner wake/sleep status indicators
- Best times to connect suggestions

### 📅 Calendar Sync
- Shared calendar for both partners
- Event creation and management
- Visual calendar grid with event indicators
- Upcoming events list

### 💕 Meetup Planning
- Plan and track meetups
- Status management (Planned, Confirmed, Cancelled, Completed)
- Location and date tracking
- Quick actions for travel planning

### 📱 PWA Ready
- Progressive Web App configuration
- Offline capability ready
- App-like experience
- Installable on mobile devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React
- **Date Handling**: date-fns and date-fns-tz
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bridge2us
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file with the following variables:
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

4. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" and create an OAuth 2.0 Client ID
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
   - Copy the Client ID and Client Secret to your `.env` file

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
bridge2us/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── users/     # User management
│   │   │   ├── meetups/   # Meetup CRUD
│   │   │   └── events/    # Calendar events
│   │   ├── calendar/      # Calendar page
│   │   ├── timezone/      # Timezone page
│   │   ├── meetups/       # Meetups page
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Homepage
│   │   └── globals.css    # Global styles
│   └── lib/
│       ├── prisma.ts      # Prisma client
│       └── utils.ts       # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── manifest.json      # PWA manifest
└── package.json
```

## Database Schema

The app uses the following main models:

- **User**: User profiles with timezone information
- **Relationship**: Connections between users
- **Meetup**: Planned meetups between partners
- **Event**: Calendar events for schedule syncing

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Meetups
- `GET /api/meetups` - Get all meetups
- `POST /api/meetups` - Create a new meetup

### Events
- `GET /api/events` - Get events (with optional filters)
- `POST /api/events` - Create a new event

## Development

### Adding New Features

1. Create new API routes in `src/app/api/`
2. Add corresponding pages in `src/app/`
3. Update the database schema if needed
4. Add utility functions to `src/lib/utils.ts`

### Styling Guidelines

- Use Tailwind CSS classes
- Follow the existing color scheme (pink/purple gradient)
- Ensure dark mode compatibility
- Use responsive design patterns

### PWA Considerations

The app is configured for PWA functionality:

- Manifest file in `public/manifest.json`
- Service worker ready (to be implemented)
- App-like meta tags in layout
- Offline capability structure

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables:
   - `DATABASE_URL`: Your production database URL
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

Create a `.env.local` file for local development:

```env
DATABASE_URL="file:./dev.db"
```

For production, use a proper database URL:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.

---

Built with ❤️ for long-distance couples everywhere.
