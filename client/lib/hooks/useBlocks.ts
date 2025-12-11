import { useQuery } from "@tanstack/react-query";
import { BlockAPI } from "../api/blocks";

export const useGetBlocks = () => {
    const { data: blocks, isPending, isError } = useQuery({
        queryKey: ['blocks'],
        queryFn: BlockAPI.getAllBlocks,
    });
    return { blocks, isPending, isError };
};