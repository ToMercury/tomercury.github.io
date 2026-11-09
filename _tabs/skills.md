---
title: Skills
icon: fas fa-code
order: 3
---

> **技术主线**：以 **CUDA 异构并行计算** 为中枢支点，向下扎根 **嵌入式 Linux 底层系统**，向上延伸 **AI Infrastructure 与算子加速**。
{: .prompt-info }

## 一、核心技能全景

### 1. CUDA 异构并行与科学计算（核心专精）
- **课题算法**：有限积分法（FIT）电磁场并行求解、模板计算（Stencil）、稀疏线性代数（SpMV）
- **性能调优**：显存层级优化（Shared Memory、Warp 原语 `__shfl_sync`）、多流并发与异步通信隐藏
- **分布式调度**：多 GPU 动态任务负载均衡（Work Stealing）、NCCL 集合通信优化
- **剖析工具**：NVIDIA Nsight Systems、Nsight Compute、Compute Sanitizer

### 2. 嵌入式 Linux 与底层系统（向下扎根）
- **系统构建**：Buildroot 根文件系统与交叉编译链定制、QEMU 虚拟化与内核仿真引导
- **驱动机制**：Linux 字符设备驱动、中断子系统、DMA 与 `mmap` 零拷贝映射
- **端侧硬件**：RK3588（ARM + GPU + NPU）异构计算、STM32 裸机与 FreeRTOS 控制

### 3. AI Infrastructure 与计算加速（向上延伸）
- **算子开发**：PyTorch C++ / CUDA Extension 自定义算子扩展、Triton 算子编程
- **推理加速**：TensorRT 算子融合与量化、vLLM 分布式推理调度与 KV Cache 管理
- **科学智能**：物理启发神经网络（PINN / FNO）辅助电磁场快速求解

### 4. 语言与工程工具链（工程基石）
- **编程语言**：C/C++（熟练运用 C++17/20 现代化特性）、Python（NumPy / PyTorch 生态）、Shell
- **工程构建**：CMake 跨平台工程配置与 CUDA/C++ 混编、GDB / KGDB 深度调试、Git 工作流

---

## 二、技能矩阵速览

| 技术领域 | 掌握程度 | 核心技术点与工具 |
| :--- | :---: | :--- |
| **CUDA 并行计算** | 精通 / Core | FIT 求解器、Stencil、Shared Memory、Nsight 工具链 |
| **嵌入式 Linux** | 熟练 / Proficient | Buildroot、QEMU、内核驱动模块、DMA/mmap、RK3588 |
| **AI Infrastructure** | 熟练 / Proficient | PyTorch 算子扩展、Triton、TensorRT、vLLM、PINN |
| **语言与工具链** | 熟练 / Advanced | Modern C++ (17/20)、Python、CMake 混编、GDB 调试、Git |

---

## 三、未来就业方向与技术愿景

- **AI Infrastructure 工程师**：大模型分布式训练/推理框架、高性能算子优化、显存与通信拓扑调度
- **GPU 芯片系统软件工程师**：GPU / 异构芯片系统软件、原厂算子库与计算生态研发
- **工业仿真 / EDA 高性能求解器研发**：电磁场仿真与多物理场高性能科学计算求解器研发
- **端侧智能异构系统工程师**：边缘端智能 SoC 驱动开发、端侧 AI 加速与多核异构调度
