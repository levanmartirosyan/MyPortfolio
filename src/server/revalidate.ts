import "server-only";

import { revalidatePath } from "next/cache";

const publicPaths = ["/", "/projects", "/experience", "/about", "/contact", "/skills"];

export function revalidatePortfolio() {
  publicPaths.forEach((path) => revalidatePath(path));
}
