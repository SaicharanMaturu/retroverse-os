export type FileNode = {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  permissions?: string; // POSIX permissions (e.g., "755")
  owner?: string;
  group?: string;
  size?: number;
  modified?: number; // timestamp
};

export let fileSystem: FileNode = {
  name: "root",
  type: "folder",
  permissions: "755",
  owner: "root",
  group: "root",
  children: [
    // bin directory with executables
    {
      name: "bin",
      type: "folder",
      permissions: "755",
      owner: "root",
      group: "root",
      children: [
        { name: "ls", type: "file", content: "executable", permissions: "755", owner: "root", group: "root" },
        { name: "cat", type: "file", content: "executable", permissions: "755", owner: "root", group: "root" },
        { name: "grep", type: "file", content: "executable", permissions: "755", owner: "root", group: "root" },
        { name: "echo", type: "file", content: "executable", permissions: "755", owner: "root", group: "root" },
      ],
    },
    // etc directory with system configuration
    {
      name: "etc",
      type: "folder",
      permissions: "755",
      owner: "root",
      group: "root",
      children: [
        {
          name: "passwd",
          type: "file",
          content: "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash\n",
          permissions: "644",
          owner: "root",
          group: "root",
        },
        {
          name: "hostname",
          type: "file",
          content: "retroverse-os\n",
          permissions: "644",
          owner: "root",
          group: "root",
        },
      ],
    },
    // home directory for users
    {
      name: "home",
      type: "folder",
      permissions: "755",
      owner: "root",
      group: "root",
      children: [
        {
          name: "user",
          type: "folder",
          permissions: "755",
          owner: "user",
          group: "user",
          children: [
            {
              name: "file.txt",
              type: "file",
              content: "Hello World",
              permissions: "644",
              owner: "user",
              group: "user",
            },
            {
              name: ".bashrc",
              type: "file",
              content: "# Bash configuration\nexport PATH=/bin:/usr/bin\nexport HOME=/home/user\nexport USER=user\n",
              permissions: "644",
              owner: "user",
              group: "user",
            },
          ],
        },
      ],
    },
    // usr directory
    {
      name: "usr",
      type: "folder",
      permissions: "755",
      owner: "root",
      group: "root",
      children: [
        {
          name: "bin",
          type: "folder",
          permissions: "755",
          owner: "root",
          group: "root",
          children: [],
        },
        {
          name: "local",
          type: "folder",
          permissions: "755",
          owner: "root",
          group: "root",
          children: [],
        },
      ],
    },
    // tmp directory (world-writable)
    {
      name: "tmp",
      type: "folder",
      permissions: "777",
      owner: "root",
      group: "root",
      children: [],
    },
    // var directory
    {
      name: "var",
      type: "folder",
      permissions: "755",
      owner: "root",
      group: "root",
      children: [
        {
          name: "log",
          type: "folder",
          permissions: "755",
          owner: "root",
          group: "root",
          children: [],
        },
      ],
    },
    // root directory (home for root user)
    {
      name: "root",
      type: "folder",
      permissions: "700",
      owner: "root",
      group: "root",
      children: [],
    },
  ],
};
