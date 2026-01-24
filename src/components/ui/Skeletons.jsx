import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0%   { transform: translateX(-60%); }
  100% { transform: translateX(60%); }
`;

const Base = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${({ $radius }) => $radius || "12px"};
  background: rgba(255,255,255,0.06);
  border: 1px solid ${({ theme }) => theme.colors.border};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.08) 40%,
      rgba(255,255,255,0) 80%
    );
    animation: ${shimmer} 1.1s ease-in-out infinite;
  }
`;

export const SkeletonBlock = styled(Base)`
  width: ${({ $w }) => $w || "100%"};
  height: ${({ $h }) => $h || "12px"};
`;

export const SkeletonLine = styled(Base)`
  width: ${({ $w }) => $w || "100%"};
  height: ${({ $h }) => $h || "12px"};
`;

export const SkeletonCircle = styled(Base)`
  width: ${({ $size }) => $size || "36px"};
  height: ${({ $size }) => $size || "36px"};
  border-radius: 999px;
`;

export const ProductCardSkeleton = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.soft};
`;

export const ProductCardSkeletonImg = styled(SkeletonBlock).attrs(() => ({
  $h: "170px",
  $radius: "0px",
}))`
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ProductCardSkeletonBody = styled.div`
  padding: 14px;
  display: grid;
  gap: 10px;
`;

export function ProductCardSkeletonContent() {
  return (
    <ProductCardSkeleton>
      <ProductCardSkeletonImg />
      <ProductCardSkeletonBody>
        <SkeletonLine $h="14px" $w="70%" />
        <SkeletonLine $h="12px" $w="95%" />
        <SkeletonLine $h="12px" $w="86%" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 2 }}>
          <SkeletonLine $h="14px" $w="28%" />
          <SkeletonBlock $h="38px" $w="110px" $radius="12px" />
        </div>
      </ProductCardSkeletonBody>
    </ProductCardSkeleton>
  );
}
