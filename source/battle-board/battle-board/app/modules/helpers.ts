export default function formatDate(dateStr: Date): string {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return formattedDate;
}