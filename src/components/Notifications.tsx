import { useEffect, useState } from 'react';

export default function Notification({ message, type, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
      {message}
    </div>
  );
}