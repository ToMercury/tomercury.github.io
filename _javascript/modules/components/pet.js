/**
 * Desktop Pet: 大肥鱼 (Big Fat Fish)
 * 参考 @linxin666/dsh-pet 的逐帧动效设计
 * 包含：待机呼吸、左右走动巡逻、跳跃、挥手交互、自由拖拽定位、对话气泡
 */

const DIALOGUES = [
  // 欢迎与参观学习
  '欢迎来到 Mercury 的主页！随便看看呀～',
  '你专心看，我在屏幕边边守着你～',
  '这里记录了好多学习笔记和作品呢！',
  '把问题拆小一点，鱼也能看懂～',
  '今天也要元气满满地学习～',
  '离开前别忘了常来看看哦！',

  // 钩织与生活手作
  '小狐狸围巾好好看～ 戴起来一定很暖和！',
  '小王子钩得真精致，我也想要一个～',
  '一针一线钩织生活，超有耐心的！',
  '毛线团咕噜咕噜滚走了... 帮我捡一下嘛～',
  '手作是有温度的魔法～',
  '吾与小狐狸孰美～',

  // 投资与理财生活
  '数一数赚了多少钱，去买大白饭～',
  '股票涨了！今晚加餐小鱼干～',
  '今天亏好多，要饿肚子了QAQ～',
  '慢慢变富，做时间的朋友～',
  '长期主义！不要被短期的波动吓跑哦～',

  // 个人科研、CUDA 与技术探索
  'CUDA 并行加速中... 性能 +100%！',
  '戳我干嘛？不用优化 GPU Kernel 吗？',
  '思绪咕噜咕噜冒泡中... 灵感正在浮出水面～',
  '底层软硬件协同，探索算力的极限！',
  '先想清楚架构，再动手不迟～',

  // 休闲摸鱼与交互
  '摸鱼中... 咕噜噜～',
  '只要我不游动，就没有人知道我在摸鱼～',
  '看我摆尾～ 咕噜噜 (○ﾟεﾟ○)',
  '按住我可以把我拖到屏幕任意位置哦～',
  '累了就歇会儿，做一条快乐的咸鱼～'
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

  // 巡逻慢步漫游 (自主运动：左右概率严格平衡)
  function wander() {
    if (isDragging || container.classList.contains('d-none')) return;

    const minX = 20;
    const maxX = window.innerWidth - 210;
    const stepDist = Math.random() * 70 + 40; // 步长 40~110px

    // 计算向左和向右的可行空间
    const canMoveLeft = posX - stepDist >= minX;
    const canMoveRight = posX + stepDist <= maxX;

    let targetX = posX;
    let walkAction;

    if (canMoveLeft && canMoveRight) {
      // 左右两边都有充足空间时，50% : 50% 严格均等
      if (Math.random() < 0.5) {
        targetX = posX - stepDist;
        walkAction = 'running-left';
      } else {
        targetX = posX + stepDist;
        walkAction = 'running-right';
      }
    } else if (canMoveLeft) {
      // 贴近右边界，掉头向左走
      targetX = posX - stepDist;
      walkAction = 'running-left';
    } else if (canMoveRight) {
      // 贴近左边界，掉头向右走
      targetX = posX + stepDist;
      walkAction = 'running-right';
    } else {
      // 两边空间都不足时，原地跑步或挥手
      setAction(Math.random() < 0.5 ? 'running' : 'waving', 1800);
      return;
    }

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

  // 周期性漫步与动作交互 (覆盖所有 9 种动作)
  function scheduleNextWander() {
    clearTimeout(wanderTimer);
    // 10 到 20 秒触发一次自主行动
    const nextInterval = Math.random() * 10000 + 10000;
    wanderTimer = setTimeout(() => {
      if (!isDragging && !container.classList.contains('d-none')) {
        const rand = Math.random();
        if (rand < 0.45) {
          wander(); // 巡逻慢跑 (running-left / running-right)
        } else if (rand < 0.6) {
          setAction('waving', 2200); // 招手打招呼
        } else if (rand < 0.72) {
          setAction('jumping', 1800); // 欢呼跳跃
        } else if (rand < 0.82) {
          setAction('waiting', 2500); // 发呆思考等回复
        } else if (rand < 0.90) {
          setAction('review', 2400); // 认真整理润色
        } else if (rand < 0.95) {
          setAction('running', 1800); // 原地欢快小跑
        } else {
          randomDialogue(); // 冒泡语录
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
        const poses = ['jumping', 'waving', 'waiting', 'review', 'running'];
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
