import React from 'react'

type AlertProps = {
  message: string
  type: 'error' | 'success'
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500'
  
  return (
    <div className={`${bgColor} text-white p-4 rounded-md mb-4`}>
      {message}
    </div>
  )
}

export default Alert