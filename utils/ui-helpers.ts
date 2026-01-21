/**
 * UI Helper functions for comfort index visualization
 */

export function getComfortColor(comfortIndex: number): string {
  // 80-100: Excellent (green)
  if (comfortIndex >= 80) return 'bg-green-100 text-green-800 border-2 border-green-300';
  // 60-79: Good (light green)
  if (comfortIndex >= 60) return 'bg-lime-100 text-lime-800 border-2 border-lime-300';
  // 40-59: Fair (yellow)
  if (comfortIndex >= 40) return 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300';
  // 20-39: Poor (orange)
  if (comfortIndex >= 20) return 'bg-orange-100 text-orange-800 border-2 border-orange-300';
  // 0-19: Very Poor (red)
  return 'bg-red-100 text-red-800 border-2 border-red-300';
}

export function getComfortEmoji(comfortIndex: number): string {
  if (comfortIndex >= 80) return '😍';
  if (comfortIndex >= 60) return '😊';
  if (comfortIndex >= 40) return '😐';
  if (comfortIndex >= 20) return '😕';
  return '😢';
}

export function getComfortLabel(comfortIndex: number): string {
  if (comfortIndex >= 80) return 'Excellent';
  if (comfortIndex >= 60) return 'Good';
  if (comfortIndex >= 40) return 'Fair';
  if (comfortIndex >= 20) return 'Poor';
  return 'Very Poor';
}
