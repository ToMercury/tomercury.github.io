---
title: Skills
icon: fas fa-code
order: 3
---

> 技术主线：以 GPU 并行计算为核心中枢，向下扎根 Linux 底层开发，向上延伸 AI Infrastructure。
{: .prompt-info }

## 一、核心技术层次全景

<div class="skills-arch-diagram">
  <!-- 顶层：AI Infrastructure -->
  <div class="tier-box tier-ai">
    <div class="tier-name">AI Infrastructure</div>
    <div class="tier-sub">向上延伸：AI Infra 与算子协同</div>
    <div class="tier-keywords">AI 推理部署 · GPU 资源调度 · 推理优化 · 分布式训练 · 算力集群</div>
  </div>

  <!-- 连接 1: 箭头 -->
  <div class="connector">
    <div class="arrow-icons"><i class="fas fa-arrow-up-long"></i> <i class="fas fa-arrow-down-long"></i></div>
  </div>

  <!-- 中层：GPU 并行计算 (核心中枢) -->
  <div class="tier-box tier-core">
    <div class="tier-name">GPU 并行计算</div>
    <div class="tier-sub">技术中枢 · 并行加速与算子开发</div>
    <div class="tier-keywords">CUDA · GPU Kernel · 显存优化 · 并行算法 · 性能分析 · 负载均衡</div>
  </div>

  <!-- 连接 2: 箭头 -->
  <div class="connector">
    <div class="arrow-icons"><i class="fas fa-arrow-up-long"></i> <i class="fas fa-arrow-down-long"></i></div>
  </div>

  <!-- 底层：Linux 底层开发 -->
  <div class="tier-box tier-linux">
    <div class="tier-name">Linux 底层开发</div>
    <div class="tier-sub">向下延伸：系统与硬件机制</div>
    <div class="tier-keywords">Linux Kernel · 设备驱动 · DMA · PCIe · 内存管理 · 软硬件交互</div>
  </div>
</div>

---

## 二、技术能力矩阵

<div class="skills-matrix-grid">
  <!-- 卡片 1: GPU 并行计算 -->
  <div class="matrix-card card-core">
    <div class="matrix-header">
      <span class="matrix-title"><i class="fas fa-bolt"></i> GPU 并行计算</span>
      <span class="matrix-badge badge-core">精通 / Core</span>
    </div>
    <p class="matrix-desc">专注于 GPU 架构算力极限压榨、显存层级原语调优与大规模任务负载均衡调度。</p>
    <div class="matrix-chips-grid">
      <div class="m-chip">CUDA C/C++ 编程</div>
      <div class="m-chip">GPU Kernel 手写优化</div>
      <div class="m-chip">Shared Memory 优化</div>
      <div class="m-chip">Warp 原语 (__shfl)</div>
      <div class="m-chip">多流并发与异步隐藏</div>
      <div class="m-chip">Nsight 性能分析与调优</div>
    </div>
  </div>

  <!-- 卡片 2: AI Infrastructure -->
  <div class="matrix-card card-ai">
    <div class="matrix-header">
      <span class="matrix-title"><i class="fas fa-brain"></i> AI Infrastructure</span>
      <span class="matrix-badge badge-ai">熟练 / Proficient</span>
    </div>
    <p class="matrix-desc">覆盖大模型推理全栈加速、自定义硬件算子开发与分布式显存资源调度。</p>
    <div class="matrix-chips-grid">
      <div class="m-chip">PyTorch C++/CUDA 扩展</div>
      <div class="m-chip">Triton 算子开发</div>
      <div class="m-chip">TensorRT 算子融合</div>
      <div class="m-chip">TensorRT-LLM 量化加速</div>
      <div class="m-chip">vLLM 显存与 KV Cache</div>
      <div class="m-chip">分布式并行 (模型/流水/张量)</div>
    </div>
  </div>

  <!-- 卡片 3: Linux 底层开发 -->
  <div class="matrix-card card-linux">
    <div class="matrix-header">
      <span class="matrix-title"><i class="fas fa-microchip"></i> Linux 底层开发</span>
      <span class="matrix-badge badge-linux">熟练 / Proficient</span>
    </div>
    <p class="matrix-desc">从 Linux 内核驱动到系统构建，掌握底层软硬件接口与高速数据搬移技术。</p>
    <div class="matrix-chips-grid">
      <div class="m-chip">Linux 字符设备驱动</div>
      <div class="m-chip">中断子系统与并发控制</div>
      <div class="m-chip">DMA / mmap 零拷贝</div>
      <div class="m-chip">PCIe 高速互联交互</div>
      <div class="m-chip">内核内存管理机制</div>
      <div class="m-chip">QEMU 仿真与系统引导</div>
    </div>
  </div>

  <!-- 卡片 4: 工程基石与支撑工具 -->
  <div class="matrix-card card-eng">
    <div class="matrix-header">
      <span class="matrix-title"><i class="fas fa-toolbox"></i> 工程基石与支撑工具</span>
    </div>
    <p class="matrix-desc">熟练运用软硬件协同工具链、现代工程化构建调试标准与智能化辅助开发流。</p>
    <div class="eng-chips-row">
      <div class="m-chip"><i class="fas fa-robot"></i> AI Agent 协同</div>
      <div class="m-chip"><i class="fab fa-cuttlefish"></i> Modern C++</div>
      <div class="m-chip"><i class="fab fa-python"></i> Python 科学栈</div>
      <div class="m-chip"><i class="fas fa-cube"></i> CMake 混编</div>
      <div class="m-chip"><i class="fas fa-bug"></i> GDB 深度调试</div>
      <div class="m-chip"><i class="fab fa-git-alt"></i> Git 工作流</div>
    </div>
  </div>
</div>

> 以上仅为个人学习目标，非实战能力。
{: .prompt-warning }