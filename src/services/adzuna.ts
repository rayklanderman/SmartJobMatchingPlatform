import axios from 'axios';
import { logError } from '../utils/logger';

export type SupportedCountry = 'za';
export type CountryCode = 'ke' | 'za' | 'ng' | 'gh';

const SUPPORTED_COUNTRIES: SupportedCountry[] = ['za']; // Currently only South Africa is supported by Adzuna in Africa

export interface AdzunaJob {
  id: string;
  title: string;
  description: string;
  created: string;
  location: {
    display_name: string;
    area: string[];
  };
  redirect_url: string;
  company: {
    display_name: string;
  };
  salary_min?: number;
  salary_max?: number;
  category: {
    label: string;
    tag: string;
  };
}

interface AdzunaCategory {
  tag: string;
  label: string;
}

interface AdzunaResponse {
  count: number;
  results: AdzunaJob[];
}

interface CategoriesResponse {
  results: AdzunaCategory[];
}

const appId = import.meta.env.VITE_ADZUNA_APP_ID;
const apiKey = import.meta.env.VITE_ADZUNA_API_KEY;

// Create an axios instance with retry logic
const api = axios.create({
  baseURL: '/api/adzuna/v1',
  timeout: 10000
});

// Add retry logic for rate limits
api.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 429) {
    // Wait for 2 seconds before retrying
    await new Promise(resolve => setTimeout(resolve, 2000));
    return api.request(error.config);
  }
  return Promise.reject(error);
});

export const getCategories = async (country: CountryCode): Promise<CategoriesResponse> => {
  // If country is not supported, return empty categories
  if (!SUPPORTED_COUNTRIES.includes(country as SupportedCountry)) {
    return {
      results: []
    };
  }

  try {
    const response = await api.get<CategoriesResponse>(
      `/api/jobs/${country}/categories`,
      {
        params: {
          app_id: appId,
          app_key: apiKey
        }
      }
    );
    return response.data;
  } catch (error) {
    logError(error as Error);
    return {
      results: []
    };
  }
};

interface SearchParams {
  what?: string;
  where?: string;
  country: CountryCode;
  category?: string;
  maxDaysOld?: number;
  sortBy?: string;
  page?: number;
  resultsPerPage?: number;
}

export const searchJobs = async (params: SearchParams): Promise<{ jobs: AdzunaJob[]; totalJobs: number }> => {
  // If country is not supported, return empty results
  if (!SUPPORTED_COUNTRIES.includes(params.country as SupportedCountry)) {
    return {
      jobs: [],
      totalJobs: 0
    };
  }

  try {
    const response = await api.get<AdzunaResponse>(
      `/api/jobs/${params.country}/search/${params.page || 1}`,
      {
        params: {
          app_id: appId,
          app_key: apiKey,
          results_per_page: params.resultsPerPage || 10,
          what: params.what || '',
          where: params.where || '',
          category: params.category || '',
          max_days_old: params.maxDaysOld || 30,
          sort_by: params.sortBy || 'date'
        }
      }
    );

    return {
      jobs: response.data.results,
      totalJobs: response.data.count
    };
  } catch (error) {
    logError(error as Error);
    return {
      jobs: [],
      totalJobs: 0
    };
  }
};
