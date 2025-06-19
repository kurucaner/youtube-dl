#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs/promises";
import path from "path";
import { filesize } from "filesize";
import { downloadVideo } from "./downloader.js";
import { type VideoInfo } from "./types.js";

const program = new Command();

program
  .name("youtube-dl")
  .description(
    "🎬 YouTube Video Downloader CLI - Download videos in highest quality"
  )
  .version("1.0.0");

program
  .argument("<video-id>", "YouTube video ID (11 characters)")
  .option("-o, --output <path>", "Output directory", "./downloads")
  .option("-f, --format <format>", "Video format (mp4, webm)", "mp4")
  .option(
    "-q, --quality <quality>",
    "Video quality (highest, high, medium, low)",
    "highest"
  )
  .option("--audio-only", "Download audio only")
  .option("--info", "Show video info only (no download)")
  .description("Download YouTube video by video ID")
  .action(async (videoId: string, options) => {
    try {
      // Validate video ID
      if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        console.error(
          chalk.red("❌ Invalid video ID. Must be 11 characters long.")
        );
        process.exit(1);
      }

      const spinner = ora("🔍 Getting video information...").start();

      try {
        const videoInfo = await getVideoInfo(videoId);
        spinner.succeed("✅ Video information retrieved");

        console.log(chalk.cyan("\n📹 Video Information:"));
        console.log(`  Title: ${chalk.white(videoInfo.title)}`);
        console.log(`  Author: ${chalk.white(videoInfo.author)}`);
        console.log(`  Duration: ${chalk.white(videoInfo.duration)}`);
        console.log(
          `  Views: ${chalk.white(videoInfo.views?.toLocaleString() || "N/A")}`
        );
        console.log(
          `  Upload Date: ${chalk.white(videoInfo.uploadDate || "N/A")}`
        );

        if (options.info) {
          console.log(chalk.green("\n✨ Info retrieved successfully!"));
          return;
        }

        // Create output directory
        await fs.mkdir(options.output, { recursive: true });

        // Download video
        await downloadVideo(videoId, {
          outputDir: options.output,
          format: options.format,
          quality: options.quality,
          audioOnly: options.audioOnly,
          videoInfo,
        });
      } catch (error) {
        spinner.fail("❌ Failed to process video");
        throw error;
      }
    } catch (error) {
      console.error(
        chalk.red(
          `\n❌ Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
      );
      process.exit(1);
    }
  });

program
  .command("info")
  .argument("<video-id>", "YouTube video ID")
  .description("Get video information without downloading")
  .action(async (videoId: string) => {
    try {
      if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        console.error(
          chalk.red("❌ Invalid video ID. Must be 11 characters long.")
        );
        process.exit(1);
      }

      const spinner = ora("🔍 Getting video information...").start();
      const videoInfo = await getVideoInfo(videoId);
      spinner.succeed("✅ Video information retrieved");

      console.log(chalk.cyan("\n📹 Video Information:"));
      console.log(`  Title: ${chalk.white(videoInfo.title)}`);
      console.log(`  Author: ${chalk.white(videoInfo.author)}`);
      console.log(`  Duration: ${chalk.white(videoInfo.duration)}`);
      console.log(
        `  Views: ${chalk.white(videoInfo.views?.toLocaleString() || "N/A")}`
      );
      console.log(
        `  Upload Date: ${chalk.white(videoInfo.uploadDate || "N/A")}`
      );
      console.log(
        `  Description: ${chalk.white(
          videoInfo.description?.slice(0, 200) + "..." || "N/A"
        )}`
      );
    } catch (error) {
      console.error(
        chalk.red(
          `\n❌ Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
      );
      process.exit(1);
    }
  });

async function getVideoInfo(videoId: string): Promise<VideoInfo> {
  const ytdl = await import("@distube/ytdl-core");
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const info = await ytdl.default.getInfo(url);

  return {
    title: info.videoDetails.title,
    author: info.videoDetails.author.name,
    duration: formatDuration(parseInt(info.videoDetails.lengthSeconds)),
    views: parseInt(info.videoDetails.viewCount),
    uploadDate: info.videoDetails.uploadDate,
    description: info.videoDetails.description || undefined,
    videoId: info.videoDetails.videoId,
  };
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

program.parse();
