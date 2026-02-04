import { useState } from "react";
import { Bell, X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, dismiss } = useNotifications();

    const getTypeColor = (type: string) => {
        switch (type) {
            case "urgent": return "bg-red-500";
            case "warning": return "bg-yellow-500";
            case "event": return "bg-purple-500";
            default: return "bg-blue-500";
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                    <h4 className="font-medium text-sm leading-none">Notifications</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                        Latest updates from BCA
                    </p>
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No new notifications
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification: any) => (
                                <div key={notification.id} className="p-4 hover:bg-muted/50 transition-colors group relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dismiss(notification.id);
                                        }}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                        title="Dismiss"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="flex items-start gap-3 pr-4">
                                        <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${getTypeColor(notification.type)}`} />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground pt-1">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <div className="p-4 border-t bg-muted/20">
                        <p className="text-xs text-center text-muted-foreground">
                            View all updates in Dashboard
                        </p>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};
