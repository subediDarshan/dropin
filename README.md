# 🚀 Dropin

**Lightning Fast • Secure • Hassle-free File Sharing**

Dropin is a modern, privacy-focused file sharing service that enables users to securely upload and share files without requiring sign-ups or compromising privacy. Built with end-to-end encryption and automatic file expiration.

## ✨ Features

### 🔐 **End-to-End Encryption**

- Files are encrypted client-side before upload
- Only you have the decryption key - we can't see your files
- AES-GCM 256-bit encryption for maximum security

### ⚡ **No Sign-up Required**

- Drag, drop, and share instantly
- No accounts, no tracking, no personal information required
- Pure simplicity for quick file sharing

### 🗓️ **Automatic Expiration**

- Files auto-delete after download or based on time settings
- Configurable deletion policies:
  - Delete on download
  - Delete after 1 day
  - Delete after 1 week  
  - Delete after 1 month

### 📁 **Multi-format Support**

- **Images**: 4MB limit (PNG, JPG, GIF, etc.)
- **Videos**: 16MB limit (MP4, AVI, MOV, etc.)
- **Audio**: 8MB limit (MP3, WAV, etc.)
- **Documents**: 8MB limit (DOCX, TXT, etc.)
- **PDFs**: 4MB limit
- **Text Files**: 64KB limit

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching and caching
- **React Icons** - Icon components

### Backend

- **tRPC** - End-to-end type safe APIs
- **Prisma** - Database ORM
- **UploadThing** - File upload service
- **Vercel Crons** - Scheduled cleanup jobs

### Security & Crypto

- **Web Crypto API** - Client-side encryption
- **AES-GCM** - Symmetric encryption algorithm
- **Base64** encoding for key transmission

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Database (PostgreSQL recommended)
- UploadThing account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/dropin.git
   cd dropin
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```env
   # Database
   DATABASE_URL="your-database-url"
   
   # UploadThing
   UPLOADTHING_TOKEN="your-uploadthing-token"
   
   # Cron Jobs
   CRON_SECRET="your-cron-secret-key"
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | ✅ |
| `UPLOADTHING_TOKEN` | UploadThing API token | ✅ |
| `CRON_SECRET` | Secret key for cron job authentication | ✅ |

## 🔒 Security Architecture

### Client-Side Encryption Flow

1. User selects file
2. Generate AES-256-GCM key + IV on client
3. Encrypt file data client-side
4. Upload encrypted blob to UploadThing
5. Store file metadata in database
6. Generate shareable link with encryption key in URL fragment

### Download & Decryption Flow

1. User visits download link
2. Extract encryption key from URL fragment (#)
3. Fetch encrypted file from UploadThing
4. Decrypt file client-side using key
5. Trigger download of decrypted file
6. Optionally delete file record if "delete on download" enabled

### Security Benefits

- **Zero-knowledge**: Server never sees plaintext files
- **Client-side keys**: Encryption keys never sent to server
- **URL fragments**: Keys in # portion aren't sent in HTTP requests
- **Temporary storage**: Files auto-expire and delete
- **No tracking**: No user accounts or persistent data

## ⏰ Automated Cleanup

Dropin includes automatic cleanup via Vercel Crons:

- **Schedule**: Daily at 5:00 AM UTC
- **Function**: Deletes expired files from both database and storage
- **Authentication**: Protected by `CRON_SECRET` environment variable

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- File uploads powered by [UploadThing](https://uploadthing.com/)
- Database management with [Prisma](https://prisma.io/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for secure, private file sharing**
