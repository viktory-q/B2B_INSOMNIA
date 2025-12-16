document.addEventListener('DOMContentLoaded', function() {
    const casesContainer = document.getElementById('casesContainer');
    const openFiltersBtn = document.getElementById('openFilters');
    const filterModal = document.getElementById('filterModal');
    const closeModalBtn = document.querySelector('.modal-close');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const casesCount = document.getElementById('casesCount');
    
    
    let activeFilters = {
        industry: [],
        result: [],
        complexity: [],
        metrics: []
    };
    
    renderCases(caseStudies);
    
    openFiltersBtn.addEventListener('click', () => {
        filterModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeModalBtn.addEventListener('click', () => {
        filterModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    filterModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            filterModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    applyFiltersBtn.addEventListener('click', applyFilters);
    
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    function applyFilters() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        activeFilters = {
            industry: [],
            result: [],
            complexity: [],
            metrics: []
        };
        
        checkboxes.forEach(checkbox => {
            const name = checkbox.getAttribute('name');
            const value = checkbox.value;
            if (activeFilters[name]) {
                activeFilters[name].push(value);
            }
        });
        
        const filteredCases = caseStudies.filter(caseItem => {
            if (activeFilters.industry.length > 0) {
                const hasIndustry = caseItem.industry.some(industry => 
                    activeFilters.industry.includes(industry)
                );
                if (!hasIndustry) return false;
            }
            
            if (activeFilters.result.length > 0) {
                if (!activeFilters.result.includes(caseItem.result)) return false;
            }
            
            if (activeFilters.complexity.length > 0) {
                if (!activeFilters.complexity.includes(caseItem.complexity)) return false;
            }
            
            if (activeFilters.metrics.length > 0) {
                const hasMetric = caseItem.metrics.some(metric => 
                    activeFilters.metrics.includes(metric)
                );
                if (!hasMetric) return false;
            }
            
            return true;
        });
        
        renderCases(filteredCases);
        filterModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function resetFilters() {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        activeFilters = {
            industry: [],
            result: [],
            complexity: [],
            metrics: []
        };
        
        renderCases(caseStudies);
    }
    function declOfNum(number, titles) {  
        let cases = [2, 0, 1, 1, 1, 2];  
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]];  
    }

    
    function renderCases(cases) {
        casesContainer.innerHTML = '';
        
        cases.forEach(caseItem => {
            const card = document.createElement('div');
            card.className = 'case-card';
            
            let complexityClass = 'complexity-medium';
            if (caseItem.complexity === 'Сложная') complexityClass = 'complexity-high';
            
            const metricsHTML = caseItem.metrics.map(metric => 
                `<span class="metric-tag">${metric}</span>`
            ).join('');
            
            const firstInsight = caseItem.keyInsights[0];
            
            card.innerHTML = `
                <div class="case-card-content">
                    <h3 class="case-title">${caseItem.title}</h3>
                    <div class="case-meta">
                        <span class="case-company">${caseItem.company}</span>
                        <span class="case-industry">${caseItem.industry[0]}</span>
                    </div>
                    <div class="case-info">
                        <div class="case-info-item">
                            <span class="case-info-label">Метрики:</span>
                            <div class="case-metrics">${metricsHTML}</div>
                        </div>
                        <div class="case-info-item">
                            <span class="case-info-label">Результат:</span>
                            <span class="case-result">${caseItem.result}</span>
                        </div>
                        <div class="case-info-item">
                            <span class="case-info-label">Сложность:</span>
                            <span class="case-complexity ${complexityClass}">${caseItem.complexity}</span>
                        </div>
                    </div>
                    <div class="case-insight">
                        <div class="case-insight-label">Ключевой инсайт</div>
                        <div class="case-insight-text">${firstInsight}</div>
                    </div>
                    ${caseItem.budget ? `<div class="case-budget">Бюджет: ${caseItem.budget}</div>` : ''}
                </div>
            `;
            
            card.addEventListener('click', () => {
                window.location.href = `case-detail.html?id=${caseItem.id}`;
            });
            
            casesContainer.appendChild(card);
        });
        
        casesCount.textContent = `${cases.length} ${declOfNum(cases.length, ['кейс', 'кейса', 'кейсов'])}`;

    }
});