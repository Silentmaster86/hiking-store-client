import styled from "styled-components";
import { Link } from "react-router-dom";
import { categories } from "../../constants/categories";
const Grid = styled.div`
  margin-top: 20px; display: grid; gap: 14px; grid-template-columns: repeat(4, minmax(0, 1fr));
  @media(max-width: 980px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media(max-width: 560px) { grid-template-columns: 1fr; }
`;
const Tile = styled(Link)`
  display: block; text-decoration: none; border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface2}; border-radius: 16px; overflow: hidden;
  color: ${({ theme }) => theme.colors.text}; box-shadow: ${({ theme }) => theme.shadows.soft};
  img { display: block; width: 100%; height: 180px; object-fit: cover; }
  span.label { display: block; padding: 16px; font-weight: 800; }
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;
export default function CategoryTiles() {
  return <Grid>{categories.map((category, index) => <Tile key={category.slug} to={`/products?category=${category.slug}`}>
    <img src={category.cover} alt="" width="512" height="512" loading={index === 0 ? "eager" : "lazy"} decoding="async" />
    <span className="label"><span aria-hidden="true">{category.emoji} </span>{category.label}</span>
  </Tile>)}</Grid>;
}
