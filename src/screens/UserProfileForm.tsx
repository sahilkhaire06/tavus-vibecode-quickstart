import React, { useState } from "react";
import { useAtom } from "jotai";
import { AnimatedWrapper, AnimatedTextBlockWrapper } from "@/components/DialogWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userProfileAtom } from "@/store/interview";
import { screenAtom } from "@/store/screens";
import { UserProfile } from "@/types/interview";
import { Plus, X, User, Briefcase, GraduationCap, Code, Award } from "lucide-react";

export const UserProfileForm: React.FC = () => {
  const [, setUserProfile] = useAtom(userProfileAtom);
  const [, setScreenState] = useAtom(screenAtom);
  
  const [formData, setFormData] = useState<UserProfile>({
    fullName: "",
    profession: "",
    skills: [],
    education: {
      degree: "",
      college: "",
      year: ""
    },
    projects: [],
    certificates: []
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentProject, setCurrentProject] = useState({
    name: "",
    techUsed: [],
    description: ""
  });
  const [currentTech, setCurrentTech] = useState("");
  const [currentCertificate, setCurrentCertificate] = useState({
    courseName: "",
    platform: ""
  });

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addTechToProject = () => {
    if (currentTech.trim() && !currentProject.techUsed.includes(currentTech.trim())) {
      setCurrentProject(prev => ({
        ...prev,
        techUsed: [...prev.techUsed, currentTech.trim()]
      }));
      setCurrentTech("");
    }
  };

  const addProject = () => {
    if (currentProject.name.trim() && currentProject.description.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, currentProject]
      }));
      setCurrentProject({ name: "", techUsed: [], description: "" });
    }
  };

  const addCertificate = () => {
    if (currentCertificate.courseName.trim() && currentCertificate.platform.trim()) {
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, currentCertificate]
      }));
      setCurrentCertificate({ courseName: "", platform: "" });
    }
  };

  const handleSubmit = () => {
    if (formData.fullName.trim() && formData.profession.trim()) {
      setUserProfile(formData);
      setScreenState({ currentScreen: "instructions" });
    }
  };

  const isFormValid = formData.fullName.trim() && formData.profession.trim();

  return (
    <AnimatedWrapper>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
      <AnimatedTextBlockWrapper>
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">AI Interview Setup</h1>
            <p className="text-gray-300">Tell us about yourself to personalize your interview experience</p>
          </div>

          <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4">
            {/* Basic Information */}
            <div className="bg-black/20 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <User className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-black/30 border-white/20 text-white"
                />
                <Input
                  placeholder="Profession/Role Applied *"
                  value={formData.profession}
                  onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="bg-black/20 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Skills</h3>
              </div>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add a skill"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="bg-black/30 border-white/20 text-white flex-1"
                />
                <Button onClick={addSkill} size="icon" className="shrink-0">
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)}>
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-black/20 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Education</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Degree"
                  value={formData.education.degree}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    education: { ...prev.education, degree: e.target.value }
                  }))}
                  className="bg-black/30 border-white/20 text-white"
                />
                <Input
                  placeholder="College/University"
                  value={formData.education.college}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    education: { ...prev.education, college: e.target.value }
                  }))}
                  className="bg-black/30 border-white/20 text-white"
                />
                <Input
                  placeholder="Year"
                  value={formData.education.year}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    education: { ...prev.education, year: e.target.value }
                  }))}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Projects */}
            <div className="bg-black/20 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Code className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Projects</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Project Name"
                    value={currentProject.name}
                    onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-black/30 border-white/20 text-white"
                  />
                  <div className="flex gap-2">
                    <Input
                      placeholder="Technology"
                      value={currentTech}
                      onChange={(e) => setCurrentTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTechToProject()}
                      className="bg-black/30 border-white/20 text-white flex-1"
                    />
                    <Button onClick={addTechToProject} size="icon" className="shrink-0">
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
                <textarea
                  placeholder="Project Description"
                  value={currentProject.description}
                  onChange={(e) => setCurrentProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black/30 border border-white/20 text-white rounded-md px-3 py-2 min-h-[80px] resize-none"
                />
                <div className="flex flex-wrap gap-2 mb-2">
                  {currentProject.techUsed.map((tech, index) => (
                    <span key={index} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <Button onClick={addProject} variant="outline" className="w-full">
                  Add Project
                </Button>
              </div>
              {formData.projects.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.projects.map((project, index) => (
                    <div key={index} className="bg-black/40 p-3 rounded border border-white/10">
                      <h4 className="text-white font-medium">{project.name}</h4>
                      <p className="text-gray-300 text-sm">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techUsed.map((tech, techIndex) => (
                          <span key={techIndex} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certificates */}
            <div className="bg-black/20 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Award className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Certificates & Courses</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Course Name"
                  value={currentCertificate.courseName}
                  onChange={(e) => setCurrentCertificate(prev => ({ ...prev, courseName: e.target.value }))}
                  className="bg-black/30 border-white/20 text-white"
                />
                <Input
                  placeholder="Platform (e.g., Coursera, Udemy)"
                  value={currentCertificate.platform}
                  onChange={(e) => setCurrentCertificate(prev => ({ ...prev, platform: e.target.value }))}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              <Button onClick={addCertificate} variant="outline" className="w-full mb-4">
                Add Certificate
              </Button>
              {formData.certificates.length > 0 && (
                <div className="space-y-2">
                  {formData.certificates.map((cert, index) => (
                    <div key={index} className="bg-black/40 p-3 rounded border border-white/10">
                      <h4 className="text-white font-medium">{cert.courseName}</h4>
                      <p className="text-gray-300 text-sm">{cert.platform}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="px-8 py-3 text-lg"
            >
              Start AI Interview
            </Button>
          </div>
        </div>
      </AnimatedTextBlockWrapper>
    </AnimatedWrapper>
  );
};