import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Paperclip } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatSheetProps {
  trigger?: React.ReactNode;
  context?: string; // "General" or "Intervention #123"
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChatSheet({ trigger, context = "Bureau", open, onOpenChange }: ChatSheetProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "bureau", text: "Bonjour Thomas, n'oublie pas de valider tes heures ce soir.", time: "09:00" },
    { id: 2, sender: "me", text: "C'est noté, je le fais après mon intervention.", time: "09:05" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "me", text: message, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setMessage("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="relative text-muted-foreground">
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] flex flex-col p-0 rounded-t-xl">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Bureau" />
                <AvatarFallback>BU</AvatarFallback>
            </Avatar>
            <div>
                <span className="block text-sm font-bold">Discussion {context}</span>
                <span className="block text-xs font-normal text-muted-foreground">En ligne</span>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-4 bg-muted/10">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === "me"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[10px] block text-right mt-1 ${msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background pb-safe">
          <div className="flex gap-2 items-center">
            <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
                <Paperclip className="h-5 w-5" />
            </Button>
            <Input 
                placeholder="Écrire un message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 rounded-full bg-muted/50 border-0 focus-visible:ring-1"
            />
            <Button size="icon" className="rounded-full shrink-0" onClick={handleSend}>
                <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
