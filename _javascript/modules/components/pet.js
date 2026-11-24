/**
 * Desktop Pet: 大肥鱼 (Big Fat Fish)
 * 参考 @linxin666/dsh-pet 的逐帧动效设计
 * 包含：待机呼吸、左右走动巡逻、跳跃、挥手交互、自由拖拽定位、对话气泡
 */

const DIALOGUES = [
  '摸鱼中... 咕噜噜~',
  '代码写累了吗？看我原地游动！',
  '大肥鱼今天也在这里巡逻看家哦~',
  '报错别急，线索通常就在第一条异常附近。',
  '戳我干嘛？不用优化 GPU Kernel 吗？',
  '今天也要开心摸鱼，元气满满！',
  '你专心看，我在屏幕边边守着你。',
  '把问题缩小一点，鱼也能看懂。',
  '咕噜噜... 吐一个透明小泡泡给你 (○ﾟεﾟ○)',
  '离开前别忘了保存代码哦！',
  '只要我不游动，就没有人知道我在摸鱼。',
  'CUDA 并行加速中... 性能 +100%！',
  '按住我可以把我拖到任意喜欢的位置哦~'
];

export function initPet() {
  const container = document.getElementById('pet-container');
  const bubble = document.getElementById('pet-bubble');
  const dialogueText = document.getElementById('pet-dialogue');
  const avatarWrapper = document.getElementById('pet-avatar-wrapper');
  const avatar = document.getElementById('pet-avatar');
  const toggleBtn = document.getElementById('pet-toggle-btn');
  const restoreBtn = document.getElementById('pet-restore-btn');

  if (!container || !avatar || !avatarWrapper) {
    return;
  }

  // 动画动作路径
  const baseSrc = avatar.src;
  const basePath = baseSrc.substring(0, baseSrc.lastIndexOf('/') + 1);
  const actions = {
    idle: basePath + 'idle.webp',
    'running-left': basePath + 'running-left.webp',
    'running-right': basePath + 'running-right.webp',
    running: basePath + 'running.webp',
    jumping: basePath + 'jumping.webp',
    waving: basePath + 'waving.webp',
    waiting: basePath + 'waiting.webp',
    failed: basePath + 'failed.webp'
  };

  let bubbleTimer = null;
  let actionTimer = null;
  let wanderTimer = null;

  // 坐标与拖拽状态 (1x 原版边界)
  let posX = window.innerWidth - 220;
  let posY = window.innerHeight - 240;
  let isDragging = false;
  let dragMoved = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let startPosX = 0;
  let startPosY = 0;

  // 从本地读取保存的位置与收起状态
  const savedPos = localStorage.getItem('pet-position');
  if (savedPos) {
    try {
      const parsed = JSON.parse(savedPos);
      if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
        posX = Math.min(Math.max(10, parsed.x), window.innerWidth - 200);
        posY = Math.min(Math.max(10, parsed.y), window.innerHeight - 220);
      }
    } catch {
      // 容错使用默认坐标
    }
  }

  function applyPosition(x, y) {
    posX = x;
    posY = y;
    container.style.left = `${posX}px`;
    container.style.top = `${posY}px`;
    container.style.right = 'auto';
    container.style.bottom = 'auto';
  }

  applyPosition(posX, posY);

  // 响应窗口大小调整
  window.addEventListener('resize', () => {
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 220;
    const boundedX = Math.min(Math.max(10, posX), Math.max(10, maxX));
    const boundedY = Math.min(Math.max(10, posY), Math.max(10, maxY));
    applyPosition(boundedX, boundedY);
  });

  const isHidden = localStorage.getItem('pet-hidden') === 'true';
  if (isHidden) {
    container.classList.add('d-none');
    if (restoreBtn) restoreBtn.classList.remove('d-none');
  }

  // 气泡控制
  function showBubble(text, duration = 3500) {
    if (!bubble || !dialogueText) return;
    clearTimeout(bubbleTimer);
    dialogueText.textContent = text;
    bubble.classList.add('show');
    bubbleTimer = setTimeout(() => {
      bubble.classList.remove('show');
    }, duration);
  }

  function randomDialogue() {
    const text = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
    showBubble(text);
  }

  // 切换动作
  function setAction(actionName, duration = null) {
    if (!actions[actionName]) return;
    avatar.src = actions[actionName];

    clearTimeout(actionTimer);
    if (duration) {
      actionTimer = setTimeout(() => {
        setAction('idle');
      }, duration);
    }
  }

  // 巡逻慢步漫游 (自主运动)
  function wander() {
    if (isDragging || container.classList.contains('d-none')) return;

    // 随机决定巡逻距离与方向 (步长 40~100px)
    const distance = (Math.random() * 60 + 40) * (Math.random() > 0.5 ? 1 : -1);
    let targetX = posX + distance;

    // 边界限制
    const minX = 20;
    const maxX = window.innerWidth - 210;
    if (targetX < minX) targetX = minX + 50;
    if (targetX > maxX) targetX = maxX - 50;

    const walkAction = targetX > posX ? 'running-right' : 'running-left';
    setAction(walkAction);

    const startTime = performance.now();
    const duration = 1800;
    const startX = posX;

    function step(now) {
      if (isDragging) return;
      const progress = Math.min((now - startTime) / duration, 1);
      // 平滑缓动
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      const currentX = startX + (targetX - startX) * ease;
      applyPosition(currentX, posY);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setAction('idle');
      }
    }

    requestAnimationFrame(step);
  }

  // 周期性漫步与对话
  function scheduleNextWander() {
    clearTimeout(wanderTimer);
    // 12 到 25 秒触发一次偶发运动或互动
    const nextInterval = Math.random() * 13000 + 12000;
    wanderTimer = setTimeout(() => {
      if (!isDragging && !container.classList.contains('d-none')) {
        const rand = Math.random();
        if (rand < 0.45) {
          wander();
        } else if (rand < 0.7) {
          setAction('waving', 2000);
        } else if (rand < 0.85) {
          setAction('jumping', 1800);
        } else {
          randomDialogue();
        }
      }
      scheduleNextWander();
    }, nextInterval);
  }

  scheduleNextWander();

  // 拖拽逻辑 (Pointer Events 跨桌面端/移动端)
  avatarWrapper.addEventListener('pointerdown', (e) => {
    // 如果点击在关闭按钮或其图标上，直接放行，不触发拖拽
    if (e.target.closest('#pet-toggle-btn')) {
      return;
    }

    isDragging = true;
    dragMoved = false;
    startPointerX = e.clientX;
    startPointerY = e.clientY;
    startPosX = posX;
    startPosY = posY;

    avatarWrapper.classList.add('is-dragging');
    setAction('jumping');

    const onPointerMove = (moveEvent) => {
      if (!isDragging) return;
      const dx = moveEvent.clientX - startPointerX;
      const dy = moveEvent.clientY - startPointerY;

      if (Math.hypot(dx, dy) > 4) {
        dragMoved = true;
      }

      const newX = Math.min(Math.max(10, startPosX + dx), window.innerWidth - 200);
      const newY = Math.min(Math.max(10, startPosY + dy), window.innerHeight - 220);
      applyPosition(newX, newY);
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      avatarWrapper.classList.remove('is-dragging');

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      // 保存最新位置
      localStorage.setItem('pet-position', JSON.stringify({ x: posX, y: posY }));

      // 如果没有发生实际位移，判定为纯点击互动
      if (!dragMoved) {
        const poses = ['jumping', 'waving', 'waiting'];
        const chosen = poses[Math.floor(Math.random() * poses.length)];
        setAction(chosen, 2200);
        randomDialogue();
      } else {
        setAction('idle');
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  });

  // 收起/最小化
  if (toggleBtn) {
    const handleClose = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      container.classList.add('d-none');
      if (restoreBtn) restoreBtn.classList.remove('d-none');
      localStorage.setItem('pet-hidden', 'true');
    };

    toggleBtn.addEventListener('click', handleClose);
    toggleBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });
  }

  // 恢复/展开
  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      restoreBtn.classList.add('d-none');
      container.classList.remove('d-none');
      localStorage.setItem('pet-hidden', 'false');
      setAction('waving', 2200);
      showBubble('我回来啦！继续陪你~');
      scheduleNextWander();
    });
  }

  // 初始进场打招呼
  setTimeout(() => {
    if (!container.classList.contains('d-none')) {
      setAction('waving', 2500);
      showBubble('你好呀！大肥鱼来巡逻啦，拖我随时换位置哦~', 4500);
    }
  }, 1000);
}
