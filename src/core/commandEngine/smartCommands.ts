export function smartMap(input: string): string | null {
  const text = input.toLowerCase();

  if (text.includes("show") && text.includes("files")) return "ls";
  if (text.includes("go back")) return "cd ..";
  if (text.includes("go home")) return "cd home";

  if (text.includes("create folder")) {
    const name = text.split("folder")[1]?.trim();
    return `mkdir ${name || "newFolder"}`;
  }

  if (text.includes("create file")) {
    const name = text.split("file")[1]?.trim();
    return `touch ${name || "file.txt"}`;
  }

  if (text.includes("delete file")) {
    const name = text.split("file")[1]?.trim();
    return `rm ${name || ""}`;
  }

  return null;
}
