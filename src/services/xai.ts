import axios from 'axios';

const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;

interface UserProfile {
  skills: string[];
  experience: string;
  education?: {
    level: string;
    field?: string;
    institution?: string;
  };
  preferences: {
    role?: string;
    location?: string;
    salary?: string;
    industry?: string[];
    workType?: 'remote' | 'hybrid' | 'onsite';
  };
  languages?: string[];
}

interface JobMatchRequest {
  jobDescription: string;
  userProfile: UserProfile;
}

interface JobMatchResponse {
  matchScore: number;
  recommendations: string[];
  skillGaps: string[];
  localMarketInsights: {
    demandLevel: 'high' | 'medium' | 'low';
    growthPotential: string;
    localCompetition: string;
    salaryRange: string;
  };
  upskillingSuggestions: {
    courses: string[];
    certifications: string[];
    resources: string[];
  };
}

export const analyzeJobMatch = async (
  request: JobMatchRequest
): Promise<JobMatchResponse> => {
  try {
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        messages: [
          {
            role: 'system',
            content: `You are an AI career advisor specialized in the African job market, particularly for youth employment. 
            Consider local market conditions, cultural context, and development opportunities in Kenya and broader Africa.
            Provide practical, actionable advice that takes into account:
            - Local industry trends and growth sectors
            - Skills that are in high demand locally
            - Opportunities for remote work with international companies
            - Local startup ecosystem and entrepreneurship opportunities
            - Relevant training and upskilling programs available in the region`
          },
          {
            role: 'user',
            content: `Analyze this job opportunity for a candidate in the African job market:
            
            Job Description:
            ${request.jobDescription}
            
            Candidate Profile:
            - Skills: ${request.userProfile.skills.join(', ')}
            - Experience: ${request.userProfile.experience}
            - Education: ${request.userProfile.education?.level || 'Not specified'} in ${request.userProfile.education?.field || 'Not specified'}
            ${request.userProfile.education?.institution ? `from ${request.userProfile.education.institution}` : ''}
            - Languages: ${request.userProfile.languages?.join(', ') || 'Not specified'}
            
            Preferences:
            - Role: ${request.userProfile.preferences.role || 'Any'}
            - Location: ${request.userProfile.preferences.location || 'Any'}
            - Salary: ${request.userProfile.preferences.salary || 'Not specified'}
            - Industry Interests: ${request.userProfile.preferences.industry?.join(', ') || 'Any'}
            - Work Type: ${request.userProfile.preferences.workType || 'Any'}
            
            Please provide:
            1. A match score (0-100)
            2. Specific recommendations for the candidate
            3. Skill gaps that should be addressed
            4. Local market insights (demand, growth potential, competition)
            5. Upskilling suggestions (courses, certifications, resources)`
          }
        ],
        model: 'grok-2-latest',
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    // Parse the AI response into structured data
    return {
      matchScore: extractMatchScore(aiResponse),
      recommendations: extractRecommendations(aiResponse),
      skillGaps: extractSkillGaps(aiResponse),
      localMarketInsights: extractLocalMarketInsights(aiResponse),
      upskillingSuggestions: extractUpskillingSuggestions(aiResponse),
    };
  } catch (error) {
    console.error('Error analyzing job match:', error);
    throw error;
  }
};

function extractMatchScore(text: string): number {
  const match = text.match(/match score:?\s*(\d+)/i);
  return match ? Math.min(100, Math.max(0, parseInt(match[1], 10))) : 0;
}

function extractRecommendations(text: string): string[] {
  const recommendationsSection = text.match(/recommendations?:?(.*?)(?=skill gaps|\n\n|$)/si);
  if (!recommendationsSection) return [];
  
  return extractBulletPoints(recommendationsSection[1]);
}

function extractSkillGaps(text: string): string[] {
  const skillGapsSection = text.match(/skill gaps:?(.*?)(?=local market insights|\n\n|$)/si);
  if (!skillGapsSection) return [];
  
  return extractBulletPoints(skillGapsSection[1]);
}

function extractLocalMarketInsights(text: string): JobMatchResponse['localMarketInsights'] {
  const section = text.match(/local market insights:?(.*?)(?=upskilling|\n\n|$)/si);
  if (!section) return defaultLocalMarketInsights();

  const content = section[1].toLowerCase();
  return {
    demandLevel: content.includes('high demand') ? 'high' : 
                 content.includes('medium demand') ? 'medium' : 'low',
    growthPotential: extractSentence(content, 'growth potential') || 'Moderate growth expected',
    localCompetition: extractSentence(content, 'competition') || 'Competitive market',
    salaryRange: extractSentence(content, 'salary') || 'Varies by experience and location',
  };
}

function extractUpskillingSuggestions(text: string): JobMatchResponse['upskillingSuggestions'] {
  const section = text.match(/upskilling suggestions:?(.*?)(?=\n\n|$)/si);
  if (!section) return defaultUpskillingSuggestions();

  const content = section[1];
  return {
    courses: extractBulletPoints(content.match(/courses:?(.*?)(?=certifications|\n\n|$)/si)?.[1] || ''),
    certifications: extractBulletPoints(content.match(/certifications:?(.*?)(?=resources|\n\n|$)/si)?.[1] || ''),
    resources: extractBulletPoints(content.match(/resources:?(.*?)(?=\n\n|$)/si)?.[1] || ''),
  };
}

function extractBulletPoints(text: string): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-') || line.startsWith('•'))
    .map(line => line.replace(/^[-•]\s*/, ''));
}

function extractSentence(text: string, keyword: string): string {
  const sentences = text.split(/[.!?]+/);
  return sentences.find(s => s.toLowerCase().includes(keyword))?.trim() || '';
}

function defaultLocalMarketInsights(): JobMatchResponse['localMarketInsights'] {
  return {
    demandLevel: 'medium',
    growthPotential: 'Moderate growth expected',
    localCompetition: 'Competitive market',
    salaryRange: 'Varies by experience and location',
  };
}

function defaultUpskillingSuggestions(): JobMatchResponse['upskillingSuggestions'] {
  return {
    courses: [],
    certifications: [],
    resources: [],
  };
}
