import { useQuery } from "@tanstack/react-query";
import { UniverseAPI } from "../api/universes";

export const useGetUniverses = () => {
    const { data: universes, isPending, isError, error } = useQuery({
        queryKey: ['universes'],
        queryFn: UniverseAPI.fetchUniverses,
    });
    return { universes, isPending, isError, error };
};
