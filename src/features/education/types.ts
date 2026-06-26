export type Education = {
  degree: string;
  field: string;
  school: string;
  location: { city: string; country: string };
  relevant_coursework: Array<string>;
  description: Array<string>;
  duration: { start: string; end: string; current: boolean };
  skills: Array<string>;
  achievements: Array<string>;
};
