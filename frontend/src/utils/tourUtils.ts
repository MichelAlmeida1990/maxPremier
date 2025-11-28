const TOUR_STORAGE_KEY = 'maxpremier-tour-completed'

export function hasCompletedTour(): boolean {
  return localStorage.getItem(TOUR_STORAGE_KEY) === 'true'
}

export function markTourAsCompleted(): void {
  localStorage.setItem(TOUR_STORAGE_KEY, 'true')
}

export function resetTour(): void {
  localStorage.removeItem(TOUR_STORAGE_KEY)
}

