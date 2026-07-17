const PUBLIC_DATA_URL = "/data/portfolio.json";

let cachedPortfolio = null;
let portfolioPromise = null;

const emptyPortfolio = {
  generatedAt: null,
  settings: null,
  profile: null,
  artworks: [],
  categories: [],
};

const loadPortfolio = async () => {
  if (cachedPortfolio) return cachedPortfolio;

  if (!portfolioPromise) {
    portfolioPromise = fetch(PUBLIC_DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Static portfolio data failed to load: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        cachedPortfolio = {
          ...emptyPortfolio,
          ...data,
          artworks: Array.isArray(data.artworks) ? data.artworks : [],
          categories: Array.isArray(data.categories) ? data.categories : [],
        };
        return cachedPortfolio;
      })
      .catch((error) => {
        console.error(error);
        cachedPortfolio = emptyPortfolio;
        return cachedPortfolio;
      })
      .finally(() => {
        portfolioPromise = null;
      });
  }

  return portfolioPromise;
};

const matchesSearch = (artwork, search) => {
  if (!search) return true;
  const term = search.trim().toLowerCase();
  return [artwork.title, artwork.description, artwork.category, artwork.medium]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(term));
};

const filterArtworks = (artworks, params = {}) =>
  artworks.filter((artwork) => {
    if (!matchesSearch(artwork, params.search)) return false;
    if (params.category && params.category !== "all" && artwork.category?.toLowerCase() !== params.category.toLowerCase()) {
      return false;
    }
    if (params.available === "true" && !artwork.isAvailable) return false;
    if (params.available === "false" && artwork.isAvailable) return false;
    if (params.featured === "true" && !artwork.isFeatured) return false;
    return true;
  });

const paginate = (items, page = 1, limit = 12) => {
  const currentPage = Number.parseInt(page, 10) || 1;
  const pageSize = Number.parseInt(limit, 10) || 12;
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      total: items.length,
      page: currentPage,
      limit: pageSize,
      pages: Math.ceil(items.length / pageSize),
    },
  };
};

export const publicDataAPI = {
  getPortfolio: loadPortfolio,

  getSettings: async () => {
    const portfolio = await loadPortfolio();
    return portfolio.settings;
  },

  getProfile: async () => {
    const portfolio = await loadPortfolio();
    return portfolio.profile;
  },

  getArtworks: async (params = {}) => {
    const portfolio = await loadPortfolio();
    const filtered = filterArtworks(portfolio.artworks, params);
    return paginate(filtered, params.page, params.limit);
  },

  getArtworkById: async (id) => {
    const portfolio = await loadPortfolio();
    return portfolio.artworks.find((artwork) => artwork._id === id) || null;
  },

  getCategories: async () => {
    const portfolio = await loadPortfolio();
    return portfolio.categories;
  },
};
