export function fadeInBottom(
  type: string = 'spring',
  duration: number = 0.5,
  translateY: number = 60
) {
  return {
    enter: {
      y: 0,
      opacity: 1,
      transition: { type, duration },
    },
    exit: {
      y: translateY,
      opacity: 0,
      transition: { type, duration },
    },
  };
}
