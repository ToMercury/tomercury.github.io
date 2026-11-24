---
title: Portfolio
icon: fas fa-rocket
order: 4
---

<div class="portfolio-container">
  <div class="portfolio-header">
    <p class="portfolio-intro">
      收录与展示个人的独立研发项目、书籍著作、开源工具与设计交付物。点击卡片可阅读完整介绍与获取相关资源。
    </p>
  </div>

  <div class="portfolio-filters" id="portfolio-filters">
    <button type="button" class="filter-btn active" data-filter="all">全部</button>
    <button type="button" class="filter-btn" data-filter="books">书籍著作</button>
    <button type="button" class="filter-btn" data-filter="projects">核心项目</button>
    <button type="button" class="filter-btn" data-filter="tools">开源工具</button>
    <button type="button" class="filter-btn" data-filter="crafts">生活手作</button>
  </div>

  <div class="portfolio-grid" id="portfolio-grid">
    {% assign items = site.portfolio | sort: 'order' %}
    {% for item in items %}
      {% assign category_slug = item.category_slug | default: 'projects' %}
      <a href="{{ item.url | relative_url }}" class="portfolio-card" data-category="{{ category_slug }}">
        <div class="card-media">
          {% if item.image %}
            <img src="{{ item.image | relative_url }}" alt="{{ item.title }}">
          {% elsif item.type == 'book' or category_slug == 'books' %}
            <div class="book-visual-mockup">
              <i class="fas fa-book-bookmark book-icon"></i>
              <div class="book-title">{{ item.title }}</div>
              <div class="book-author">{{ item.author | default: site.social.name }}</div>
            </div>
          {% else %}
            <div class="project-visual-mockup">
              <i class="{{ item.icon | default: 'fas fa-laptop-code' }}"></i>
            </div>
          {% endif %}
        </div>

        <div class="card-body">
          <div class="card-meta">
            <span class="badge portfolio-badge">{{ item.category | default: 'Project' }}</span>
            {% if item.date %}
              <span class="text-muted">
                {% include datetime.html date=item.date lang=lang %}
              </span>
            {% endif %}
          </div>

          <h3 class="card-title">{{ item.title }}</h3>

          {% if item.description %}
            <p class="card-desc">{{ item.description }}</p>
          {% endif %}

          {% if item.tags and item.tags.size > 0 %}
            <div class="card-tags">
              {% for tag in item.tags %}
                <span class="tag-pill">{{ tag }}</span>
              {% endfor %}
            </div>
          {% endif %}
        </div>
      </a>
    {% endfor %}
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    var filterBtns = document.querySelectorAll('#portfolio-filters .filter-btn');
    var cards = document.querySelectorAll('#portfolio-grid .portfolio-card');

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');
        cards.forEach(function(card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('d-none');
          } else {
            card.classList.add('d-none');
          }
        });
      });
    });
  });
</script>
