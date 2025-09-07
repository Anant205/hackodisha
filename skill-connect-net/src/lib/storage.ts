import { User, Skill, SkillCategory } from '@/types';

const STORAGE_KEYS = {
  CURRENT_USER: 'skillswap_current_user',
  USERS: 'skillswap_users',
  SKILLS: 'skillswap_skills',
};

const mockSkills: Skill[] = [
  { id: '1', name: 'React Development', category: 'tech', level: 'intermediate', description: 'Build modern web apps with React' },
  { id: '2', name: 'Guitar Playing', category: 'music', level: 'beginner', description: 'Learn to play acoustic guitar' },
  { id: '3', name: 'Spanish Language', category: 'language', level: 'advanced', description: 'Conversational Spanish' },
  { id: '4', name: 'Yoga Instruction', category: 'fitness', level: 'intermediate', description: 'Hatha and Vinyasa yoga' },
  { id: '5', name: 'Graphic Design', category: 'creative', level: 'advanced', description: 'Adobe Creative Suite mastery' },
  { id: '6', name: 'Business Strategy', category: 'business', level: 'intermediate', description: 'Strategic planning and execution' },
];

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SKILLS)) {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(mockSkills));
  }
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userData ? JSON.parse(userData) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getAllSkills = (): Skill[] => {
  const skillsData = localStorage.getItem(STORAGE_KEYS.SKILLS);
  return skillsData ? JSON.parse(skillsData) : [];
};

export const searchSkills = (query: string, category?: SkillCategory): Skill[] => {
  const skills = getAllSkills();
  return skills.filter(skill => {
    const matchesQuery = skill.name.toLowerCase().includes(query.toLowerCase()) ||
                        skill.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || skill.category === category;
    return matchesQuery && matchesCategory;
  });
};

export const createUser = (userData: Omit<User, 'id'>): User => {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
  };
  
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  return newUser;
};

export const getUserByEmail = (email: string): User | null => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  return users.find((user: User) => user.email === email) || null;
};

export const updateUser = (user: User) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const userIndex = users.findIndex((u: User) => u.id === user.id);
  if (userIndex >= 0) {
    users[userIndex] = user;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  setCurrentUser(user);
};