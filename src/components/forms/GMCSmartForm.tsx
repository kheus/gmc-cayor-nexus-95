import { ReactNode, useState } from "react"
import { useForm, UseFormReturn, FieldValues, DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodSchema } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, X } from "lucide-react"

interface GMCSmartFormProps<T extends FieldValues> {
  title: string
  description?: string
  icon?: ReactNode
  children: (form: UseFormReturn<T>) => ReactNode
  onSubmit: (data: T) => Promise<{ success: boolean; message?: string }>
  schema?: ZodSchema<T>
  defaultValues?: DefaultValues<T>
  isModal?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  submitLabel?: string
  cancelLabel?: string
  showCancel?: boolean
  disabled?: boolean
  className?: string
}

export function GMCSmartForm<T extends FieldValues>({
  title,
  description,
  icon,
  children,
  onSubmit,
  schema,
  defaultValues,
  isModal = false,
  isOpen = false,
  onOpenChange,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  showCancel = true,
  disabled = false,
  className = ""
}: GMCSmartFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues
  })

  const handleSubmit = async (data: T) => {
    if (disabled || isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await onSubmit(data)
      
      if (result.success) {
        toast({
          title: "Succès",
          description: result.message || "Données enregistrées avec succès"
        })
        
        form.reset()
        if (isModal && onOpenChange) {
          onOpenChange(false)
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.message || "Une erreur est survenue"
        })
      }
    } catch (error: any) {
      console.error('Erreur formulaire:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue est survenue"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {children(form)}
        
        <div className={`gmc-form-actions ${isModal ? 'border-t border-border pt-4 mt-6' : ''}`}>
          {showCancel && isModal && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              disabled={isSubmitting}
              className="gmc-button"
            >
              <X className="mr-2 h-4 w-4" />
              {cancelLabel}
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={disabled || isSubmitting}
            className="gmc-button gmc-button-primary"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Enregistrement..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )

  if (isModal) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className={`gmc-dialog-mobile ${className}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {icon}
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          
          <div className="gmc-dialog-content">
            {formContent}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Card className={`gmc-card-elevated ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="gmc-dialog-content">
        {formContent}
      </CardContent>
    </Card>
  )
}

// Hook utilitaire pour les sélecteurs automatiques
export function useFormSelectors() {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const getFormData = (key: string) => {
    return formData[key]
  }

  const resetFormData = () => {
    setFormData({})
  }

  return {
    formData,
    updateFormData,
    getFormData,
    resetFormData
  }
}