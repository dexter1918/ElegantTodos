import { useEffect } from "react";
import { Todo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

const todoSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Task description is required"),
  completed: z.boolean(),
  notes: z.string().optional(),
  priority: z.boolean().optional(),
  dueDate: z.string().optional(),
  category: z.enum(["work", "personal", "errands", "other"]).optional(),
});

type TodoSchema = z.infer<typeof todoSchema>;

interface TodoEditorProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Todo) => void;
}

export function TodoEditor({ todo, isOpen, onClose, onSave }: TodoEditorProps) {
  const form = useForm<TodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      id: "",
      text: "",
      completed: false,
      notes: "",
      priority: false,
      dueDate: "",
      category: "work",
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
        notes: todo.notes || "",
        priority: todo.priority || false,
        dueDate: todo.dueDate || "",
        category: todo.category || "work",
      });
    }
  }, [todo, form]);

  const handleSubmit = (data: TodoSchema) => {
    onSave(data as Todo);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="floating-editor bg-white dark:bg-gray-800 shadow-lg w-full max-w-lg p-6 sm:max-w-md" style={{ borderRadius: '0.5rem' }}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">Edit Task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Task Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Options</h3>

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-700 dark:text-gray-300">Mark as high priority</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                        <SelectItem value="work" className="dark:text-gray-200">Work</SelectItem>
                        <SelectItem value="personal" className="dark:text-gray-200">Personal</SelectItem>
                        <SelectItem value="errands" className="dark:text-gray-200">Errands</SelectItem>
                        <SelectItem value="other" className="dark:text-gray-200">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
