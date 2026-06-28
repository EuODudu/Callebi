import { initialBooking, type BookingState } from "./types";

const STORAGE_KEY = "callebi-booking-draft";

export type BookingDraft = {
  step: number;
  booking: BookingState;
};

export function loadBookingDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookingDraft;
    if (!parsed?.booking || typeof parsed.step !== "number") return null;

    const data = parsed.booking.dateTime?.data;
    if (typeof data === "string") {
      parsed.booking.dateTime.data = new Date(data);
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveBookingDraft(step: number, booking: BookingState): void {
  if (typeof window === "undefined") return;
  try {
    const payload: BookingDraft = {
      step,
      booking: {
        ...booking,
        dateTime: {
          ...booking.dateTime,
          data: booking.dateTime.data,
        },
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage indisponível — ignora
  }
}

export function clearBookingDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function hasDraftContent(booking: BookingState): boolean {
  return JSON.stringify(booking) !== JSON.stringify(initialBooking);
}
