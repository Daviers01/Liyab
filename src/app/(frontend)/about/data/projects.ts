import { Project } from '../types';

export const projects: Project[] = [
  {
    id: "psycheup",
    title: "PsychUp",
    image: "/psyche.png",
    url: "https://www.psycheup.com/",
    category: "client",
    tags: ["React", "Node.js", "AWS"],
    description: "Mental health platform connecting users with licensed therapists",
  },
  {
    id: "preceptor-nest",
    title: "Preceptor Nest",
    image: "/preceptor-nest-site.png",
    url: "https://www.preceptornest.com/",
    category: "client",
    tags: ["Vue", "Firebase", "Tailwind"],
    description: "Educational platform for nursing students and preceptors",
  },
  {
    id: "passnp",
    title: "PASS",
    image: "/passnp.png",
    url: "https://www.passnp.com/",
    category: "client",
    tags: ["React", "Node.js", "MySQL"],
    description: "Nurse practitioner exam preparation platform",
  },
  {
    id: "abc-company",
    title: "ABC Company",
    image: "/abc-index.png",
    url: "https://abc-company.azurewebsites.net/",
    category: "personal",
    tags: ["Next.js", "Azure", "TypeScript"],
    description: "Demo corporate website hosted on Azure",
  },
];
