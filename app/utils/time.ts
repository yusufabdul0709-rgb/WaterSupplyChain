export function getTimeBasedGreeting(): { greeting: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: 'Good Morning', emoji: '🌅' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Good Afternoon', emoji: '☀️' };
  } else if (hour >= 17 && hour < 22) {
    return { greeting: 'Good Evening', emoji: '🌆' };
  } else {
    return { greeting: 'Good Night', emoji: '🌙' };
  }
}

export function formatCountdown(targetIsoDate: string): { hours: number; minutes: number; seconds: number; formatted: string } {
  const diffMs = new Date(targetIsoDate).getTime() - Date.now();
  if (diffMs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, formatted: '00:00:00' };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return { hours, minutes, seconds, formatted };
}

export function formatDateString(dateStr?: string): string {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}
