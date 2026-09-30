
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const GlobalRealtimeSubscription = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel("global-db-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                },
                (payload) => {
                    const { table } = payload;
                    switch (table) {
                        case "events":
                            queryClient.invalidateQueries({ queryKey: ["events"] });
                            queryClient.invalidateQueries({ queryKey: ["admin-events"] });
                            break;
                        case "blog_posts":
                            queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
                            queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
                            break;
                        case "team_members":
                            queryClient.invalidateQueries({ queryKey: ["team_members"] });
                            queryClient.invalidateQueries({ queryKey: ["admin-team"] });
                            break;
                        case "projects":
                            queryClient.invalidateQueries({ queryKey: ["projects"] });
                            queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
                            break;
                        case "testimonials":
                            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
                            queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
                            break;
                        case "notifications":
                            queryClient.invalidateQueries({ queryKey: ["notifications"] });
                            break;
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient, user]);

    return null;
};
