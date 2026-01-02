
// This "Brain" helps us pick icons even for custom user names
export function getSmartIcon(title: string): string {
  const t = title.toLowerCase();
  
  if (t.includes('wedding') || t.includes('phera') || t.includes('muhurtham')) return '💍';
  if (t.includes('haldi') || t.includes('pelli') || t.includes('holud')) return '🌼';
  if (t.includes('mehendi') || t.includes('henna')) return '🌿';
  if (t.includes('sangeet') || t.includes('dance') || t.includes('garba') || t.includes('jaggo')) return '💃';
  if (t.includes('reception') || t.includes('party') || t.includes('cocktail')) return '🥂';
  if (t.includes('trousseau') || t.includes('daily') || t.includes('work')) return '✨';
  if (t.includes('vacation') || t.includes('trip') || t.includes('honeymoon')) return '✈️';
  if (t.includes('jewel') || t.includes('gold')) return '💎';
  
  return '📁'; // Default Folder Icon
}
