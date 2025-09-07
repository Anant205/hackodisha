import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { getCurrentUser, updateUser } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { User, Skill, SkillCategory } from '@/types';

const skillCategories: { value: SkillCategory; label: string }[] = [
  { value: 'tech', label: 'Technology' },
  { value: 'creative', label: 'Creative' },
  { value: 'language', label: 'Languages' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'music', label: 'Music' },
  { value: 'business', label: 'Business' },
];

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '' as SkillCategory,
    level: '' as 'beginner' | 'intermediate' | 'advanced',
    description: '',
  });
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillType, setSkillType] = useState<'teaching' | 'learning'>('teaching');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setEditedUser(currentUser);
  }, [navigate]);

  const handleSaveProfile = () => {
    if (editedUser) {
      updateUser(editedUser);
      setUser(editedUser);
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    }
  };

  const handleAddSkill = () => {
    if (!editedUser || !newSkill.name || !newSkill.category || !newSkill.level) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name,
      category: newSkill.category,
      level: newSkill.level,
      description: newSkill.description,
    };

    const updatedUser = { ...editedUser };
    if (skillType === 'teaching') {
      updatedUser.teachingSkills = [...updatedUser.teachingSkills, skill];
    } else {
      updatedUser.learningSkills = [...updatedUser.learningSkills, skill];
    }

    setEditedUser(updatedUser);
    updateUser(updatedUser);
    setUser(updatedUser);
    setNewSkill({ name: '', category: '' as SkillCategory, level: '' as any, description: '' });
    setIsAddingSkill(false);
    
    toast({
      title: 'Skill added',
      description: `Added ${skill.name} to your ${skillType} skills.`,
    });
  };

  const handleRemoveSkill = (skillId: string, type: 'teaching' | 'learning') => {
    if (!editedUser) return;

    const updatedUser = { ...editedUser };
    if (type === 'teaching') {
      updatedUser.teachingSkills = updatedUser.teachingSkills.filter(s => s.id !== skillId);
    } else {
      updatedUser.learningSkills = updatedUser.learningSkills.filter(s => s.id !== skillId);
    }

    setEditedUser(updatedUser);
    updateUser(updatedUser);
    setUser(updatedUser);
    
    toast({
      title: 'Skill removed',
      description: 'Skill has been removed from your profile.',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 bg-gradient-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription className="text-lg">{user.email}</CardDescription>
                  </div>
                </div>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  {isEditing ? 'Save Changes' : <><Edit className="w-4 h-4 mr-2" />Edit Profile</>}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editedUser?.name || ''}
                      onChange={(e) => setEditedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={editedUser?.bio || ''}
                      onChange={(e) => setEditedUser(prev => prev ? { ...prev, bio: e.target.value } : null)}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{user.bio}</p>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="teaching" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="teaching" className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Teaching ({user.teachingSkills.length})</span>
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Learning ({user.learningSkills.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teaching" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Skills I Teach</h3>
                <Dialog open={isAddingSkill && skillType === 'teaching'} onOpenChange={(open) => {
                  setIsAddingSkill(open);
                  if (open) setSkillType('teaching');
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Teaching Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Teaching Skill</DialogTitle>
                      <DialogDescription>
                        Add a skill that you can teach to others.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="skillName">Skill Name</Label>
                        <Input
                          id="skillName"
                          placeholder="e.g., React Development"
                          value={newSkill.name}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newSkill.category} onValueChange={(value: SkillCategory) => setNewSkill(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="level">Level</Label>
                        <Select value={newSkill.level} onValueChange={(value: any) => setNewSkill(prev => ({ ...prev, level: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what you can teach..."
                          value={newSkill.description}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <Button onClick={handleAddSkill} className="w-full">
                        Add Skill
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.teachingSkills.map((skill) => (
                  <Card key={skill.id} className="bg-gradient-card border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(skill.id, 'teaching')}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className={`bg-skill-${skill.category}/20 text-skill-${skill.category}`}>
                          {skill.category}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {skill.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {user.teachingSkills.length === 0 && (
                <div className="text-center py-12">
                  <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No teaching skills yet</h3>
                  <p className="text-muted-foreground mb-4">Add skills that you can teach to others</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="learning" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Skills I Want to Learn</h3>
                <Dialog open={isAddingSkill && skillType === 'learning'} onOpenChange={(open) => {
                  setIsAddingSkill(open);
                  if (open) setSkillType('learning');
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Learning Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Learning Goal</DialogTitle>
                      <DialogDescription>
                        Add a skill that you want to learn from others.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="skillName">Skill Name</Label>
                        <Input
                          id="skillName"
                          placeholder="e.g., Guitar Playing"
                          value={newSkill.name}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newSkill.category} onValueChange={(value: SkillCategory) => setNewSkill(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="level">Current Level</Label>
                        <Select value={newSkill.level} onValueChange={(value: any) => setNewSkill(prev => ({ ...prev, level: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your current level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description">What do you want to learn?</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what you want to learn..."
                          value={newSkill.description}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <Button onClick={handleAddSkill} className="w-full">
                        Add Learning Goal
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.learningSkills.map((skill) => (
                  <Card key={skill.id} className="bg-gradient-card border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(skill.id, 'learning')}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className={`bg-skill-${skill.category}/20 text-skill-${skill.category}`}>
                          {skill.category}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {skill.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {user.learningSkills.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No learning goals yet</h3>
                  <p className="text-muted-foreground mb-4">Add skills that you want to learn</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;