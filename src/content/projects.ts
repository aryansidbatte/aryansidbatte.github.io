export interface Project {
  id: string
  title: string
  description: string  // short, shown on card
  outcome: string      // one-line result, shown in modal
  stack: string[]      // tech tags
  github: string       // repo URL
  demo?: string        // live demo URL (optional — render conditionally)
  caseStudy?: string   // internal route (only Wayward Suns)
  highlights?: string[] // bullet points shown in modal
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
    highlights: [
      'Most of the page is static Astro — plain HTML, no JS unless you\'re on an interactive section. React only loads for the four islands that need it: cursor, nav drawer, project grid, skills. Lighthouse 97.',
      'Custom cursor runs on a rAF loop with event delegation. Two document listeners cover the whole page; magnetic element rects are cached at mount and refreshed on resize so getBoundingClientRect never runs in the animation loop.',
      'The cursor dot morphs to a pill to a labeled pill using a spring cubic-bezier (0.34, 1.56, 0.64, 1). It gates on (pointer: fine) at load, so touch devices never run it.',
    ],
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
    github: 'https://github.com/aryansidbatte/recipe-sharing-platform',
    highlights: [
      'Auth is session-based through py4web\'s built-in Auth class — username login (not email), 1hr expiry, 3-password reuse block. JWT was stubbed in the codebase but never turned on.',
      'Ingredients are normalized into a many-to-many junction table with quantity_per_serving. Total calories compute server-side and are read-only; the author field stamps from auth.user_id on insert, invisible to forms.',
      'First run seeds the database from TheMealDB API, one request per letter of the alphabet. Any recipe that would exceed 2000 calories gets a random 600–850 value swapped in.',
    ],
    featured: true,
  },
  {
    id: 'navmesh',
    title: 'NavMesh Generation',
    description: 'Unity implementation of steering behaviors, A* pathfinding, and procedural NavMesh generation.',
    outcome: 'Implemented steering behaviors, A* pathfinding, and procedural NavMesh from level geometry.',
    stack: ['Unity', 'C#'],
    github: 'https://github.com/aryansidbatte/NavmeshGeneration',
    highlights: [
      'Wrote the convex decomposition myself: shoelace formula for winding, cross products to spot reflex corners, recursive polygon splits until every cell is convex.',
      'A* navigates the polygon graph; waypoints land at shared wall midpoints instead of cell centers so paths hug the geometry. A bestG dict cuts stale frontier entries without a heap.',
      'Steering: speed = clamp(dist, 0, max), rotation = angle × 2. Agents slow down near waypoints as a side effect of the distance formula, no deceleration curve required.',
    ],
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
