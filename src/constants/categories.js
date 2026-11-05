export const categories = [
  { slug: "boots", label: "Footwear & Care", emoji: "🥾", cover: "/img/products/boots-01.jpg", description: "Hiking footwear, comfortable socks and footwear care for days on the trail." },
  { slug: "jackets", label: "Jackets & Layers", emoji: "🧥", cover: "/img/products/jackets-01.jpg", description: "Jackets, fleeces and lightweight layers for changeable outdoor weather." },
  { slug: "backpacks", label: "Backpacks & Accessories", emoji: "🎒", cover: "/img/products/backpacks-01.jpg", description: "Daypacks, trail backpacks and storage accessories for your outdoor essentials." },
  { slug: "accessories", label: "Accessories", emoji: "🧭", cover: "/img/products/accessories-03-first-aid.jpg", description: "Trekking poles, bottles, head torches and first aid essentials." },
];
export const categoryBySlug = (slug) => categories.find((item) => item.slug === slug);
