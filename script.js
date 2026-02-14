// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fetch GitHub repositories
async function fetchGitHubProjects() {
    const username = 'Mandy2555';
    const projectsContainer = document.getElementById('github-projects');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = await response.json();
        
        if (repos.length === 0) {
            projectsContainer.innerHTML = '<p class="loading">No projects found. Check back soon!</p>';
            return;
        }

        // Filter out forked repos and categorize
        const originalRepos = repos.filter(repo => !repo.fork);
        
        const categorized = originalRepos.map(repo => {
            const name = repo.name.toLowerCase();
            const desc = (repo.description || '').toLowerCase();
            const topics = (repo.topics || []).join(' ').toLowerCase();
            const lang = (repo.language || '').toLowerCase();
            const combined = name + desc + topics + lang;
            
            let priority = 4;
            if (combined.match(/data|analysis|ml|machine.?learning|ai|analytics|pandas|numpy|sklearn|tensorflow|keras|jupyter/)) {
                priority = 1;
            } else if (combined.match(/java|spring|boot/)) {
                priority = 2;
            } else if (combined.match(/portfolio|personal|website|resume/)) {
                priority = 3;
            }
            
            return { repo, priority };
        });
        
        categorized.sort((a, b) => {
            if (a.priority !== b.priority) return a.priority - b.priority;
            return new Date(b.repo.updated_at) - new Date(a.repo.updated_at);
        });

        projectsContainer.innerHTML = '';

        categorized.forEach(({ repo }) => {
            const projectCard = createProjectCard(repo);
            projectsContainer.appendChild(projectCard);
        });

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsContainer.innerHTML = `
            <div class="loading">
                <p>Unable to load projects. Please visit my <a href="https://github.com/${username}" target="_blank">GitHub profile</a> directly.</p>
            </div>
        `;
    }
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a', 'Python': '#3572A5', 'Java': '#b07219',
        'TypeScript': '#2b7489', 'C++': '#f34b7d', 'C': '#555555',
        'PHP': '#4F5D95', 'Ruby': '#701516', 'Go': '#00ADD8',
        'Rust': '#dea584', 'Kotlin': '#A97BFF', 'Swift': '#ffac45',
        'HTML': '#e34c26', 'CSS': '#563d7c', 'Shell': '#89e051'
    };
    return colors[language] || '#6e7681';
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const description = repo.description || 'No description available';
    const language = repo.language || 'Code';
    const color = getLanguageColor(language);
    
    card.innerHTML = `
        <div class="project-header" style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);">
            <i class="fab fa-github" style="font-size: 4rem; color: rgba(255,255,255,0.9);"></i>
            <div class="project-lang">${language}</div>
        </div>
        <div class="project-content">
            <h3>${repo.name}</h3>
            <p>${description}</p>
            <div class="project-tech">
                ${repo.topics ? repo.topics.slice(0, 4).map(topic => `<span class="tech-tag">${topic}</span>`).join('') : ''}
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> View Code
                </a>
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
            </div>
        </div>
    `;

    return card;
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Load projects when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubProjects();
});
