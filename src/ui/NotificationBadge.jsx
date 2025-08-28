// components/NotificationBadge.js
import styled from 'styled-components';

const BadgeWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Badge = styled.span`
  position: absolute;
  top: ${(props) => props.$top || '-30px'};
  right: ${(props) => props.$right || '-8px'};
  transform: translate(50%, -50%);
  width: ${(props) => props.$size || '15px'};
  height: ${(props) => props.$size || '15px'};
  background-color: ${(props) => props.color || 'crimson'};
  color: ${(props) => props.textColor || 'white'};
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--color-grey-0);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${(props) =>
    props.pulse ? 'pulse 1s ease-in-out infinite' : 'none'};

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export function NotificationBadge({ count, children, ...props }) {
  return (
    <BadgeWrapper>
      {children}
      {count > 0 && <Badge {...props}>{count > 99 ? '99+' : count}</Badge>}
    </BadgeWrapper>
  );
}
