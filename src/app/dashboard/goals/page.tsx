'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, CheckCircle2, Circle, Target, Filter, Search } from 'lucide-react'
import { ContentContainer } from '@/components/layout/content-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { GoalFormDialog } from '@/components/goal/goal-form-dialog'
import { useGoals, useDeleteGoal, useToggleGoalComplete } from '@/services/goal.queries'
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
import type { Goal } from '@/types/goal.types'

const TYPE_COLORS: Record<string, string> = {
  workouts: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  volume: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  calories: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  streak: 'bg-green-500/10 text-green-500 border-green-500/20',
  custom: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

const TYPE_LABELS: Record<string, string> = {
  workouts: 'Workouts',
  volume: 'Volume',
  calories: 'Calories',
  streak: 'Streak',
  custom: 'Custom',
}

const PERIOD_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  'one-time': 'One-time',
}

export default function GoalsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const { data: goals, isLoading, error } = useGoals()
  const deleteMutation = useDeleteGoal()
  const toggleMutation = useToggleGoalComplete()

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('Goal deleted')
          setDeleteId(null)
        },
        onError: () => {
          toast.error('Failed to delete goal')
        },
      })
    }
  }

  const handleToggle = (goal: Goal) => {
    toggleMutation.mutate(
      { id: goal.id, completed: !goal.completed },
      {
        onError: () => {
          toast.error('Failed to update goal')
        },
      },
    )
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormOpen(true)
  }

  const handleNew = () => {
    setEditingGoal(null)
    setFormOpen(true)
  }

  const filteredGoals = (goals || []).filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || g.type === filterType
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'completed' && g.completed) ||
      (filterStatus === 'active' && !g.completed)
    return matchesSearch && matchesType && matchesStatus
  })

  const totalGoals = (goals || []).length
  const completedGoals = (goals || []).filter((g) => g.completed).length
  const activeGoals = totalGoals - completedGoals

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
            Failed to load goals. Make sure the API server is running.
          </AlertDescription>
        </Alert>
      </ContentContainer>
    )
  }

  return (
    <ContentContainer>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Goals</h1>
          <p className="text-sm text-muted-foreground">
            {completedGoals} of {totalGoals} completed
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-muted-foreground">all time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{activeGoals}</div>
            <p className="text-xs text-muted-foreground">in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{completedGoals}</div>
            <p className="text-xs text-muted-foreground">achieved</p>
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
                placeholder="Search goals..."
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
                  <SelectItem value="workouts">Workouts</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="calories">Calories</SelectItem>
                  <SelectItem value="streak">Streak</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            All Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGoals.length === 0 ? (
            <div className="py-12 text-center">
              <Target className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-1 font-medium text-foreground">No goals found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {search || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first goal to start tracking'}
              </p>
              {!search && filterType === 'all' && filterStatus === 'all' && (
                <Button onClick={handleNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Goal
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGoals.map((goal) => {
                const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0
                return (
                  <div
                    key={goal.id}
                    className="rounded-xl border border-border/50 p-4 transition-colors hover:bg-secondary/30"
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggle(goal)}
                        className="mt-1 shrink-0"
                      >
                        {goal.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`font-medium ${goal.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                          >
                            {goal.title}
                          </p>
                          <Badge variant="outline" className={TYPE_COLORS[goal.type]}>
                            {TYPE_LABELS[goal.type]}
                          </Badge>
                          <Badge variant="outline" className="text-muted-foreground">
                            {PERIOD_LABELS[goal.period]}
                          </Badge>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {goal.current} / {goal.target} {goal.unit}
                            </span>
                            <span className="font-medium text-foreground">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {goal.deadline && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Deadline: {goal.deadline}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(goal)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(goal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <GoalFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        goal={editingGoal}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
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
