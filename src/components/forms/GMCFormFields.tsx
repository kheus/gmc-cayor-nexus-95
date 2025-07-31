import { ReactNode } from "react"
import { UseFormReturn, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BaseFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  label: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type?: "text" | "email" | "tel" | "number" | "password"
}

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: SelectOption[]
  onValueChange?: (value: string) => void
}

interface CheckboxFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options?: SelectOption[]
}

interface DateFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  minDate?: Date
  maxDate?: Date
  disabledDates?: (date: Date) => boolean
}

// Section wrapper pour grouper les champs
interface FormSectionProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  className?: string
}

export function FormSection({ 
  title, 
  icon, 
  children, 
  collapsible = false,
  defaultOpen = true,
  className = ""
}: FormSectionProps) {
  return (
    <div className={`gmc-form-section ${className}`}>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
        {icon}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// Champ texte intelligent
export function GMCTextField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  type = "text",
  className = ""
}: TextFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className="gmc-input-focus"
              {...field}
            />
          </FormControl>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Zone de texte
export function GMCTextareaField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  description,
  required = false,
  disabled = false,
  className = ""
}: BaseFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              className="gmc-input-focus min-h-[80px] resize-none"
              {...field}
            />
          </FormControl>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Sélecteur
export function GMCSelectField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "Sélectionner...",
  options,
  description,
  required = false,
  disabled = false,
  onValueChange,
  className = ""
}: SelectFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value)
              onValueChange?.(value)
            }} 
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="gmc-input-focus">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-60">
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Case à cocher multiple
export function GMCCheckboxField<T extends FieldValues>({
  form,
  name,
  label,
  options = [],
  description,
  required = false,
  disabled = false,
  className = ""
}: CheckboxFieldProps<T>) {
  if (options.length === 0) {
    // Simple checkbox
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className={`flex flex-row items-start space-x-3 space-y-0 ${className}`}>
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center gap-1">
                {label}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  // Multiple checkboxes
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <FormLabel className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option) => (
              <FormField
                key={option.value}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(field.value || []), option.value])
                            : field.onChange(
                                field.value?.filter((value: string) => value !== option.value)
                              )
                        }}
                        disabled={disabled || option.disabled}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-sm">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Sélecteur de date optimisé mobile
export function GMCDateField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "Sélectionner une date",
  description,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  disabledDates,
  className = ""
}: DateFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full pl-3 text-left font-normal gmc-input-focus",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "dd/MM/yyyy")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => {
                  if (disabled) return true
                  if (minDate && date < minDate) return true
                  if (maxDate && date > maxDate) return true
                  if (disabledDates && disabledDates(date)) return true
                  return false
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Grid responsive pour les champs
export function FormGrid({ children, cols = 2, className = "" }: { 
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  className?: string 
}) {
  const gridClass = cols === 1 ? "gmc-form-grid-full" : "gmc-form-grid"
  
  return (
    <div className={`${gridClass} ${className}`}>
      {children}
    </div>
  )
}