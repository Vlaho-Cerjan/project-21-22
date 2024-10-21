export default function GetColorByType(type: string) {
  switch (type) {
    case 'channel':
      return '#457B9D';
    case 'playlist':
      return '#FB8500';
    case 'media':
      return '#E63946';
    case 'schedule':
      return '#2A9D8F';
    default:
      return '#457B9D';
  }
}
