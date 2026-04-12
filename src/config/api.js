export const endpointPath = (country, category) =>
  `/news?country=${country}&category=${category}`;

export const endpointSearch = (searchQuery) =>
  `/news?q=${encodeURIComponent(searchQuery)}`;
