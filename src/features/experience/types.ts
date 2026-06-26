export type Experience = {
  id?: number;
  role: string;
  company: string;
  location: { city: string; country: string };
  description: string;
  highlights: string[];
  duration: { start_date: string; end_date: string };
};
