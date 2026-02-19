import { SkillCard } from '../components';
import { coreSkills, marketingTechSkills, cloudSkills, otherSkills } from "../data/skills";

const Skills = () => {
  return (
    <>
      <div className="text-xl text-muted-foreground mb-12">
        Technologies and tools I use to build high-performance web applications and implement analytics solutions.
      </div>
      
      <div className="leading-7 text-xs lg:text-sm xl:text-base tracking-normal lg:tracking-wider xl:tracking-widest space-y-12">
        {/* Core Stack */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">Core Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {coreSkills.map((skill, i) => (
              <SkillCard key={`core-${i}`} name={skill.name} image={skill.image} />
            ))}
          </div>
        </div>

        {/* MarTech & Data */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">MarTech & Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {marketingTechSkills.map((skill, i) => (
              <SkillCard key={`martech-${i}`} name={skill.name} image={skill.image} />
            ))}
          </div>
        </div>

        {/* Cloud */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">Cloud Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cloudSkills.map((skill, i) => (
              <SkillCard key={`cloud-${i}`} name={skill.name} image={skill.image} />
            ))}
          </div>
        </div>

        {/* Other Technologies */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-foreground">Other Technologies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {otherSkills.map((skill, i) => (
              <SkillCard key={`other-${i}`} name={skill.name} image={skill.image} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Skills;
