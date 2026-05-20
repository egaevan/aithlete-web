'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, CheckCircle2, Circle, Calendar, Filter, Search } from 'lucide-react'
import { ContentContainer } from '@/components/layout/content-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScheduleFormDialog } from '@/components/schedule/schedule-form-dialog'
import { useSchedules, useDeleteSchedule, useToggleScheduleComplete } from '@/services/schedule.queries'
import { useTodaySchedule } from '@/services/schedule.queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { Schedule } from '@/types/schedule.types'

const TYPE_COLORS: Record<string, string> = {
  workout: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  cardio: 'bg-red-500/10 text-red-500 border-red-500/20',
  rest: 'bg-green-500/10 text-green-500 border-green-500/20',
  stretching: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  custom: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
}

const TYPE_LABELS: Record<string, string> = {
  workout: 'Workout',
  cardio: 'Cardio',
  rest: 'Rest',
  stretching: 'Stretching',
  custom: 'Custom',
}

export default function SchedulePage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const { data: schedules, isLoading, error } = useSchedules()
  const { data: todaySchedules } = useTodaySchedule()
  const deleteMutation = useDeleteSchedule()
  const toggleMutation = useToggleScheduleComplete()

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('Schedule deleted')
          setDeleteId(null)
        },
        onError: () => {
          toast.error('Failed to delete schedule')
        },
      })
    }
  }

  const handleToggle = (schedule: Schedule) => {
    toggleMutation.mutate(
      { id: schedule.id, completed: !schedule.completed },
      {
        onError: () => {
          toast.error('Failed to update schedule')
        },
      },
    )
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setFormOpen(true)
  }

  const handleNew = () => {
    setEditingSchedule(null)
    setFormOpen(true)
  }

  const filteredSchedules = (schedules || []).filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.notes?.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || s.type === filterType
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'completed' && s.completed) ||
      (filterStatus === 'pending' && !s.completed)
    return matchesSearch && matchesType && matchesStatus
  })

  const todayCount = (todaySchedules || []).length
  const completedToday = (todaySchedules || []).filter((s) => s.completed).length

  if (isLoading) {
    return (
      <ContentContainer>
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </ContentContainer>
    )
  }

  if (error) {
    return (
      <ContentContainer>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load schedules. Make sure the API server is running.
          </AlertDescription>
        </Alert>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
          <p className="text-sm text-muted-foreground">
            {completedToday} of {todayCount} completed today
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Schedule
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
            <p className="text-xs text-muted-foreground">scheduled activities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{completedToday}</div>
            <p className="text-xs text-muted-foreground">done today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedules?.length || 0}</div>
            <p className="text-xs text-muted-foreground">all schedules</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search schedules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="workout">Workout</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="rest">Rest</SelectItem>
                  <SelectItem value="stretching">Stretching</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Schedules
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSchedules.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-1 font-medium text-foreground">No schedules found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {search || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first schedule to get started'}
              </p>
              {!search && filterType === 'all' && filterStatus === 'all' && (
                <Button onClick={handleNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Schedule
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center gap-4 rounded-xl border border-border/50 p-4 transition-colors hover:bg-secondary/30"
                >
                  <button
                    onClick={() => handleToggle(schedule)}
                    className="shrink-0"
                  >
                    {schedule.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-medium ${schedule.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                      >
                        {schedule.title}
                      </p>
                      <Badge variant="outline" className={TYPE_COLORS[schedule.type]}>
                        {TYPE_LABELS[schedule.type]}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{schedule.date}</span>
                      <span>{schedule.time}</span>
                      <span>{schedule.duration}</span>
                      {schedule.notes && (
                        <span className="truncate max-w-48">{schedule.notes}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(schedule)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ScheduleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        schedule={editingSchedule}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentContainer>
  )
}
