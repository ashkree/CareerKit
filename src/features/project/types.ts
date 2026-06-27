export type Skill = {
  name: string;
};

export type Project = {
  id?: number;
  name: string;
  description: string;
  status: string;
  highlights: string[];
  duration: { start_date: string; end_date: string };
  links: Array<{ name: string; url: string }>;
  skills: Skill[];
};
