export type Experience = {
  id: number;
  role: string;
  company: string;
  company_website: string;
  employment_type: string;
  location: {
    city: string;
    country: string;
    remote: boolean;
  };
  highlights: string[];
  description: string;
  duration: {
    start: string;
    end: string;
    current: boolean;
  };
  skills: string[];
};
