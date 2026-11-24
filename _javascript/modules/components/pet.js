/**
 * Desktop Pet: 大肥鱼 (Big Fat Fish)
 * 交互逻辑：点击反应、随机语录、表情切换、最小化收起
 */

const DIALOGUES = [
  '摸鱼中... 咕噜噜~',
  '代码写累了吗？看我摆尾！',
  '大肥鱼今天也在这里看家哦~',
  '报错别急，线索通常就在第一条异常附近。',
  '戳我干嘛？不用优化 GPU Kernel 吗？',
  '今天也要开心摸鱼，元气满满！',
  '你专心看，我给你守着右下角。',
  '把问题缩小一点，鱼也能看懂。',
  '咕噜噜... 吐一个透明小泡泡给你 (○ﾟεﾟ○)',
  '离开前别忘了保存代码哦！',
  '只要我不游动，就没有人知道我在摸鱼。',
  'CUDA 并行加速中... 性能 +100%！'
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

  // 资源路径（兼容相对路径）
  const baseSrc = avatar.src;
  const basePath = baseSrc.substring(0, baseSrc.lastIndexOf('/') + 1);
  const sprites = {
    idle: basePath + 'pet_idle.png',
    happy: basePath + 'pet_happy.png',
    pat: basePath + 'pet_pat.png',
    poke: basePath + 'pet_poke.png'
  };

  let bubbleTimer = null;
  let resetPoseTimer = null;

  // 检查本地持久化存储的收起状态
  const isHidden = localStorage.getItem('pet-hidden') === 'true';
  if (isHidden) {
    container.classList.add('d-none');
    if (restoreBtn) restoreBtn.classList.remove('d-none');
  }

  // 气泡展示
  function showBubble(text, duration = 3500) {
    if (!bubble || !dialogueText) return;
    clearTimeout(bubbleTimer);
    dialogueText.textContent = text;
    bubble.classList.add('show');
    bubbleTimer = setTimeout(() => {
      bubble.classList.remove('show');
    }, duration);
  }

  // 随机展示一条语录
  function randomDialogue() {
    const text = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
    showBubble(text);
  }

  // 临时切换表情/动作
  function triggerPose(poseName, duration = 1200) {
    if (!sprites[poseName]) return;
    clearTimeout(resetPoseTimer);
    avatar.src = sprites[poseName];
    resetPoseTimer = setTimeout(() => {
      avatar.src = sprites.idle;
    }, duration);
  }

  // 点击互动
  avatarWrapper.addEventListener('click', () => {
    // 抖动果冻动效
    avatarWrapper.classList.remove('react-jelly');
    // 强制重绘
    void avatarWrapper.offsetWidth;
    avatarWrapper.classList.add('react-jelly');

    // 随机动作 (happy, pat, poke)
    const poses = ['happy', 'pat', 'poke'];
    const chosen = poses[Math.floor(Math.random() * poses.length)];
    triggerPose(chosen, 1000);

    // 随机气泡文案
    randomDialogue();
  });

  // 收起/最小化
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      container.classList.add('d-none');
      if (restoreBtn) restoreBtn.classList.remove('d-none');
      localStorage.setItem('pet-hidden', 'true');
    });
  }

  // 恢复/唤醒
  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      restoreBtn.classList.add('d-none');
      container.classList.remove('d-none');
      localStorage.setItem('pet-hidden', 'false');
      triggerPose('happy', 1200);
      showBubble('我回来啦！继续陪你~');
    });
  }

  // 首次加载轻声问候
  setTimeout(() => {
    if (!container.classList.contains('d-none')) {
      showBubble('你好呀！我是大肥鱼~ 欢迎来到 Mercury 的主页！', 4000);
    }
  }, 1200);

  // 周期性自动冒泡（每隔 45 秒左右）
  setInterval(() => {
    if (!container.classList.contains('d-none') && !bubble.classList.contains('show')) {
      randomDialogue();
    }
  }, 45000);
}
