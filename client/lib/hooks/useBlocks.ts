import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlockAPI } from "../api/blocks";

export const useGetBlocks = () => {
    const { data: blocks, isPending, isError, error } = useQuery({
        queryKey: ['blocks'],
        queryFn: BlockAPI.getAllBlocks,
    });
    return { blocks, isPending, isError, error };
};

export const useDeleteBlock = () => {
    const queryClient = useQueryClient();

    const deleteBlock = useMutation({
        mutationFn: (id: number) => BlockAPI.deleteBlock(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            // Also invalidate e-learnings since block usage might have changed
            queryClient.invalidateQueries({ queryKey: ["elearnings"] });
        }
    });
    
    return { deleteBlock };
};