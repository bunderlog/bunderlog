import { reactive } from 'vue'
import { initExperiment, storage, track } from '../shared/experiment'

export const exp = initExperiment()

export const state = reactive({
  joined: storage.get('bl_joined') === '1',
  duplicate: false,
  /** set right after a new signup; opens the optional survey */
  surveyToken: '',
  engaged: false,
})

/** Counts a visitor as engaged the first time they focus the form or click a CTA. */
export function markEngaged() {
  if (state.engaged) return
  state.engaged = true
  track(exp, 'engage')
}

export function markJoined(res: { duplicate?: boolean; token?: string }) {
  state.joined = true
  state.duplicate = !!res.duplicate
  storage.set('bl_joined', '1')
  if (res.token) state.surveyToken = res.token
}
