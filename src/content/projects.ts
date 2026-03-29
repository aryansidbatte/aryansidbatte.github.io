export interface Project {
  id: string
  title: string
  description: string  // short, shown on card
  outcome: string      // one-line result, shown in modal
  stack: string[]      // tech tags
  github: string       // repo URL
  demo?: string        // live demo URL (optional — render conditionally)
  caseStudy?: string   // internal route (only Wayward Suns)
  featured: boolean    // featured projects shown first
}

export const projects: Project[] = [
  {
    id: 'bettingbot',
    title: 'Bettingbot',
    description: 'Discord bot with horse races, parimutuel wagering, and voice rewards. Runs on AWS ECS Fargate with a full CI/CD pipeline.',
    outcome: 'Deployed to AWS ECS Fargate with RDS Postgres, Docker, Terraform, and GitHub Actions. Live in a Discord server.',
    stack: ['Python', 'discord.py', 'PostgreSQL', 'Docker', 'ECS Fargate', 'Terraform'],
    github: 'https://github.com/aryansidbatte/bettingbot',
    caseStudy: '/projects/bettingbot',
    featured: true,
  },
  {
    id: 'portfolio',
    title: 'This site',
    description: 'Personal portfolio built with Astro, Tailwind v4, and React islands. Custom cursor, magnetic elements, particle easter egg.',
    outcome: 'Designed and built from scratch. Deployed on GitHub Pages via GitHub Actions.',
    stack: ['Astro', 'Tailwind', 'TypeScript', 'React'],
    github: 'https://github.com/aryansidbatte/aryansidbatte.github.io',
    demo: 'https://aryansidbatte.github.io',
    featured: true,
  },
  {
    id: 'wayward-suns',
    title: 'Wayward Suns',
    description: 'Top-down action game with elemental weapon combination and enemy AI. 4-person team, 109 commits.',
    outcome: 'Vertical slice presented at CMPM 171 class showcase, UC Santa Cruz.',
    stack: ['Unity 6', 'C#', 'A*', 'Cinemachine'],
    github: 'https://github.com/aryansidbatte/wayward-suns',
    caseStudy: '/projects/wayward-suns',
    featured: true,
  },
  {
    id: 'recipe-platform',
    title: 'Recipe Sharing Platform',
    description: 'Full-stack recipe management with user auth, CRUD, and collaborative editing.',
    outcome: 'Built recipe CRUD, permission-based editing, and image uploads on a fullstack py4web/SQLite app.',
    stack: ['Python', 'py4web', 'JavaScript', 'SQLite'],
    github: 'https://github.com/ucsc2025-cse183/project-12',
    featured: true,
  },
  {
    id: 'navmesh',
    title: 'NavMesh Generation',
    description: 'Unity implementation of steering behaviors, A* pathfinding, and procedural NavMesh generation.',
    outcome: 'Implemented steering behaviors, A* pathfinding, and procedural NavMesh from level geometry.',
    stack: ['Unity', 'C#'],
    github: 'https://github.com/aryansidbatte/NavmeshGeneration',
    featured: true,
  },
  {
    id: 'greenies-adventure',
    title: "Greenie's Jumping Adventure",
    description: 'Browser-based 2D platformer with arcade physics, 3 levels, and scene management.',
    outcome: 'Shipped and playable live in browser via GitHub Pages.',
    stack: ['Phaser 3', 'JavaScript'],
    github: 'https://github.com/aryansidbatte/Game4b',
    // demo: 'https://...' — add when confirmed
    featured: false,
  },
  {
    id: 'pacman-ai',
    title: 'Pacman AI',
    description: 'AI agents for Pac-Man using classical and learning-based search.',
    outcome: 'Implemented A*, BFS, DFS, Minimax, Alpha-Beta Pruning, Q-learning, and value iteration agents. Competed in class-wide Capture the Flag tournament.',
    stack: ['Python'],
    github: 'https://github.com/aryansidbatte/pacman',
    featured: false,
  },
]
