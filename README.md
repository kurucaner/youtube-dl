# 🎬 YouTube Downloader CLI

A powerful command-line tool to download YouTube videos in the highest quality possible. Built with TypeScript and designed for ease of use.

## ✨ Features

- 🎯 **Download by Video ID** - Simply provide the 11-character YouTube video ID
- 🔥 **Highest Quality** - Automatically selects the best available quality (4K, 1080p, etc.)
- 📱 **Multiple Formats** - Support for MP4 and WebM formats
- 🎵 **Audio-only Downloads** - Extract audio in high quality
- 📊 **Progress Tracking** - Real-time download progress with speed and ETA
- 📁 **Custom Output** - Choose your download directory
- 🔍 **Video Info** - Get video details without downloading
- ⚡ **Fast & Reliable** - Built with proven libraries

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- **Bun** (recommended) or npm

### Install Bun (Recommended)

```bash
curl -fsSL https://bun.sh/install | bash
```

## 🚀 Quick Setup

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Build the project:**

   ```bash
   bun run build
   ```

3. **Make executable:**

   ```bash
   chmod +x youtube-dl
   ```

4. **Ready to use!**
   ```bash
   ./youtube-dl dQw4w9WgXcQ
   ```

## 📖 Usage

### Basic Download

```bash
# Download video with highest quality
./youtube-dl dQw4w9WgXcQ
```

### Advanced Options

```bash
# Custom output directory
./youtube-dl dQw4w9WgXcQ -o ~/Videos

# Specific quality and format
./youtube-dl dQw4w9WgXcQ -q high -f webm

# Audio only download
./youtube-dl dQw4w9WgXcQ --audio-only

# Get video info without downloading
./youtube-dl dQw4w9WgXcQ --info
```

### Command Reference

```bash
USAGE:
    ./youtube-dl <video-id> [options]

ARGUMENTS:
    <video-id>               YouTube video ID (11 characters)

OPTIONS:
    -o, --output <path>      Output directory (default: ./downloads)
    -f, --format <format>    Video format: mp4, webm (default: mp4)
    -q, --quality <quality>  Quality: highest, high, medium, low (default: highest)
    --audio-only            Download audio only
    --info                  Show video info only (no download)
    -h, --help              Show this help message

COMMANDS:
    ./youtube-dl info <video-id>    Get video information without downloading
```

## 🎯 Quality Levels

| Quality | Description                        | Resolution    |
| ------- | ---------------------------------- | ------------- |
| highest | Best available quality             | 4K/1080p/720p |
| high    | High quality (1080p preferred)     | 1080p         |
| medium  | Medium quality                     | 720p          |
| low     | Lower quality for faster downloads | 480p          |

## 📱 Finding Video IDs

YouTube video IDs are the 11-character strings in YouTube URLs:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                ^^^^^^^^^^^
                               This is the ID
```

## 📊 Example Output

```bash
$ ./youtube-dl dQw4w9WgXcQ -q highest

🔍 Getting video information...
✅ Video information retrieved

📹 Video Information:
  Title: Rick Astley - Never Gonna Give You Up (Official Video)
  Author: Rick Astley
  Duration: 3:33
  Views: 1,234,567,890
  Upload Date: 2009-10-25

🔍 Analyzing available formats...
✅ Selected format: 1080p (mp4)
📝 Saving as: Rick Astley - Never Gonna Give You Up (Official Video).mp4
📥 Downloading... 100% (45.2MB/45.2MB) - 5.2MB/s - ETA: 0s
✅ Download completed!
📁 File saved: Rick Astley - Never Gonna Give You Up (Official Video).mp4
📊 Size: 45.2MB
⏱️  Time: 8.7s
🚀 Average speed: 5.2MB/s
```

## 🔧 Development

### Scripts

```bash
# Install dependencies
bun install

# Development mode
bun run dev

# Build TypeScript
bun run build

# Run built version
bun run start <video-id>
```

### Project Structure

```
src/
├── index.ts          # Main CLI application
├── downloader.ts     # Download logic and progress tracking
└── types.ts          # TypeScript interfaces

dist/                 # Built JavaScript files
downloads/           # Default download directory
```

## 🐛 Troubleshooting

### Common Issues

**"Video unavailable" error:**

- Check if the video ID is correct (11 characters)
- Ensure the video is publicly accessible
- Some videos may be region-restricted

**"No suitable format found" error:**

- Try different quality settings
- Some videos may not have all quality options available

**Slow downloads:**

- Try using a different quality setting
- Check your internet connection
- Some videos may have bandwidth limitations

### Getting Help

```bash
# Show help message
./youtube-dl --help

# Get video information only
./youtube-dl dQw4w9WgXcQ --info
```

## 📄 Legal Notice

This tool is for educational and personal use only. Please respect YouTube's Terms of Service and copyright laws. Only download content you have the right to download.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

---

**Happy downloading! 🎉**

For issues or questions, please open an issue on GitHub.
