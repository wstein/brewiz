import { createSignal } from "solid-js";
import { generateBrewCommands } from "../utils/BrewCommandsUtils";

export function BrewCommands(props) {
  const [copySuccess, setCopySuccess] = createSignal("");

  const commands = () =>
    generateBrewCommands(
      props.categories,
      props.selectedPackages(),
      props.outdatedPackages()
    );

  const copyToClipboard = async () => {
    const commandText = commands().join("\n");
    try {
      await navigator.clipboard.writeText(commandText);
      showCopyFeedback("Copied!");
    } catch (err) {
      showCopyFeedback("Failed to copy");
    }
  };

  const showCopyFeedback = (message) => {
    setCopySuccess(message);
    setTimeout(() => setCopySuccess(""), 2000);
  };

  return (
    <div class="fixed bottom-0 left-0 right-0 bg-[#282a36] text-[#f8f8f2] shadow-lg z-50">
      <div class="max-w-[1800px] min-w-[1200px] mx-auto px-4 py-4">
        <CommandHeader
          copyToClipboard={copyToClipboard}
          copySuccess={copySuccess}
        />
        <CommandDisplay commands={commands()} />
      </div>
    </div>
  );
}

function CommandHeader(props) {
  return (
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold">Brew Commands:</h3>
      <button
        onClick={props.copyToClipboard}
        title="Copy commands to clipboard"
        class="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm flex items-center gap-2 transition-colors"
      >
        {props.copySuccess() || "Copy"}
      </button>
    </div>
  );
}

function CommandDisplay(props) {
  return (
    <pre class="font-mono text-sm overflow-x-auto rounded bg-[#1e1f29] p-4">
      {props.commands.map((cmd) =>
        cmd.startsWith("#") ? (
          <CommentLine text={cmd} />
        ) : cmd.includes("#") ? (
          <CommandWithComment cmd={cmd} />
        ) : (
          <StandardCommand cmd={cmd} />
        ),
      )}
    </pre>
  );
}

function CommentLine(props) {
  return (
    <span class="text-[#fe4a56]">
      <i>
        <b>{props.text}</b>
      </i>
    </span>
  );
}

function CommandWithComment(props) {
  const [command, comment] = props.cmd.split("#", 2);
  const commandParts = command.trim().split(" ");

  return (
    <div>
      <span class="text-[#50fa7b]">brew</span>{" "}
      <span class="text-[#ff79c6]">{commandParts[1]}</span>{" "}
      <span class="text-[#f1fa8c]">{commandParts.slice(2).join(" ")}</span>
      <span class="text-[#fe4a56]">
        <i>
          <b>{`#${comment}`}</b>
        </i>
      </span>
    </div>
  );
}

function StandardCommand(props) {
  const parts = props.cmd.split(" ");

  return (
    <div>
      <span class="text-[#50fa7b]">brew</span>{" "}
      <span class="text-[#ff79c6]">{parts[1]}</span>{" "}
      <span class="text-[#f1fa8c]">{parts.slice(2).join(" ")}</span>
    </div>
  );
}
