import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ELearningAPI } from "../api/elearnings";
import { CreateELearningDto } from "@/types";

export const useGetElearnings = () => {
    const { data: elearnings, isPending, isError, error } = useQuery({
        queryKey: ['elearnings'],
        queryFn: ELearningAPI.fetchELearnings,
    });
    return { elearnings, isPending, isError, error };
};

export const useGetELearningById = (id: number | undefined) => {
    const { data: elearning, isPending, isError, error } = useQuery({
        queryKey: ['elearning', id],
        queryFn: () => ELearningAPI.fetchELearningById(id!),
        enabled: !!id, // only run the query if id is provided
    });
    return { elearning, isPending, isError, error };
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

export const useUpdateELearning = () => {
    const queryClient = useQueryClient();

    const updateELearning = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CreateELearningDto }) => 
            ELearningAPI.updateELearning(id, data),
        onSuccess: (_, variables) => {
            // Invalidate both the list and the specific e-learning
            queryClient.invalidateQueries({ queryKey: ["elearnings"] });
            queryClient.invalidateQueries({ queryKey: ["elearning", variables.id] });
        }
    });

    return { updateELearning };
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