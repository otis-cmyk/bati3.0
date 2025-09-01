import React from 'react';

interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isSelected?: boolean;
  onClick?: () => void;
}

export function ConnectionLine({ from, to, isSelected, onClick }: ConnectionLineProps) {
  // Calculate the control points for a smooth curved line
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  
  // Make the curve more pronounced for longer distances
  const controlPointOffset = Math.max(Math.abs(dx) * 0.5, 100);
  
  const controlPoint1 = { 
    x: from.x + controlPointOffset, 
    y: from.y 
  };
  const controlPoint2 = { 
    x: to.x - controlPointOffset, 
    y: to.y 
  };

  const pathData = `M ${from.x} ${from.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${to.x} ${to.y}`;

  return (
    <g className="connection-line">
      {/* Invisible thick line for easier clicking */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="12"
        fill="none"
        className="cursor-pointer"
        onClick={onClick}
      />
      
      {/* Shadow/background line */}
      <path
        d={pathData}
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth="4"
        fill="none"
        className="pointer-events-none"
      />
      
      {/* Main connection line */}
      <path
        d={pathData}
        stroke={isSelected ? "var(--md-sys-color-primary)" : "var(--md-sys-color-outline)"}
        strokeWidth="2"
        fill="none"
        className="pointer-events-none transition-colors duration-200"
        markerEnd={isSelected ? "url(#arrowhead)" : "url(#arrowhead-inactive)"}
      />
      
      {/* Hover effect line */}
      <path
        d={pathData}
        stroke="var(--md-sys-color-primary)"
        strokeWidth="3"
        fill="none"
        className="opacity-0 hover:opacity-30 transition-opacity duration-200 cursor-pointer"
        onClick={onClick}
      />

      {/* Connection points indicators */}
      <circle
        cx={from.x}
        cy={from.y}
        r="4"
        fill={isSelected ? "var(--md-sys-color-primary)" : "var(--md-sys-color-outline)"}
        className="transition-colors duration-200"
      />
      <circle
        cx={to.x}
        cy={to.y}
        r="4"
        fill={isSelected ? "var(--md-sys-color-primary)" : "var(--md-sys-color-outline)"}
        className="transition-colors duration-200"
      />

      {/* Delete button when selected */}
      {isSelected && (
        <g>
          {/* Background circle for delete button */}
          <circle
            cx={(from.x + to.x) / 2}
            cy={(from.y + to.y) / 2}
            r="12"
            fill="var(--md-sys-color-error-container)"
            stroke="var(--md-sys-color-error)"
            strokeWidth="1"
            className="cursor-pointer"
            onClick={onClick}
          />
          {/* X icon */}
          <g
            transform={`translate(${(from.x + to.x) / 2 - 6}, ${(from.y + to.y) / 2 - 6})`}
            className="cursor-pointer"
            onClick={onClick}
          >
            <path
              d="M3 3l6 6m0-6L3 9"
              stroke="var(--md-sys-color-error)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      )}
    </g>
  );
}