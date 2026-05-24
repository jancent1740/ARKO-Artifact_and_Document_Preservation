import React from 'react';

type StatusType =
  | 'Published'
  | 'Pending Review'
  | 'Pending'
  | 'Draft'
  | 'Urgent'
  | 'Completed'
  | 'In Progress'
  | 'Active'
  | 'Inactive'
  | 'On Hold'
  | 'Excellent'
  | 'Good'
  | 'Fair'
  | 'Poor'
  | 'OK'
  | 'Flagged'
  | 'Approved'
  | 'Rejected'
  | 'Members Only'
  | 'Submitted'
  | 'High Quality'
  | 'Very High Quality'
  | 'Expired';

interface StatusConfig {
  bg: string;
  text: string;
  border: string;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  // Approved / Published / Public → green muted
  'Published': {
    bg: 'bg-[#22C55E]/[0.12]',
    text: 'text-[#22C55E]',
    border: 'border border-[#22C55E]/20',
  },
  'Approved': {
    bg: 'bg-[#22C55E]/[0.12]',
    text: 'text-[#22C55E]',
    border: 'border border-[#22C55E]/20',
  },
  'Active': {
    bg: 'bg-[#22C55E]/[0.12]',
    text: 'text-[#22C55E]',
    border: 'border border-[#22C55E]/20',
  },
  'Completed': {
    bg: 'bg-[#22C55E]/[0.12]',
    text: 'text-[#22C55E]',
    border: 'border border-[#22C55E]/20',
  },
  'Excellent': {
    bg: 'bg-[#22C55E]/[0.12]',
    text: 'text-[#22C55E]',
    border: 'border border-[#22C55E]/20',
  },
  'Good': {
    bg: 'bg-[#22C55E]/[0.12]',
    text: 'text-[#22C55E]',
    border: 'border border-[#22C55E]/20',
  },
  'High Quality': {
    bg: 'bg-[#22C55E]/[0.12]',
    text: 'text-[#22C55E]',
    border: 'border border-[#22C55E]/20',
  },
  'Very High Quality': {
    bg: 'bg-[#22C55E]/[0.12]',
    text: 'text-[#22C55E]',
    border: 'border border-[#22C55E]/20',
  },
  // Pending / Submitted → yellow muted
  'Pending Review': {
    bg: 'bg-[#EAB308]/[0.12]',
    text: 'text-[#EAB308]',
    border: 'border border-[#EAB308]/20',
  },
  'Pending': {
    bg: 'bg-[#EAB308]/[0.12]',
    text: 'text-[#EAB308]',
    border: 'border border-[#EAB308]/20',
  },
  'Submitted': {
    bg: 'bg-[#EAB308]/[0.12]',
    text: 'text-[#EAB308]',
    border: 'border border-[#EAB308]/20',
  },
  'In Progress': {
    bg: 'bg-[#EAB308]/[0.12]',
    text: 'text-[#EAB308]',
    border: 'border border-[#EAB308]/20',
  },
  'Fair': {
    bg: 'bg-[#EAB308]/[0.12]',
    text: 'text-[#EAB308]',
    border: 'border border-[#EAB308]/20',
  },
  'On Hold': {
    bg: 'bg-[#EAB308]/[0.12]',
    text: 'text-[#EAB308]',
    border: 'border border-[#EAB308]/20',
  },
  // Rejected / Urgent / Flagged / Poor → red muted
  'Rejected': {
    bg: 'bg-[#EF4444]/[0.12]',
    text: 'text-[#EF4444]',
    border: 'border border-[#EF4444]/20',
  },
  'Urgent': {
    bg: 'bg-[#EF4444]/[0.12]',
    text: 'text-[#EF4444]',
    border: 'border border-[#EF4444]/20',
  },
  'Flagged': {
    bg: 'bg-[#EF4444]/[0.12]',
    text: 'text-[#EF4444]',
    border: 'border border-[#EF4444]/20',
  },
  'Poor': {
    bg: 'bg-[#EF4444]/[0.12]',
    text: 'text-[#EF4444]',
    border: 'border border-[#EF4444]/20',
  },
  'Expired': {
    bg: 'bg-[#EF4444]/[0.12]',
    text: 'text-[#EF4444]',
    border: 'border border-[#EF4444]/20',
  },
  // Members Only → gold muted
  'Members Only': {
    bg: 'bg-[#C4973A]/[0.12]',
    text: 'text-[#C4973A]',
    border: 'border border-[#C4973A]/20',
  },
  // Draft / Inactive → gray (light-theme safe neutral)
  'Draft': {
    bg: 'bg-[#6b7280]/[0.10]',
    text: 'text-[#6b7280]',
    border: 'border border-[#6b7280]/20',
  },
  'Inactive': {
    bg: 'bg-[#6b7280]/[0.10]',
    text: 'text-[#6b7280]',
    border: 'border border-[#6b7280]/20',
  },
  // OK → teal-green
  'OK': {
    bg: 'bg-[#22C55E]/[0.12]',
    text: 'text-[#22C55E]',
    border: 'border border-[#22C55E]/20',
  },
};

interface CuratorStatusBadgeProps {
  status: string;
  className?: string;
}

export function CuratorStatusBadge({ status, className = '' }: CuratorStatusBadgeProps) {
  const config = statusConfig[status as StatusType] || {
    bg: 'bg-[#6b7280]/[0.10]',
    text: 'text-[#6b7280]',
    border: 'border border-[#6b7280]/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-[6px] text-[10px] font-bold tracking-[0.08em] uppercase ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {status}
    </span>
  );
}
