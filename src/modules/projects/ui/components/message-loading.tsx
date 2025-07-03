import Image from "next/image";
import { useEffect, useState } from "react";

const ShimmerMessages = () => {
  const messages = [
    "Thinking...",
    "Loading...",
    "Generating...",
    "Analyzing your request...",
    "Building your website...",
    "Crafting components...",
    "Optimizing layout...",
    "Adding final touches...",
    "Almost ready...",
    "Reviewing requirements...",
    "Designing UI elements...",
    "Writing clean code...",
    "Refactoring modules...",
    "Connecting APIs...",
    "Fetching data...",
    "Parsing response...",
    "Validating input...",
    "Resolving dependencies...",
    "Bundling assets...",
    "Compiling project...",
    "Running tests...",
    "Debugging issues...",
    "Applying best practices...",
    "Ensuring accessibility...",
    "Improving performance...",
    "Minifying scripts...",
    "Configuring environment...",
    "Setting up database...",
    "Migrating schemas...",
    "Seeding initial data...",
    "Synchronizing state...",
    "Handling edge cases...",
    "Checking compatibility...",
    "Integrating libraries...",
    "Updating packages...",
    "Securing endpoints...",
    "Encrypting data...",
    "Generating documentation...",
    "Reviewing code quality...",
    "Formatting files...",
    "Linting source code...",
    "Resolving merge conflicts...",
    "Deploying to server...",
    "Monitoring logs...",
    "Scaling infrastructure...",
    "Balancing load...",
    "Caching resources...",
    "Optimizing queries...",
    "Rendering UI...",
    "Animating transitions...",
    "Listening for events...",
    "Handling errors...",
    "Retrying failed requests...",
    "Saving progress...",
    "Syncing with cloud...",
    "Preparing preview...",
    "Generating suggestions...",
    "Personalizing experience...",
    "Learning from feedback...",
    "Adapting to changes...",
    "Finalizing details...",
    "Almost done...",
    "Just a moment...",
    "Wrapping up...",
    "Ready to launch!",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

const MessageLoading = () => {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/icons/logo.png"
          alt="velo-pro"
          height={28}
          width={28}
          className="shrink-0"
        />
        <span className="text-base font-medium">Velo Pro</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessages />
      </div>
    </div>
  );
};

export { MessageLoading };
