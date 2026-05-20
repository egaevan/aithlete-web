'use client'

import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateGoal, useUpdateGoal } from '@/services/goal.queries'
import { toast } from 'sonner'
import type { Goal } from '@/types/goal.types'

const goalSchema = z.object({
  title: z.string().min(1, 'Goal title is required'),
  type: z.enum(['workouts', 'volume', 'calories', 'streak', 'custom']),
  target: z.coerce.number().min(1, 'Target must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  period: z.enum(['weekly', 'monthly', 'one-time']),
  deadline: z.string().optional(),
})

type GoalFormData = z.infer<typeof goalSchema>

interface GoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: Goal | null
}

const GOAL_TYPES = [
  { value: 'workouts', label: 'Workouts', defaultUnit: 'sessions' },
  { value: 'volume', label: 'Volume', defaultUnit: 'lbs' },
  { value: 'calories', label: 'Calories', defaultUnit: 'kcal' },
  { value: 'streak', label: 'Streak', defaultUnit: 'days' },
  { value: 'custom', label: 'Custom', defaultUnit: '' },
]

const GOAL_PERIODS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'one-time', label: 'One-time' },
]

export function GoalFormDialog({ open, onOpenChange, goal }: GoalFormDialogProps) {
  const createMutation = useCreateGoal()
  const updateMutation = useUpdateGoal()
  const isEditing = !!goal

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      type: 'workouts',
      target: 10,
      unit: 'sessions',
      period: 'weekly',
      deadline: '',
    },
  })

  useEffect(() => {
    if (goal && open) {
      form.reset({
        title: goal.title,
        type: goal.type,
        target: goal.target,
        unit: goal.unit,
        period: goal.period,
        deadline: goal.deadline || '',
      })
    } else if (!open) {
      form.reset({
        title: '',
        type: 'workouts',
        target: 10,
        unit: 'sessions',
        period: 'weekly',
        deadline: '',
      })
    }
  }, [goal, open, form])

  const handleTypeChange = (value: GoalFormData['type']) => {
    form.setValue('type', value)
    const typeConfig = GOAL_TYPES.find((t) => t.value === value)
    if (typeConfig?.defaultUnit) {
      form.setValue('unit', typeConfig.defaultUnit)
    }
  }

  const onSubmit = (data: GoalFormData) => {
    const payload = {
      ...data,
      deadline: data.deadline || undefined,
    }

    if (isEditing && goal) {
      updateMutation.mutate(
        { id: goal.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Goal updated successfully!')
            onOpenChange(false)
          },
          onError: () => {
            toast.error('Failed to update goal')
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Goal created successfully!')
          onOpenChange(false)
        },
        onError: () => {
          toast.error('Failed to create goal')
        },
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Goal' : 'New Goal'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the goal details.' : 'Set a new fitness goal to track your progress.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Title</Label>
            <Input id="goal-title" placeholder="e.g. Run 100 miles this month" {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goal-type">Type</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(value) => handleTypeChange(value as GoalFormData['type'])}
              >
                <SelectTrigger id="goal-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-period">Period</Label>
              <Select
                value={form.watch('period')}
                onValueChange={(value) => form.setValue('period', value as GoalFormData['period'])}
              >
                <SelectTrigger id="goal-period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_PERIODS.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goal-target">Target</Label>
              <Input id="goal-target" type="number" min={1} {...form.register('target')} />
              {form.formState.errors.target && (
                <p className="text-sm text-destructive">{form.formState.errors.target.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-unit">Unit</Label>
              <Input id="goal-unit" placeholder="e.g. sessions, lbs, kcal" {...form.register('unit')} />
              {form.formState.errors.unit && (
                <p className="text-sm text-destructive">{form.formState.errors.unit.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-deadline">Deadline (optional)</Label>
            <Input id="goal-deadline" type="date" {...form.register('deadline')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
