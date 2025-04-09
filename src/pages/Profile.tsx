import { useState } from 'react';

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function Profile() {
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'React', level: 'Intermediate' },
    { id: '2', name: 'TypeScript', level: 'Advanced' },
    { id: '3', name: 'UI/UX Design', level: 'Beginner' },
  ]);

  const addSkill = () => {
    const newSkill: Skill = {
      id: (skills.length + 1).toString(),
      name: 'New Skill',
      level: 'Beginner'
    };
    setSkills([...skills, newSkill]);
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
          
          {/* Profile Info */}
          <div className="px-6 py-4 relative">
            <div className="absolute -top-16 left-6">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-400">JD</span>
              </div>
            </div>
            
            <div className="ml-36 pb-4">
              <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
              <p className="text-gray-600">Frontend Developer</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="px-6 -mb-px flex space-x-8">
              <button className="py-4 px-1 border-b-2 border-indigo-500 text-indigo-600 font-medium">
                Profile
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                Resume
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                Settings
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6">
              {/* About */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
                <p className="text-gray-600">
                  Passionate frontend developer with 3+ years of experience building modern web applications.
                  Focused on creating intuitive user experiences with React and TypeScript.
                </p>
              </section>

              {/* Skills */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{skill.name}</p>
                        <p className="text-sm text-gray-500">{skill.level}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => setSkills(skills.map(s => 
                            s.id === skill.id 
                              ? { ...s, level: s.level === 'Beginner' ? 'Intermediate' : s.level === 'Intermediate' ? 'Advanced' : 'Beginner' }
                              : s
                          ))}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-400 hover:text-red-500"
                          onClick={() => removeSkill(skill.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:text-gray-700 hover:border-gray-400"
                    onClick={addSkill}
                  >
                    + Add Skill
                  </button>
                </div>
              </section>

              {/* Preferences */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Job Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Desired Role
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      defaultValue="Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location Preference
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      defaultValue="Remote"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Salary Expectation
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      defaultValue="$80,000 - $120,000"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
