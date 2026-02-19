// Skill and Technology types
export interface Skill {
  name: string;
  image: string;
}

// Experience types
export interface Experience {
  name: string;
  image: string;
  role: string[];
  date: string;
  subsidiary?: string;
}

// Certification/Education types
export interface Certification {
  name: string;
  image: string;
  role: string[];
  date?: string;
  subsidiary?: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description?: string;
  image: string;
  url: string;
  tags?: string[];
  category?: 'client' | 'personal';
  outcome?: string;
}
