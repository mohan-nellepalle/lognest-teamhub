import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useState } from "react";
import { workLogService } from "@/services/api";

// Define form data type
interface WorkLogFormData {
    taskId: string;
    description: string;
    timeSpent: string;
    date: string;
    userId: number;
}

// Define error type
interface FormErrors {
    taskId?: string;
    description?: string;
    timeSpent?: string;
    date?: string;
}

const LogWorkModal = ({ isOpen, onClose, onWorkLogAdded }: any) => {
    // Corrected form state with type
    const userDataString = localStorage.getItem("saavik_user");
    const userData = userDataString ? JSON.parse(userDataString) : null;

    const [formData, setFormData] = useState<WorkLogFormData>({
        taskId: "",
        description: "",
        timeSpent: "",
        date: "",
        userId: userData?._id || "",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Validate Form
    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.taskId) newErrors.taskId = "Task ID is required.";
        if (!formData.description) newErrors.description = "Description is required.";
        if (!formData.timeSpent) newErrors.timeSpent = "Time spent is required.";
        if (!formData.date) newErrors.date = "Date is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            userId: userData?._id, // Add userId dynamically
        });
    };

    // Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await workLogService.createWorkLog(formData);
            toast.success("Work log added successfully!");
            onWorkLogAdded(); // Refresh work logs
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error adding work log:", error);
            toast.error("Failed to add work log. Please try again.");
        }
    };

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Log Work</DialogTitle>
                    <DialogDescription>Fill out the details to log your work.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Task ID */}
                    <div className="space-y-2">
                        <Label htmlFor="taskId">Task ID</Label>
                        <Input
                            type="text"
                            name="taskId"
                            value={formData.taskId}
                            onChange={handleChange}
                            placeholder="Enter Task ID"
                        />
                        {errors.taskId && <p className="text-red-500 text-sm">{errors.taskId}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter work description"
                            rows={3}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>

                    {/* Time Spent */}
                    <div className="space-y-2">
                        <Label htmlFor="timeSpent">Time Spent (minutes)</Label>
                        <Input
                            type="number"
                            name="timeSpent"
                            value={formData.timeSpent}
                            onChange={handleChange}
                            placeholder="Enter time spent in minutes"
                        />
                        {errors.timeSpent && <p className="text-red-500 text-sm">{errors.timeSpent}</p>}
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={today} // This prevents selecting past dates
                            max={today}
                        />
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Submit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LogWorkModal;
