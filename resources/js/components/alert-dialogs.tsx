import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
    trigger: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
}

export function ConfirmDialog({
    title,
    description,
    onConfirm,
    onCancel,
    trigger,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default"
}: ConfirmDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

interface DeleteDialogProps {
    itemName: string;
    onConfirm: () => void;
    onCancel?: () => void;
    trigger: React.ReactNode;
}

export function DeleteDialog({
    itemName,
    onConfirm,
    onCancel,
    trigger
}: DeleteDialogProps) {
    return (
        <ConfirmDialog
            title="Are you absolutely sure?"
            description={`This action cannot be undone. This will permanently delete ${itemName} and remove the data from our servers.`}
            onConfirm={onConfirm}
            onCancel={onCancel}
            trigger={trigger}
            confirmText="Delete"
            cancelText="Cancel"
            variant="destructive"
        />
    );
}

interface SaveDialogProps {
    onConfirm: () => void;
    onCancel?: () => void;
    trigger: React.ReactNode;
    hasUnsavedChanges?: boolean;
}

export function SaveDialog({
    onConfirm,
    onCancel,
    trigger,
    hasUnsavedChanges = true
}: SaveDialogProps) {
    return (
        <ConfirmDialog
            title="Save Changes?"
            description={
                hasUnsavedChanges
                    ? "You have unsaved changes. Do you want to save them before continuing?"
                    : "Are you sure you want to save these changes?"
            }
            onConfirm={onConfirm}
            onCancel={onCancel}
            trigger={trigger}
            confirmText="Save"
            cancelText="Don't Save"
        />
    );
}

interface SuccessDialogProps {
    title?: string;
    description: string;
    onConfirm: () => void;
    trigger: React.ReactNode;
    confirmText?: string;
}

export function SuccessDialog({
    title = "Success!",
    description,
    onConfirm,
    trigger,
    confirmText = "OK"
}: SuccessDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-green-600">{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

interface ErrorDialogProps {
    title?: string;
    description: string;
    onConfirm: () => void;
    trigger: React.ReactNode;
    confirmText?: string;
}

export function ErrorDialog({
    title = "Error",
    description,
    onConfirm,
    trigger,
    confirmText = "OK"
}: ErrorDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
