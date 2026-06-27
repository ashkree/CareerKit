export type Skill = {
  name: string;
};

export type Education = {
  id?: number;
  school: string;
  qualification: string;
  specializations: string[];
  duration: { start_date: string; end_date: string };
  location: { city: string; country: string };
  coursework: string[];
  skills: Skill[];
};
