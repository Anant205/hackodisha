import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Palette, Globe, Dumbbell, Music, Briefcase, ArrowRight, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { getAllSkills, searchSkills, getCurrentUser } from '@/lib/storage';
import { Skill, SkillCategory } from '@/types';
import heroImage from '@/assets/hero-image.jpg';

const skillCategories = [
  { id: 'tech', name: 'Technology', icon: Code, color: 'skill-tech', description: 'Programming, web dev, AI' },
  { id: 'creative', name: 'Creative', icon: Palette, color: 'skill-creative', description: 'Design, art, writing' },
  { id: 'language', name: 'Languages', icon: Globe, color: 'skill-language', description: 'Speaking, translation' },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'skill-fitness', description: 'Yoga, sports, training' },
  { id: 'music', name: 'Music', icon: Music, color: 'skill-music', description: 'Instruments, singing' },
  { id: 'business', name: 'Business', icon: Briefcase, color: 'skill-business', description: 'Strategy, marketing' }
];

export const Home = () => {
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const [searchResults, setSearchResults] = useState<Skill[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const skills = getAllSkills();
    setFeaturedSkills(skills.slice(0, 6));
  }, []);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    const results = searchSkills(query);
    setSearchResults(results);
  };

  const handleCategoryClick = (category: SkillCategory) => {
    const results = searchSkills('', category);
    setSearchResults(results);
    setIsSearching(true);
  };

  const resetSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      {!isSearching ? (
        <>
          <section className="relative py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-hero opacity-90" />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0">
              <img 
                src={heroImage} 
                alt="People sharing skills" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 container mx-auto text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Share Skills,
                <br />
                <span className="text-primary-glow">Learn Together</span>
              </h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Connect with people in your community to exchange knowledge. 
                Teach what you know, learn what you love.
              </p>
              <div className="flex gap-4 justify-center">
                {currentUser ? (
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => navigate('/profile')}>
                    Manage Skills
                  </Button>
                ) : (
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" onClick={() => navigate('/signup')}>
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </section>

          <section className="py-12 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">10K+</h3>
                  <p className="text-muted-foreground">Active learners</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">500+</h3>
                  <p className="text-muted-foreground">Skills available</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">95%</h3>
                  <p className="text-muted-foreground">Success rate</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                Explore Skill <span className="text-primary">Categories</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card 
                      key={category.id}
                      className="group cursor-pointer hover:shadow-glow transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border"
                      onClick={() => handleCategoryClick(category.id as SkillCategory)}
                    >
                      <CardHeader className="text-center">
                        <div className={`w-16 h-16 mx-auto rounded-full bg-${category.color}/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-8 h-8 text-${category.color}`} />
                        </div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-center">{category.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-muted/10">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12">
                Featured <span className="text-primary">Skills</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSkills.map((skill) => (
                  <Card key={skill.id} className="hover:shadow-card transition-shadow bg-gradient-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {skill.name}
                        <span className={`px-2 py-1 rounded-full text-xs bg-skill-${skill.category}/20 text-skill-${skill.category} capitalize`}>
                          {skill.level}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{skill.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                Search Results <span className="text-primary">({searchResults.length})</span>
              </h2>
              <Button variant="outline" onClick={resetSearch}>
                Back to Home
              </Button>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((skill) => (
                  <Card key={skill.id} className="hover:shadow-card transition-shadow bg-gradient-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {skill.name}
                        <span className={`px-2 py-1 rounded-full text-xs bg-skill-${skill.category}/20 text-skill-${skill.category} capitalize`}>
                          {skill.level}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">{skill.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs bg-skill-${skill.category}/10 text-skill-${skill.category} capitalize`}>
                          {skill.category}
                        </span>
                        <Button size="sm" variant="outline">
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-4">No skills found</h3>
                <p className="text-muted-foreground mb-8">Try adjusting your search terms or browse categories</p>
                <Button onClick={resetSearch}>Explore All Skills</Button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;