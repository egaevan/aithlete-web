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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateSchedule, useUpdateSchedule } from '@/services/schedule.queries'
import { toast } from 'sonner'
import type { Schedule } from '@/types/schedule.types'

const scheduleSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  title: z.string().min(1, 'Title is required'),
  duration: z.string().min(1, 'Duration is required'),
  type: z.enum(['workout', 'cardio', 'rest', 'stretching', 'custom']),
  notes: z.string().optional(),
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

interface ScheduleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule?: Schedule | null
}

const SCHEDULE_TYPES = [
  { value: 'workout', label: 'Workout' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'rest', label: 'Rest' },
  { value: 'stretching', label: 'Stretching' },
  { value: 'custom', label: 'Custom' },
]

export function ScheduleFormDialog({ open, onOpenChange, schedule }: ScheduleFormDialogProps) {
  const createMutation = useCreateSchedule()
  const updateMutation = useUpdateSchedule()
  const isEditing = !!schedule

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: '07:00',
      title: '',
      duration: '30 min',
      type: 'workout',
      notes: '',
    },
  })

  useEffect(() => {
    if (schedule && open) {
      form.reset({
        date: schedule.date,
        time: schedule.time,
        title: schedule.title,
        duration: schedule.duration,
        type: schedule.type,
        notes: schedule.notes || '',
      })
    } else if (!open) {
      form.reset({
        date: new Date().toISOString().split('T')[0],
        time: '07:00',
        title: '',
        duration: '30 min',
        type: 'workout',
        notes: '',
      })
    }
  }, [schedule, open, form])

  const onSubmit = (data: ScheduleFormData) => {
    if (isEditing && schedule) {
      updateMutation.mutate(
        { id: schedule.id, data },
        {
          onSuccess: () => {
            toast.success('Schedule updated successfully!')
            onOpenChange(false)
          },
          onError: () => {
            toast.error('Failed to update schedule')
          },
        },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Schedule created successfully!')
          onOpenChange(false)
        },
        onError: () => {
          toast.error('Failed to create schedule')
        },
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Schedule' : 'New Schedule'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the schedule details.' : 'Add a new workout or activity to your schedule.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-title">Title</Label>
            <Input id="schedule-title" placeholder="e.g. Morning Run" {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Date</Label>
              <Input id="schedule-date" type="date" {...form.register('date')} />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">Time</Label>
              <Input id="schedule-time" type="time" {...form.register('time')} />
              {form.formState.errors.time && (
                <p className="text-sm text-destructive">{form.formState.errors.time.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schedule-duration">Duration</Label>
              <Input id="schedule-duration" placeholder="e.g. 30 min" {...form.register('duration')} />
              {form.formState.errors.duration && (
                <p className="text-sm text-destructive">{form.formState.errors.duration.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-type">Type</Label>
              <Select
                value={form.watch('type')}
                onValueChange={(value) => form.setValue('type', value as ScheduleFormData['type'])}
              >
                <SelectTrigger id="schedule-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {SCHEDULE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-notes">Notes (optional)</Label>
            <Textarea id="schedule-notes" placeholder="Any additional notes..." {...form.register('notes')} />
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
