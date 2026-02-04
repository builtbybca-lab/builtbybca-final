import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export const NotificationBell = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch active notifications
    const { data: notifications = [] } = useQuery({
        queryKey: ["active-notifications"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("notifications")
                .select("*")
                .eq("active", true)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
        // Refetch every minute to keep updated
        refetchInterval: 60000
    });

    useEffect(() => {
        // Simple unread logic: If notifications exist and differ from count, assume new? 
        // Real implementation would track "read_notifications" in a separate table.
        // For now, we'll just show the total count of active notifications as the badge.
        setUnreadCount(notifications.length);
    }, [notifications]);

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
                    {unreadCount > 0 && (
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
                            No notifications
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification: any) => (
                                <div key={notification.id} className="p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1.5 h-2 w-2 rounded-full ${getTypeColor(notification.type)}`} />
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
