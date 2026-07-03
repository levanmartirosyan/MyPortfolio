import { randomUUID } from "node:crypto";
import { handleApiError, ok, problem, requireAdmin } from "@/server/http";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxFileSize = 5 * 1024 * 1024;

function getStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "portfolio";

  if (!supabaseUrl || !serviceRoleKey) {
    return undefined;
  }

  return { supabaseUrl, serviceRoleKey, bucket };
}

function extensionFor(file: File) {
  const nameExtension = file.name.split(".").pop()?.toLowerCase();
  if (nameExtension && /^[a-z0-9]+$/.test(nameExtension)) return nameExtension;

  return file.type.split("/")[1] || "bin";
}

export async function POST(request: Request) {
  try {
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    const config = getStorageConfig();
    if (!config) {
      return problem("Supabase Storage is not configured", 500);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folderValue = formData.get("folder");
    const folder = typeof folderValue === "string" ? folderValue : "uploads";

    if (!(file instanceof File)) {
      return problem("File is required", 400);
    }

    if (!allowedTypes.has(file.type)) {
      return problem("Only JPG, PNG, WEBP, and GIF images are allowed", 415);
    }

    if (file.size > maxFileSize) {
      return problem("Image must be 5MB or smaller", 413);
    }

    const safeFolder = folder.replace(/[^a-z0-9-_/]/gi, "").replace(/^\/+|\/+$/g, "");
    const path = `${safeFolder || "uploads"}/${randomUUID()}.${extensionFor(file)}`;
    const uploadUrl = `${config.supabaseUrl}/storage/v1/object/${config.bucket}/${path}`;

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.serviceRoleKey}`,
        apikey: config.serviceRoleKey,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: await file.arrayBuffer(),
    });

    if (!uploadResponse.ok) {
      const details = await uploadResponse.text().catch(() => "");
      return problem("Could not upload image to Supabase Storage", uploadResponse.status, details);
    }

    const publicUrl = `${config.supabaseUrl}/storage/v1/object/public/${config.bucket}/${path}`;
    return ok({ url: publicUrl, path }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
