import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useNotifications = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Fetch active notifications
    const { data: notifications = [], isLoading: isLoadingNotifications } = useQuery({
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
    });

    // Fetch dismissed notification IDs for the current user
    const { data: dismissedIds = [] } = useQuery({
        queryKey: ["dismissed-notifications", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from("notification_dismissals")
                .select("notification_id")
                .eq("user_id", user.id!)
                .throwOnError();
            if (error) throw error;
            return data.map(d => d.notification_id);
        },
        enabled: !!user,
    });

    const activeNotifications = notifications.filter(n => !dismissedIds.includes(n.id));

    const dismissMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            if (!user) throw new Error("Must be logged in");
            const { error } = await supabase
                .from("notification_dismissals")
                .insert([{ notification_id: notificationId, user_id: user.id! }]);
            if (error) throw error;
        },
        onMutate: async (notificationId) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["dismissed-notifications", user?.id] });

            // Snapshot the previous value
            const previousDismissedIds = queryClient.getQueryData<string[]>(["dismissed-notifications", user?.id]);

            // Optimistically update to the new value
            queryClient.setQueryData<string[]>(["dismissed-notifications", user?.id], (old = []) => [
                ...old,
                notificationId,
            ]);

            // Return a context object with the snapshotted value
            return { previousDismissedIds };
        },
        onError: (err, newTodo, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            queryClient.setQueryData(
                ["dismissed-notifications", user?.id],
                context?.previousDismissedIds
            );
            toast({ title: "Error", description: "Failed to dismiss notification", variant: "destructive" });
        },
        onSettled: () => {
            // Always refetch after error or success:
            queryClient.invalidateQueries({ queryKey: ["dismissed-notifications"] });
        },
    });

    return {
        notifications: activeNotifications,
        allNotifications: notifications, // Return all if needed
        isLoading: isLoadingNotifications,
        dismiss: dismissMutation.mutate,
        isDismissing: dismissMutation.isPending
    };
};
