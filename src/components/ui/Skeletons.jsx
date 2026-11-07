import {
  ProductCardSkeleton,
  ProductCardSkeletonImg,
  ProductCardSkeletonBody,
  SkeletonLine,
  SkeletonBlock,
} from "./Skeletons.styles";

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
