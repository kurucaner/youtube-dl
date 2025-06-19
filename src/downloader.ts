import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { filesize } from "filesize";
import { type DownloadOptions } from "./types.js";

export async function downloadVideo(
  videoId: string,
  options: DownloadOptions
): Promise<void> {
  const ytdl = await import("@distube/ytdl-core");
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const spinner = ora("🔍 Analyzing available formats...").start();

  try {
    const info = await ytdl.default.getInfo(url);

    // Get highest quality format
    const format = getHighestQualityFormat(info, options, ytdl.default);

    if (!format) {
      spinner.fail("❌ No suitable format found");
      throw new Error("No suitable video format found");
    }

    spinner.succeed(
      `✅ Selected format: ${format.qualityLabel || "Audio only"} (${
        format.container
      })`
    );

    // Generate filename
    const sanitizedTitle = sanitizeFilename(options.videoInfo.title);
    const extension = options.audioOnly
      ? "m4a"
      : options.format === "webm"
      ? "webm"
      : "mp4";
    const filename = `${sanitizedTitle}.${extension}`;
    const outputPath = path.join(options.outputDir, filename);

    // Check if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(chalk.yellow(`⚠️  File already exists: ${filename}`));
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const newFilename = `${sanitizedTitle}_${timestamp}.${extension}`;
      const newOutputPath = path.join(options.outputDir, newFilename);
      console.log(chalk.blue(`📝 Saving as: ${newFilename}`));
      await downloadWithProgress(url, newOutputPath, format, options);
    } else {
      console.log(chalk.blue(`📝 Saving as: ${filename}`));
      await downloadWithProgress(url, outputPath, format, options);
    }
  } catch (error) {
    spinner.fail("❌ Download failed");
    throw error;
  }
}

function getHighestQualityFormat(
  info: any,
  options: DownloadOptions,
  ytdl: any
): any {
  const formats = info.formats;

  if (options.audioOnly) {
    // Get highest quality audio format
    return ytdl.chooseFormat(formats, {
      quality: "highestaudio",
      filter: "audioonly",
    });
  }

  // Get highest quality video format based on quality preference
  let qualityFilter: string;

  switch (options.quality) {
    case "highest":
      qualityFilter = "highest";
      break;
    case "high":
      qualityFilter = "highestvideo";
      break;
    case "medium":
      qualityFilter = "720p";
      break;
    case "low":
      qualityFilter = "480p";
      break;
    default:
      qualityFilter = "highest";
  }

  try {
    // Try to get the best quality format
    return ytdl.chooseFormat(formats, {
      quality: qualityFilter,
      filter: options.format === "webm" ? "videoandaudio" : "mp4",
    });
  } catch {
    // Fallback to any available format
    return ytdl.chooseFormat(formats, {
      quality: "highest",
    });
  }
}

async function downloadWithProgress(
  url: string,
  outputPath: string,
  format: any,
  options: DownloadOptions
): Promise<void> {
  const ytdl = await import("@distube/ytdl-core");

  return new Promise((resolve, reject) => {
    const stream = ytdl.default(url, { format });
    const writeStream = fs.createWriteStream(outputPath);

    let totalSize = 0;
    let downloaded = 0;
    let startTime = Date.now();

    const progressSpinner = ora("⏳ Starting download...").start();

    stream.on("response", (response) => {
      totalSize = parseInt(response.headers["content-length"] || "0", 10);
    });

    stream.on("data", (chunk) => {
      downloaded += chunk.length;

      if (totalSize > 0) {
        const percent = Math.round((downloaded / totalSize) * 100);
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = downloaded / elapsed;
        const eta =
          totalSize > downloaded ? (totalSize - downloaded) / speed : 0;

        progressSpinner.text = `📥 Downloading... ${percent}% (${filesize(
          downloaded
        )}/${filesize(totalSize)}) - ${filesize(speed)}/s - ETA: ${Math.round(
          eta
        )}s`;
      } else {
        progressSpinner.text = `📥 Downloading... ${filesize(
          downloaded
        )} downloaded`;
      }
    });

    stream.on("error", (error) => {
      progressSpinner.fail("❌ Download failed");
      writeStream.destroy();
      try {
        fs.unlinkSync(outputPath);
      } catch {
        // Ignore unlink errors
      }
      reject(error);
    });

    writeStream.on("error", (error) => {
      progressSpinner.fail("❌ Write failed");
      stream.destroy();
      try {
        fs.unlinkSync(outputPath);
      } catch {
        // Ignore unlink errors
      }
      reject(error);
    });

    writeStream.on("finish", () => {
      const fileStats = fs.statSync(outputPath);
      const fileSize = fileStats.size;
      const elapsed = (Date.now() - startTime) / 1000;
      const avgSpeed = fileSize / elapsed;

      progressSpinner.succeed(`✅ Download completed!`);
      console.log(chalk.green(`📁 File saved: ${path.basename(outputPath)}`));
      console.log(chalk.blue(`📊 Size: ${filesize(fileSize)}`));
      console.log(chalk.blue(`⏱️  Time: ${elapsed.toFixed(1)}s`));
      console.log(chalk.blue(`🚀 Average speed: ${filesize(avgSpeed)}/s`));

      resolve();
    });

    stream.pipe(writeStream);
  });
}

function sanitizeFilename(filename: string): string {
  // Remove or replace invalid filename characters
  return filename
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 200); // Limit length
}
