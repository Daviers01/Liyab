import { ProjectCard } from '../components';
import { projects } from "../data/projects";

const Projects = () => {
  const clientProjects = projects.filter(p => p.category === 'client');
  const personalProjects = projects.filter(p => p.category === 'personal');

  return (
    <>
      <div className="text-xl text-muted-foreground mb-12">
        A showcase of client work delivering real business value and personal projects where I experiment with cutting-edge technologies.
      </div>

      <div className="space-y-16">
        {/* Client Projects */}
        {clientProjects.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold mb-8 text-foreground">Client Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {clientProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Personal Projects */}
        {personalProjects.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold mb-8 text-foreground">Personal Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {personalProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
