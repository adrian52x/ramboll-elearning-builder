import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackActivityFormProps {
    question: string;
    onQuestionChange: (question: string) => void;
}

export function FeedbackActivityForm({ question, onQuestionChange }: FeedbackActivityFormProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea id="question" placeholder="Enter your feedback question" value={question} onChange={(e) => onQuestionChange(e.target.value)} />
        </div>
    );
}
