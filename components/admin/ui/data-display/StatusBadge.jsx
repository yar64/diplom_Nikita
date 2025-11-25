const statusConfig = {
  Received: {
    color: 'green',
    label: 'Received'
  },
  Pending: {
    color: 'amber', 
    label: 'Pending'
  },
  Active: {
    color: 'green',
    label: 'Active'
  },
  Inactive: {
    color: 'amber',
    label: 'Inactive'
  },
  Student: {
    color: 'blue',
    label: 'Student'
  },
  Teacher: {
    color: 'purple',
    label: 'Teacher'
  }
};

export function StatusBadge({ 
  status, 
  className = "",
  'data-testid': testId,
  ...props 
}) {
  const config = statusConfig[status] || statusConfig.Received;

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      data-testid={testId}
      data-status={status}
      {...props}
    >
      {config.label}
    </span>
  );
}