import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ELearningAPI } from "../api/elearnings";
import { CreateELearningDto } from "@/types";

export const useGetElearnings = () => {
    const { data: elearnings, isPending, isError } = useQuery({
        queryKey: ['elearnings'],
        queryFn: ELearningAPI.fetchELearnings,
    });
    return { elearnings, isPending, isError };
};

export const useGetELearningById = (id: number) => {
    const { data: elearning, isPending, isError } = useQuery({
        queryKey: ['elearning', id],
        queryFn: () => ELearningAPI.fetchELearningById(id),
        enabled: !!id, // only run the query if id is provided
    });
    return { elearning, isPending, isError };
}

export const useCreateELearning = () => {
    const queryClient = useQueryClient();

    const createELearning = useMutation({
        mutationFn: (elearning: CreateELearningDto) => ELearningAPI.createELearning(elearning),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["elearnings"] });
        }

    });

    return { createELearning };
}

export const useDeleteELearning = () => {
    const queryClient = useQueryClient();
    
    const deleteELearning = useMutation({
        mutationFn: (id: number) => ELearningAPI.deleteELearning(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["elearnings"] });
        }
    });
    return { deleteELearning };
}