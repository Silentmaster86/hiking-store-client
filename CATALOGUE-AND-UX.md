# Catalogue and presentation

The source uses one category definition for home tiles, shop navigation, footer
and metadata. Slugs are unchanged. The demo catalogue's wording is corrected by
the companion API migration, with product IDs/prices retained and historical
order names preserved. Catalogue images and product information remain illustrative.

Cards and dialogs now use opaque surfaces and shared action colours. This removes
photographic interference with order details. Pure colour-pair tests check normal
text contrast for card text, muted text, errors and primary actions; they are not
full WCAG certification.

The page uses the existing 72 KB landscape asset instead of randomly requesting a
2.7–3.3 MB background. Home category tiles use the existing small product photos
instead of the 1.7–2.3 MB category covers. No image contents are regenerated or
edited. Original assets remain available to existing URLs. The home page does not
fetch products just to render its static category links.

Native dialog elements provide modal focus containment, Escape, inert background
and focus restoration for cart/menu. Browser checks verify these plus narrow
viewports, catalogue retry, titles, contact/deletion links and opaque product cards.

Contact defaults to the address in the original data-deletion instructions, with
a VITE_CONTACT_EMAIL override. No emails are sent by the application. Deletion is
a manual request to the project owner; clearing cookies does not delete database
records. Privacy text describes actual stored data and does not claim automatic
account/order deletion. The newsletter placeholder is replaced by project information.

The footer and legal links are present on authentication pages too. Metadata is
updated for every route. Product images are semantic images with names and lazy
loading; category images are decorative alongside their text labels.

Backend changes are an independent data migration and repeatable seed. Deploying
the frontend first is compatible; corrected catalogue names appear after the API
migration is deployed. Review catalogue wording before merging because it changes
the fictional demo products represented by the existing images.
