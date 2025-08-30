export function getCurrentTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getCurrentWeekRange(): string {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
  
  return `${startMonth} ${startOfWeek.getDate()}-${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
}

export function getDayName(dayOfWeek: number): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayOfWeek];
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function getCurrentActivity(scheduleItems: any[]): any | null {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const todayItems = scheduleItems.filter(item => item.dayOfWeek === currentDay);
  
  for (const item of todayItems) {
    if (currentTime >= item.startTime && currentTime < item.endTime) {
      return item;
    }
  }
  
  return null;
}

export function getNextActivity(scheduleItems: any[]): any | null {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // First check if there's a current activity, then find the one right after it
  const currentActivity = getCurrentActivity(scheduleItems);
  
  // Find next activity today (either after current time or after current activity)
  const todayItems = scheduleItems
    .filter(item => {
      if (item.dayOfWeek !== currentDay) return false;
      if (currentActivity) {
        // If there's a current activity, find the next one after it
        return item.startTime > currentActivity.endTime;
      } else {
        // If no current activity, find next one after current time
        return item.startTime > currentTime;
      }
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  if (todayItems.length > 0) {
    return todayItems[0];
  }
  
  // Find first activity tomorrow or next days
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7;
    const nextDayItems = scheduleItems
      .filter(item => item.dayOfWeek === nextDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    if (nextDayItems.length > 0) {
      return nextDayItems[0];
    }
  }
  
  return null;
}

export function getTimeUntilNext(item: any): string {
  if (!item) return '';
  
  const now = new Date();
  const [hours, minutes] = item.startTime.split(':').map(Number);
  const nextTime = new Date();
  nextTime.setHours(hours, minutes, 0, 0);
  
  // If it's for tomorrow or later, adjust the date
  if (item.dayOfWeek !== now.getDay() || nextTime <= now) {
    const daysUntil = item.dayOfWeek > now.getDay() 
      ? item.dayOfWeek - now.getDay()
      : 7 - (now.getDay() - item.dayOfWeek);
    nextTime.setDate(now.getDate() + daysUntil);
  }
  
  const diff = nextTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diff / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `in ${diffMinutes} minutes`;
  } else if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60);
    return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(diffMinutes / 1440);
    return `in ${days} day${days > 1 ? 's' : ''}`;
  }
}

export function getTimeRemaining(item: any): string {
  if (!item) return '';
  
  const now = new Date();
  const [endHours, endMinutes] = item.endTime.split(':').map(Number);
  const endTime = new Date();
  endTime.setHours(endHours, endMinutes, 0, 0);
  
  const diff = endTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diff / (1000 * 60));
  
  if (diffMinutes <= 0) return 'ending now';
  if (diffMinutes < 60) return `${diffMinutes} min remaining`;
  
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return `${hours}h ${mins}m remaining`;
}
