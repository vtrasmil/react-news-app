const API_DOMAIN = "/api/news";

export const endpointPath = (country, category) =>
  `${API_DOMAIN}?country=${country}&category=${category}`;

export const endpointSearch = (searchQuery) =>
  `${API_DOMAIN}?q=${encodeURIComponent(searchQuery)}`;
