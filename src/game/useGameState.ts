import { useCallback, useEffect, useMemo, useState } from 'react'

import { getJson, setJson } from '../lib/storage'
import { randomSeed } from '../lib/seededRng'
import { START_NODE_ID, storyNodes } from './story'

const STORAGE_KEY = 'alterEgo.game.v3'

type Decision = {
  nodeId: string
  choiceId: string
  chosenAt: number
}

type GeneratedNode = {
  sceneText?: string
  choiceLabels?: Record<string, string>
}

type RewardState =
  | { status: 'none' }
  | { status: 'generating'; startedAt: number }
  | {
      status: 'ready'
      preparedAt: number
      archetypeId: 'builder' | 'explorer' | 'rebel' | 'caregiver'
      reflection?: string
      rewardImagePrompt: string
    }
  | { status: 'error'; message: string }

type SavedGame = {
  version: 3
  runId: string
  seed: string
  currentNodeId: string
  history: string[]
  decisions: Decision[]
  generated: Record<string, GeneratedNode | undefined>
  reward: RewardState
  locationId?: 'usa' | 'brazil' | 'china' | 'japan'
}

function newRunId() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`
}

function initialGame(): SavedGame {
  return {
    version: 3,
    runId: newRunId(),
    seed: randomSeed(),
    currentNodeId: START_NODE_ID,
    history: [],
    decisions: [],
    generated: {},
    reward: { status: 'none' },
  }
}

function isValidSavedGame(value: unknown): value is SavedGame {
  if (!value || typeof value !== 'object') return false
  const v = value as Partial<SavedGame>
  return (
    v.version === 3 &&
    typeof v.runId === 'string' &&
    typeof v.seed === 'string' &&
    typeof v.currentNodeId === 'string' &&
    Array.isArray(v.history) &&
    Array.isArray(v.decisions) &&
    typeof v.generated === 'object' &&
    v.generated !== null &&
    typeof v.reward === 'object' &&
    v.reward !== null
  )
}

export function useGameState() {
  const [state, setState] = useState<SavedGame>(() => {
    const raw = getJson<unknown>(STORAGE_KEY, null)
    if (isValidSavedGame(raw) && raw.currentNodeId in storyNodes) return raw
    return initialGame()
  })

  useEffect(() => {
    setJson(STORAGE_KEY, state)
  }, [state])

  const node = useMemo(() => storyNodes[state.currentNodeId], [state.currentNodeId])

  const canGoBack = state.history.length > 0
  const isEnding = Boolean(node?.isEnding || !node?.choices?.length)

  const choose = useCallback(
    (choiceId: string) => {
      setState((prev) => {
        const current = storyNodes[prev.currentNodeId]
        const choice = current?.choices?.find((c) => c.id === choiceId)
        if (!choice) return prev
        if (!(choice.nextNodeId in storyNodes)) return prev

        return {
          ...prev,
          currentNodeId: choice.nextNodeId,
          history: [...prev.history, prev.currentNodeId],
          decisions: [
            ...prev.decisions,
            { nodeId: prev.currentNodeId, choiceId, chosenAt: Date.now() },
          ],
        }
      })
    },
    [setState],
  )

  const back = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev
      const nextId = prev.history[prev.history.length - 1]
      if (!(nextId in storyNodes)) return prev
      return {
        ...prev,
        currentNodeId: nextId,
        history: prev.history.slice(0, -1),
        decisions: prev.decisions.slice(0, -1),
      }
    })
  }, [])

  const restart = useCallback(() => {
    setState((prev) => {
      const next = initialGame()
      return prev.locationId ? { ...next, locationId: prev.locationId } : next
    })
  }, [])

  const setGeneratedText = useCallback((nodeId: string, sceneText: string) => {
    setState((prev) => ({
      ...prev,
      generated: {
        ...prev.generated,
        [nodeId]: { ...(prev.generated[nodeId] ?? {}), sceneText },
      },
    }))
  }, [])

  const setGeneratedChoiceLabels = useCallback(
    (nodeId: string, choiceLabels: Record<string, string>) => {
      setState((prev) => ({
        ...prev,
        generated: {
          ...prev.generated,
          [nodeId]: { ...(prev.generated[nodeId] ?? {}), choiceLabels },
        },
      }))
    },
    [],
  )

  const setReward = useCallback((reward: RewardState) => {
    setState((prev) => ({ ...prev, reward }))
  }, [])

  const clearSave = useCallback(() => {
    setState(initialGame())
  }, [])

  const setLocationId = useCallback((locationId: SavedGame['locationId']) => {
    setState((prev) => ({ ...prev, locationId }))
  }, [])

  return {
    state,
    node,
    canGoBack,
    isEnding,
    choose,
    back,
    restart,
    clearSave,
    setGeneratedText,
    setGeneratedChoiceLabels,
    setReward,
    setLocationId,
  }
}
