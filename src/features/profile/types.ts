export type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: { country_code: string; number: string };
  location: { city: string; country: string };
  links: Array<{ name: string; url: string }>;
  languages: string[];
};

export const temp_profile = {
  first_name: "",
  last_name: "",
  email: "",
  phone: { country_code: "", number: "" },
  location: { city: "", country: "" },
  links: [],
  languages: [],
};
