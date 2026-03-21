import { useState } from 'react'
import type { Project } from '../content/projects'
import ProjectModal from './ProjectModal'

interface Props {
  projects: Project[]
}

export default function WorkInteractive({ projects }: Props) {
  const [selected, setSelected] = useState<Project | null>(null)

  const handleCardClick = (project: Project) => {
    if (project.caseStudy) {
      window.location.href = project.caseStudy
    } else {
      setSelected(project)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <article
            key={project.id}
            onClick={() => handleCardClick(project)}
            onKeyDown={e => e.key === 'Enter' && handleCardClick(project)}
            className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3 h-full cursor-pointer transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            role="button"
            tabIndex={0}
            aria-label={`View ${project.title}`}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-primary text-sm">{project.title}</h3>
              <div className="flex flex-wrap gap-1 justify-end flex-shrink-0">
                {project.stack.slice(0, 2).map(tag => (
                  <span key={tag} className="font-mono text-[10px] text-muted bg-page px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-secondary text-xs leading-relaxed flex-1">{project.description}</p>
            <p className="text-muted text-[11px]">
              {project.caseStudy ? '→ Case study' : '→ View project'}
            </p>
          </article>
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
