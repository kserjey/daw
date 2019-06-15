import React, { useRef, useCallback } from 'react';
import styled from 'styled-components/macro';

const Divider = styled.line`
  stroke: #666666;
  stroke-width: 2px;
`;

function Grid({
  x,
  y,
  rows,
  columns,
  rowHeight,
  columnWidth,
  children,
  onCellClick,
  onActiveCellClick
}) {
  const width = columns * columnWidth;
  const height = rows * rowHeight;

  const gridRef = useRef();

  const handleCellClick = useCallback(
    event => {
      const point = gridRef.current.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;

      const cursorPoint = point.matrixTransform(
        gridRef.current.getScreenCTM().inverse()
      );

      onCellClick(
        Math.floor(cursorPoint.y / rowHeight),
        Math.floor(cursorPoint.x / columnWidth)
      );
    },
    [rowHeight, columnWidth, onCellClick]
  );

  return (
    <svg
      ref={gridRef}
      style={{ borderRadius: '0 4px 4px 0' }}
      {...{ width, height, x, y }}
    >
      <rect
        width="100%"
        height="100%"
        fill="#858585"
        onClick={handleCellClick}
      />
      {Array.from({ length: rows + 1 }).map((_, rowIndex) => (
        <Divider
          key={rowIndex}
          x1={0}
          y1={rowIndex * rowHeight}
          x2="100%"
          y2={rowIndex * rowHeight}
        />
      ))}
      {Array.from({ length: columns + 1 }).map((_, columnIndex) => (
        <Divider
          key={columnIndex}
          x1={columnIndex * columnWidth}
          y1={0}
          x2={columnIndex * columnWidth}
          y2="100%"
        />
      ))}
      {children}
    </svg>
  );
}

export { Grid, Divider };
