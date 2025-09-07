export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  teachingSkills: Skill[];
  learningSkills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
}

export type SkillCategory = 'tech' | 'creative' | 'language' | 'fitness' | 'music' | 'business';

export interface SkillMatch {
  id: string;
  teacherId: string;
  learnerId: string;
  skill: Skill;
  status: 'pending' | 'accepted' | 'completed';
}