
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const GlobalRealtimeSubscription = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        console.log("Setting up global realtime subscription...");

        const channel = supabase
            .channel("global-db-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                },
                (payload) => {
                    console.log("Realtime change detected:", payload);
                    const { table } = payload;

                    // Map table names to query keys
                    // These keys must match what is used in useQuery across the app
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

                        // Add other tables as needed
                    }
                }
            )
            .subscribe((status) => {
                console.log("Global subscription status:", status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return null; // This component doesn't render anything
};
