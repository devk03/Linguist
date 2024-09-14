import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { ConvexProvider, ConvexReactClient, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { createPortal } from "react-dom";
import { CloseIcon } from "./CloseIcon.js";
import { InfoCircled } from "./InfoCircled.js";
import { SendIcon } from "./SendIcon.js";
import { SizeIcon } from "./SizeIcon.js";

export function ConvexAiChat({
  infoMessage,
  name,
  welcomeMessage,
  convexUrl,
  renderTrigger,
}: {
  name: string;
  convexUrl: string;
  infoMessage: ReactNode;
  welcomeMessage: string;
  renderTrigger: (onClick: () => void) => ReactNode;
}) {
  const [hasOpened, setHasOpened] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);
  const client = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);

  return (
    <ConvexProvider client={client}>
      {renderTrigger(() => {
        setHasOpened(true);
        setDialogOpen(!dialogOpen);
      })}
      {hasOpened
        ? createPortal(
            <Dialog
              infoMessage={infoMessage}
              isOpen={dialogOpen}
              name={name}
              welcomeMessage={welcomeMessage}
              onClose={handleCloseDialog}
            />,
            document.body
          )
        : null}
    </ConvexProvider>
  );
}

export function Dialog({
  infoMessage,
  isOpen,
  name,
  welcomeMessage,
  onClose,
}: {
  infoMessage: ReactNode;
  isOpen: boolean;
  name: string;
  welcomeMessage: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState([
    { isViewer: false, text: welcomeMessage, _id: "0" },
  ]);
  const [expanded, setExpanded] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const [input, setInput] = useState("");

  const handleExpand = () => {
    setExpanded(!expanded);
    setScrolled(false);
  };

  // Define the mutation
  const sendMessage = useAction(api.functions.chat.send);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    if (input.trim()) {
      const newMessage = {
        isViewer: true,
        text: input,
        _id: Date.now().toString(),
      };
      const response = await sendMessage({ text: input, isViewer: true });
      console.log(response);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");
      setScrolled(false);
    }
  };

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScrolled) {
      return;
    }
    // Using `setTimeout` to make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  }, [messages, isScrolled]);

  return (
    <div
      className={
        (isOpen ? "fixed" : "hidden") +
        " rounded-xl flex flex-col bg-white dark:bg-black text-black dark:text-white " +
        "m-4 right-0 bottom-0 max-w-[calc(100%-2rem)] overflow-hidden transition-all " +
        "shadow-[0px_5px_40px_rgba(0,0,0,0.16),0_20px_25px_-5px_rgb(0,0,0,0.1)] " +
        "dark:shadow-[0px_5px_40px_rgba(0,0,0,0.36),0_20px_25px_-5px_rgb(0,0,0,0.3)] " +
        (expanded
          ? "left-0 top-0 z-[1000]"
          : "w-full sm:max-w-[25rem] sm:min-w-[25rem] h-[30rem]")
      }
    >
      <div className="flex justify-end">
        <button className="group border-none bg-transparent p-0 pt-2 px-2 cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-300">
          <InfoCircled className="h-5 w-5" />
          <span
            className={
              "invisible absolute z-50 cursor-auto group-hover:visible text-base text-black dark:text-white " +
              "rounded-md shadow-[0px_5px_12px_rgba(0,0,0,0.32)] p-2 bg-white dark:bg-neutral-700 top-12 right-8 left-8 text-center"
            }
          >
            {infoMessage}
          </span>
        </button>
        <button
          className="border-none bg-transparent p-0 pt-2 px-2 cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-300"
          onClick={handleExpand}
        >
          <SizeIcon className="h-5 w-5" />
        </button>
        <button
          className="border-none bg-transparent p-0 pt-2 px-2 cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-300"
          onClick={onClose}
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
      <div
        className="flex-grow overflow-scroll gap-2 flex flex-col mx-2 pb-2 rounded-lg"
        ref={listRef}
        onWheel={() => {
          setScrolled(true);
        }}
      >
        {messages.map((message) => (
          <div key={message._id}>
            <div
              className={
                "text-neutral-400 text-sm " +
                (message.isViewer && !expanded ? "text-right" : "")
              }
            >
              {message.isViewer ? <>You</> : <>{name}</>}
            </div>
            {message.text === "" ? (
              <div className="animate-pulse rounded-md bg-black/10 h-9" />
            ) : (
              <div
                className={
                  "w-full rounded-xl px-3 py-2 whitespace-pre-wrap " +
                  (message.isViewer
                    ? "bg-neutral-200 dark:bg-neutral-800 "
                    : "bg-neutral-100 dark:bg-neutral-900 ") +
                  (message.isViewer && !expanded
                    ? "rounded-tr-none"
                    : "rounded-tl-none")
                }
              >
                {message.text}
              </div>
            )}
          </div>
        ))}
      </div>
      <form
        className="border-t-neutral-200 dark:border-t-neutral-800 border-solid border-0 border-t-[1px] flex"
        onSubmit={handleSend}
      >
        <input
          className="w-full bg-white dark:bg-black border-none text-[1rem] pl-4 py-3 outline-none"
          autoFocus
          name="message"
          placeholder="Send a message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button
          disabled={input.trim() === ""}
          className="bg-transparent border-0 px-4 py-3 enabled:cursor-pointer enabled:hover:text-sky-500"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
