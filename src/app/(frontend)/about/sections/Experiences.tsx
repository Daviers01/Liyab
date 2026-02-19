import { ExperienceCard } from '../components';
import { experiences } from "../data/experiences";

const Experiences = () => {
  return (
    <>
      <div className="text-xl text-muted-foreground mb-12">
        Companies that guided and gave me opportunities to grow throughout my career.
      </div>
      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line - Positioned after year and gap */}
        <div className="absolute left-[9rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-border/50 to-border/50" />
        
        <div className="space-y-12">
          {experiences.map((experience, i) => (
            <ExperienceCard key={`exp-${i}`} {...experience} isLast={i === experiences.length - 1} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Experiences;
