const commands = ["ls","cd","mkdir","touch","cat","rm","pwd","echo","clear","help"];

export function suggest(cmd: string): string | null {
  return commands.find(c => c.startsWith(cmd[0])) || null;
}
