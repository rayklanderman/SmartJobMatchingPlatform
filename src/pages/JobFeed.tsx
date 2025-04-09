import { useState, useEffect } from 'react';
import { searchJobs, type AdzunaJob, getCategories, type CountryCode, type SupportedCountry } from '../services/adzuna';
import { analyzeJobMatch } from '../services/xai';
import { logError } from '../utils/logger';

interface Category {
  tag: string;
  label: string;
}

interface JobWithMatch extends AdzunaJob {
  matchScore?: number;
  recommendations?: string[];
  skillGaps?: string[];
  localMarketInsights?: {
    demandLevel: 'high' | 'medium' | 'low';
    growthPotential: string;
    localCompetition: string;
    salaryRange: string;
  };
  upskillingSuggestions?: {
    courses: string[];
    certifications: string[];
    resources: string[];
  };
}

export default function JobFeed() {
  const [jobs, setJobs] = useState<JobWithMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('za');

  // Mock user profile - in a real app, this would come from your user context/state
  const userProfile = {
    skills: ['React', 'TypeScript', 'JavaScript'],
    experience: '3 years of frontend development',
    education: {
      level: 'Bachelor',
      field: 'Computer Science',
      institution: 'University of Nairobi',
    },
    preferences: {
      role: 'Frontend Developer',
      location: 'Nairobi',
      salary: 'KES 100,000 - 200,000',
      industry: ['Technology', 'E-commerce'],
      workType: 'hybrid' as const,
    },
    languages: ['English', 'Swahili'],
  };

  const SUPPORTED_COUNTRIES: SupportedCountry[] = ['za'];
  const COUNTRY_NAMES: Record<CountryCode, string> = {
    ke: 'Kenya',
    za: 'South Africa',
    ng: 'Nigeria',
    gh: 'Ghana'
  };

  useEffect(() => {
    loadCategories();
  }, [selectedCountry]);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, location, selectedCategory, selectedCountry]);

  const loadCategories = async () => {
    try {
      setError(null);
      const data = await getCategories(selectedCountry);
      setCategories(data.results);
    } catch (error) {
      logError(error as Error);
      setError('Failed to load job categories. Please try again later.');
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const { jobs: fetchedJobs, totalJobs: total } = await searchJobs({
        what: searchTerm,
        where: location,
        country: selectedCountry,
        category: selectedCategory,
        maxDaysOld: 30,
        sortBy: 'date',
        page: currentPage,
      });

      // Analyze each job for the user
      const jobsWithMatch = await Promise.all(
        fetchedJobs.map(async (job) => {
          try {
            const match = await analyzeJobMatch({
              jobDescription: job.description,
              userProfile,
            });
            return { ...job, ...match };
          } catch (error) {
            console.error('Error analyzing job match:', error);
            return job;
          }
        })
      );

      setJobs(jobsWithMatch);
      setTotalJobs(total);
    } catch (error) {
      logError(error as Error);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name} {!SUPPORTED_COUNTRIES.includes(code as SupportedCountry) ? '(Coming Soon)' : ''}
                </option>
              ))}
            </select>
            
            {SUPPORTED_COUNTRIES.includes(selectedCountry as SupportedCountry) && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.tag} value={category.tag}>
                    {category.label}
                  </option>
                ))}
              </select>
            )}
            
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!SUPPORTED_COUNTRIES.includes(selectedCountry as SupportedCountry)}
            >
              Search Jobs
            </button>
          </div>
        </form>
      </div>

      {!SUPPORTED_COUNTRIES.includes(selectedCountry as SupportedCountry) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            Job listings for {COUNTRY_NAMES[selectedCountry]} are coming soon! Currently, only South Africa is supported.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                  <p className="text-gray-600">{job.company.display_name}</p>
                  <p className="text-gray-500 text-sm mt-1">{job.location.display_name}</p>
                </div>
                {job.matchScore !== undefined && (
                  <div className="ml-4 flex-shrink-0">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      job.matchScore >= 70 ? 'bg-green-100 text-green-800' :
                      job.matchScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {job.matchScore}% Match
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-gray-600">{job.description}</p>
                
                {job.salary_min && job.salary_max && (
                  <p className="text-green-600 font-medium mt-2">
                    {selectedCountry === 'ke' ? 'KES' : 
                     selectedCountry === 'za' ? 'ZAR' :
                     selectedCountry === 'ng' ? 'NGN' : 'GHS'} 
                    {Math.round(job.salary_min).toLocaleString()} - 
                    {Math.round(job.salary_max).toLocaleString()}
                  </p>
                )}

                {job.localMarketInsights && (
                  <div className="mt-4 bg-gray-50 rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-900">Local Market Insights</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <p>Demand Level: <span className="font-medium">{job.localMarketInsights.demandLevel}</span></p>
                      <p>Growth Potential: {job.localMarketInsights.growthPotential}</p>
                      <p>Competition: {job.localMarketInsights.localCompetition}</p>
                    </div>
                  </div>
                )}

                {job.skillGaps && job.skillGaps.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Skills to Develop:</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.skillGaps.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.upskillingSuggestions && (
                  <div className="mt-4">
                    <button 
                      className="text-indigo-600 text-sm hover:text-indigo-800"
                      onClick={() => {/* TODO: Show upskilling modal */}}
                    >
                      View Learning Resources →
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end space-x-4">
                <button className="text-indigo-600 hover:text-indigo-800">
                  Save for Later
                </button>
                <a
                  href={job.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs found. Try adjusting your search criteria.</p>
        </div>
      )}

      {totalJobs > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing {jobs.length} of {totalJobs} jobs
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={jobs.length < 10}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
