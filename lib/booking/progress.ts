/**
 * Bridge between /reservar UI progress and the chatbot guide.
 * Page publishes; ChatWidget subscribes and asks ConversationEngine to advance.
 */

export type BookingUiProgress = {
  /**
   * Highest stage completed on the form:
   * 0 = none, 1 = treatment, 2 = date+time, 3 = contact,
   * 4 = payment engaged, 5 = confirmed
   */
  completed: number;
  isHighEnd: boolean;
  serviceName?: string;
};

/** Guide index to *show* next (0=Paso1 already in intro, 1=Paso2, …, 5=done). */
export function mapProgressToGuideIndex(progress: BookingUiProgress): number {
  const { completed, isHighEnd } = progress;

  if (completed >= 5) return 5;

  if (isHighEnd) {
    // Skip calendar + payment: treatment → datos → solicitar valoración
    if (completed >= 3) return 4;
    if (completed >= 1) return 2;
    return 0;
  }

  if (completed >= 4) return 4;
  if (completed >= 3) return 3;
  if (completed >= 2) return 2;
  if (completed >= 1) return 1;
  return 0;
}

type Listener = (progress: BookingUiProgress) => void;

const listeners = new Set<Listener>();
let latest: BookingUiProgress | null = null;

export function publishBookingProgress(progress: BookingUiProgress) {
  latest = progress;
  listeners.forEach((l) => l(progress));
}

export function subscribeBookingProgress(listener: Listener) {
  listeners.add(listener);
  if (latest) listener(latest);
  return () => {
    listeners.delete(listener);
  };
}

export function getLatestBookingProgress() {
  return latest;
}

export function resetBookingProgress() {
  latest = null;
}
