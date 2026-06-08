export const mockQuestions = [
  // ===== 前端 (7题) =====
  {
    id: 1,
    title: '解释 JavaScript 中的事件循环机制',
    category: '前端',
    difficulty: '中等',
    description: '请详细描述 JavaScript 的事件循环（Event Loop）机制，包括宏任务和微任务的执行顺序，以及它与浏览器渲染的关系。',
    answer: '事件循环是 JavaScript 的核心运行机制。JavaScript 是单线程语言，通过事件循环来实现异步操作。\n\n执行流程：\n1. 执行同步代码（执行栈）\n2. 执行栈清空后，检查微任务队列（Promise.then、MutationObserver）\n3. 微任务队列清空后，取一个宏任务执行（setTimeout、setInterval、I/O）\n4. 宏任务执行完毕后，再检查微任务队列\n5. 循环往复\n\n与浏览器渲染的关系：\n- 浏览器会在每一轮事件循环结束后、下一个宏任务开始前进行渲染\n- requestAnimationFrame 在渲染前执行\n- 如果微任务队列过长，会阻塞渲染'
  },
  {
    id: 2,
    title: 'Vue 3 的响应式原理',
    category: '前端',
    difficulty: '困难',
    description: '请解释 Vue 3 中使用 Proxy 实现响应式的原理，与 Vue 2 的 Object.defineProperty 相比有哪些改进？',
    answer: 'Vue 3 使用 Proxy 替代 Object.defineProperty 实现响应式系统。\n\nProxy 的优势：\n1. 可以直接监听对象和数组的变化，无需遍历每个属性\n2. 能监听属性的新增和删除（Vue 2 需要 $set）\n3. 能监听数组的索引和 length 变化\n4. 支持 Map、Set、WeakMap、WeakSet\n5. 性能更优，懒代理（用到才创建子代理）\n\n核心 API：\n- reactive()：创建深层响应式对象\n- ref()：创建基本类型的响应式引用\n- effect()：底层的副作用追踪\n- track()：依赖收集\n- trigger()：触发更新'
  },
  {
    id: 3,
    title: 'CSS Flexbox 与 Grid 的区别和适用场景',
    category: '前端',
    difficulty: '简单',
    description: '对比 CSS Flexbox 和 Grid 布局，说明各自的优势和最佳使用场景。',
    answer: 'Flexbox 是一维布局，Grid 是二维布局。\n\nFlexbox 适用场景：\n- 单行/单列的组件排列（导航栏、工具栏）\n- 居中对齐\n- 项目间等间距分布\n- 元素的顺序调整\n\nGrid 适用场景：\n- 复杂的页面整体布局\n- 同时控制行和列\n- 不规则网格（合并单元格）\n- 重叠布局\n\n最佳实践：Grid 用于页面级布局，Flexbox 用于组件级布局，二者经常嵌套使用。'
  },
  {
    id: 4,
    title: '浏览器从输入 URL 到页面渲染的完整过程',
    category: '前端',
    difficulty: '中等',
    description: '请详细描述从用户在浏览器地址栏输入 URL 到页面完全渲染出来的全过程。',
    answer: '1. URL 解析：浏览器解析输入，判断是搜索还是 URL\n2. DNS 查询：浏览器缓存 → 系统缓存 → 路由器缓存 → ISP DNS → 递归查询\n3. TCP 连接：三次握手建立连接\n4. TLS 握手（HTTPS）：证书验证、密钥协商\n5. HTTP 请求：发送请求报文\n6. 服务器处理并返回响应\n7. 浏览器解析 HTML：构建 DOM 树\n8. 解析 CSS：构建 CSSOM 树\n9. 合并为渲染树（Render Tree）\n10. 布局（Layout）：计算元素位置和大小\n11. 绘制（Paint）：像素填充\n12. 合成（Compositing）：GPU 合成最终画面'
  },
  {
    id: 5,
    title: 'React 和 Vue 的虚拟 DOM diff 算法对比',
    category: '前端',
    difficulty: '困难',
    description: '对比 React 和 Vue 在虚拟 DOM diff 算法上的异同点。',
    answer: '共同点：\n- 都使用虚拟 DOM 减少直接操作真实 DOM\n- 都采用同层比较策略（O(n) 复杂度）\n- 都使用 key 来优化列表 diff\n\nReact diff 策略：\n- 分为 tree diff、component diff、element diff 三个层级\n- 使用 Fiber 架构实现可中断的递归\n- 列表使用从左到右的遍历方式\n\nVue diff 策略：\n- Vue 3 采用最长递增子序列算法优化移动操作\n- 双端比较算法（头头、尾尾、头尾、尾头）\n- 编译时优化：静态节点标记、Block tree\n- PatchFlags 精确标记动态节点类型'
  },
  {
    id: 6,
    title: 'HTTP 缓存策略详解',
    category: '前端',
    difficulty: '中等',
    description: '请详细解释浏览器 HTTP 缓存的强缓存和协商缓存机制。',
    answer: '强缓存：浏览器不发请求，直接用本地缓存。\n- Cache-Control: max-age=31536000（优先级高）\n- Expires: 绝对时间（兼容旧浏览器）\n- 返回 200 (from disk/memory cache)\n\n协商缓存：浏览器发请求验证缓存是否过期。\n- Last-Modified / If-Modified-Since（精度秒级）\n- ETag / If-None-Match（精确到内容 hash）\n- 未过期返回 304 Not Modified\n\n优先级：Cache-Control > Expires > ETag > Last-Modified\n\n实践策略：\n- HTML：no-cache（每次协商）\n- JS/CSS/图片：max-age=1y + 文件名 hash'
  },
  {
    id: 7,
    title: 'TypeScript 中 type 和 interface 的区别',
    category: '前端',
    difficulty: '简单',
    description: '在 TypeScript 中，type 和 interface 有什么区别？什么时候用哪个？',
    answer: '主要区别：\n\n1. 扩展方式：\n- interface：extends 继承，支持声明合并\n- type：& 交叉类型，不支持声明合并\n\n2. 独有能力：\n- type 可以定义联合类型、元组、基本类型别名\n- interface 可以声明合并（同名自动合并）\n\n3. 使用建议：\n- 定义对象形状：优先用 interface\n- 定义联合类型、函数类型、工具类型：用 type\n- 库的公共 API：用 interface（方便扩展）'
  },

  // ===== 后端 (7题) =====
  {
    id: 8,
    title: 'RESTful API 设计原则',
    category: '后端',
    difficulty: '简单',
    description: '请说明 RESTful API 的核心设计原则和最佳实践。',
    answer: 'REST 六大约束：\n1. 客户端-服务器分离\n2. 无状态\n3. 可缓存\n4. 统一接口\n5. 分层系统\n6. 按需代码（可选）\n\n最佳实践：\n- URL 使用名词复数（/users, /articles）\n- HTTP 方法语义化（GET/POST/PUT/DELETE）\n- 状态码准确（200/201/204/400/401/404/500）\n- 版本控制（/api/v1/）\n- 分页（?page=1&size=20）\n- 过滤排序（?status=active&sort=-created）\n- HATEOAS（响应中包含相关链接）'
  },
  {
    id: 9,
    title: '数据库索引的原理和优化',
    category: '后端',
    difficulty: '中等',
    description: '请解释数据库索引的底层数据结构，以及如何进行索引优化。',
    answer: '常见索引结构：\n1. B+ 树（MySQL InnoDB 默认）：适合范围查询和排序\n2. Hash 索引：等值查询最快，不支持范围\n3. 全文索引：文本搜索\n4. R-Tree：空间数据\n\nB+ 树特点：\n- 叶子节点存数据，内部节点存索引\n- 叶子节点用链表连接，支持范围扫描\n- 树高度一般 2-4 层\n\n索引优化：\n- 最左前缀原则（联合索引）\n- 覆盖索引（避免回表）\n- 避免索引失效（函数、类型转换、前导%模糊查询）\n- 控制索引数量（写入性能与空间成本）'
  },
  {
    id: 10,
    title: 'JWT 认证机制详解',
    category: '后端',
    difficulty: '简单',
    description: '请解释 JWT (JSON Web Token) 的结构、工作流程以及优缺点。',
    answer: 'JWT 结构（三段式）：\n1. Header：算法和类型 {\"alg\":\"HS256\",\"typ\":\"JWT\"}\n2. Payload：声明数据（用户信息、过期时间）\n3. Signature：签名验证\n\n工作流程：\n1. 用户登录，服务器生成 JWT 返回\n2. 客户端存储（localStorage/Cookie）\n3. 每次请求在 Authorization: Bearer <token> 中携带\n4. 服务器验证签名和有效期\n\n优点：无状态、跨域友好、分布式系统友好\n缺点：无法主动失效、Token 较大、Payload 不加密（仅编码）\n\n安全建议：设置短过期时间 + Refresh Token 机制'
  },
  {
    id: 11,
    title: '微服务架构的优缺点',
    category: '后端',
    difficulty: '中等',
    description: '分析微服务架构与单体架构的优缺点，以及在什么场景下应该选择微服务。',
    answer: '微服务优点：\n- 独立部署和扩展\n- 技术栈灵活\n- 故障隔离\n- 团队自治\n\n微服务缺点：\n- 分布式系统复杂性（网络延迟、数据一致性）\n- 运维成本高（监控、日志、链路追踪）\n- 服务间通信开销\n- 事务管理复杂（Saga 模式）\n\n选择微服务的条件：\n- 团队规模 > 10 人\n- 不同模块有不同的扩展需求\n- 需要频繁独立部署\n- 业务边界清晰\n\n不建议微服务：创业初期、小团队、业务不确定。'
  },
  {
    id: 12,
    title: 'SQL 查询性能优化实战',
    category: '后端',
    difficulty: '困难',
    description: '给出一条慢查询的 SQL，请说明你的优化思路和方法。',
    answer: '排查步骤：\n1. EXPLAIN 分析执行计划\n - type: ALL(全表扫描) → ref/range(索引)\n - rows: 扫描行数\n - Extra: Using filesort / Using temporary\n\n2. 优化策略：\n - 添加合适索引（联合索引遵循最左前缀）\n - 避免 SELECT *，只查需要的字段\n - 分页优化（延迟关联 / 游标分页）\n - 子查询改 JOIN\n - 大表拆分（垂直/水平分表）\n - 读写分离\n\n3. 架构级优化：\n - 热数据缓存（Redis）\n - 搜索走 Elasticsearch\n - 异步写入（消息队列）'
  },
  {
    id: 13,
    title: 'Redis 常见数据结构及应用场景',
    category: '后端',
    difficulty: '中等',
    description: '请列举 Redis 的主要数据结构及其对应的实际应用场景。',
    answer: '五大基础数据结构：\n\n1. String：缓存、计数器、分布式锁、Session\n2. Hash：对象存储（用户信息）、购物车\n3. List：消息队列、最新消息列表、Timeline\n4. Set：标签系统、共同好友、去重\n5. Sorted Set：排行榜、延时队列、范围查询\n\n高级数据结构：\n- HyperLogLog：UV 统计（去重计数）\n- Bitmap：签到系统、活跃用户统计\n- Stream：消息流（类似 Kafka）\n- GEO：地理位置服务'
  },
  {
    id: 14,
    title: 'Docker 容器与虚拟机的区别',
    category: '后端',
    difficulty: '简单',
    description: '对比 Docker 容器和传统虚拟机的区别，以及各自的适用场景。',
    answer: '核心区别：\n\n虚拟机：\n- 虚拟化层级：硬件级（Hypervisor）\n- 包含完整 OS\n- 启动时间：分钟级\n- 资源开销：GB 级内存\n- 隔离性：强（独立内核）\n\nDocker 容器：\n- 虚拟化层级：OS 级（共享宿主内核）\n- 只包含应用和依赖\n- 启动时间：秒级\n- 资源开销：MB 级\n- 隔离性：中（Namespace + Cgroup）\n\n选择建议：\n- 需要不同 OS / 强隔离 → 虚拟机\n- 微服务 / CI/CD / 快速部署 → Docker\n- 生产环境常二者结合使用'
  },

  // ===== 算法 (6题) =====
  {
    id: 15,
    title: '常见排序算法的时间复杂度对比',
    category: '算法',
    difficulty: '简单',
    description: '请对比常见排序算法的时间复杂度、空间复杂度和稳定性。',
    answer: '| 算法 | 最好 | 平均 | 最坏 | 空间 | 稳定性 |\n| 冒泡 | O(n) | O(n²) | O(n²) | O(1) | 稳定 |\n| 选择 | O(n²) | O(n²) | O(n²) | O(1) | 不稳定 |\n| 插入 | O(n) | O(n²) | O(n²) | O(1) | 稳定 |\n| 归并 | O(nlogn) | O(nlogn) | O(nlogn) | O(n) | 稳定 |\n| 快排 | O(nlogn) | O(nlogn) | O(n²) | O(logn) | 不稳定 |\n| 堆排 | O(nlogn) | O(nlogn) | O(nlogn) | O(1) | 不稳定 |\n\n实际应用：\n- V8 引擎使用 TimSort（混合归并+插入）\n- Java Arrays.sort: 基本类型用双轴快排，对象用 TimSort'
  },
  {
    id: 16,
    title: '二叉树的遍历方式',
    category: '算法',
    difficulty: '简单',
    description: '请说明二叉树的四种遍历方式及其实现思路。',
    answer: '四种遍历：\n\n1. 前序遍历（根-左-右）：\n   用于复制树结构、序列化\n\n2. 中序遍历（左-根-右）：\n   BST 中序遍历得到有序序列\n\n3. 后序遍历（左-右-根）：\n   用于计算目录大小、删除树\n\n4. 层序遍历（BFS）：\n   使用队列，逐层访问\n\n递归实现简单直观，迭代实现使用栈模拟。\n\n面试高频变体：\n- 之字形层序遍历\n- 从右侧看二叉树\n- 序列化与反序列化\n- 最近公共祖先'
  },
  {
    id: 17,
    title: '动态规划的核心思想和解题框架',
    category: '算法',
    difficulty: '困难',
    description: '请总结动态规划的核心思想、适用条件和通用解题框架。',
    answer: '核心思想：将大问题拆解为重叠子问题，通过存储子问题的解避免重复计算。\n\n适用条件：\n1. 最优子结构：大问题的最优解包含子问题的最优解\n2. 重叠子问题：子问题会被反复求解\n3. 无后效性：当前状态只依赖之前的状态\n\n解题框架：\n1. 定义状态：dp[i] 的含义\n2. 状态转移方程：dp[i] = f(dp[i-1], ...)\n3. 初始条件：dp[0] = ?\n4. 遍历顺序：确保依赖的子问题已求解\n5. 返回结果：dp[n] 或 max(dp)\n\n经典题目：\n- 斐波那契、爬楼梯（入门）\n- 背包问题（01/完全/多重）\n- 最长递增子序列\n- 编辑距离'
  },
  {
    id: 18,
    title: '图的 BFS 和 DFS 应用场景',
    category: '算法',
    difficulty: '中等',
    description: '对比图的 BFS 和 DFS，说明各自的适用场景和实现方式。',
    answer: 'BFS（广度优先搜索）：\n- 数据结构：队列\n- 特点：逐层扩展\n- 适用场景：\n  · 最短路径（无权图）\n  · 层序遍历\n  · 社交网络中查找 N 度好友\n  · 网络爬虫\n\nDFS（深度优先搜索）：\n- 数据结构：栈/递归\n- 特点：深入到底再回溯\n- 适用场景：\n  · 连通分量检测\n  · 拓扑排序\n  · 路径搜索\n  · 回溯问题（排列组合）\n  · 迷宫问题\n\n复杂度都是 O(V+E)，空间 O(V)。'
  },
  {
    id: 19,
    title: 'HashMap 的底层实现原理',
    category: '算法',
    difficulty: '困难',
    description: '请详细描述 HashMap（如 Java 中）的底层实现，包括扩容机制和哈希冲突处理。',
    answer: '底层结构：数组 + 链表 + 红黑树（JDK 8+）\n\n核心流程：\n1. 计算 key 的 hashCode\n2. 扰动处理：h ^ (h >>> 16)\n3. 定位桶：(n-1) & hash\n4. 插入/查找\n\n哈希冲突处理：\n- 链表法（默认）\n- 链表长度 >= 8 且数组长度 >= 64 时转红黑树\n- 红黑树节点 <= 6 时退化为链表\n\n扩容机制：\n- 默认容量 16，负载因子 0.75\n- 元素数 > 容量 × 负载因子时扩容为 2 倍\n- JDK 8 扩容不需重新 hash，根据高位 bit 判断新位置\n\n线程不安全：并发使用 ConcurrentHashMap'
  },
  {
    id: 20,
    title: '如何判断链表是否有环',
    category: '算法',
    difficulty: '中等',
    description: '请给出判断单链表是否存在环的算法，以及如何找到环的入口节点。',
    answer: '方法一：哈希集合\n- 遍历节点放入 Set，遇到重复即有环\n- 时间 O(n)，空间 O(n)\n\n方法二：快慢指针（Floyd 判圈）\n- 快指针每次走 2 步，慢指针每次走 1 步\n- 相遇则有环，否则快指针到达 null 即无环\n- 时间 O(n)，空间 O(1)\n\n找环入口：\n1. 快慢指针相遇后\n2. 将一个指针重置到头节点\n3. 两个指针各走一步\n4. 再次相遇点即为环入口\n\n数学证明：设头到入口距离为 a，入口到相遇点为 b，环长为 c。\n快指针走了 a+b+c，慢指针走了 a+b，2(a+b) = a+b+c → a = c-b'
  },

  // ===== 系统设计 (5题) =====
  {
    id: 21,
    title: '设计一个短链接服务',
    category: '系统设计',
    difficulty: '中等',
    description: '请设计一个类似 bit.ly 的短链接服务，支持生成短链接和重定向功能。',
    answer: '需求分析：\n- 长 URL → 短 URL（如 https://short.ly/abc123）\n- 短 URL → 301/302 重定向到原始 URL\n- QPS 预估：读写比 100:1\n\n核心设计：\n1. ID 生成：分布式自增 ID / 雪花算法\n2. 编码：Base62（a-z, A-Z, 0-9），6 位可表示 568 亿\n3. 存储：MySQL 主表 + Redis 缓存热门链接\n4. 重定向：301（永久，减少服务器压力）或 302（临时，便于统计）\n\n扩展设计：\n- 自定义短码\n- 过期时间\n- 点击统计\n- 防滥用（限流）\n\n高可用：多机房部署 + 一致性 Hash 分片'
  },
  {
    id: 22,
    title: '如何设计一个高可用的缓存系统',
    category: '系统设计',
    difficulty: '困难',
    description: '请设计一个分布式缓存系统，解决缓存穿透、击穿和雪崩问题。',
    answer: '三大缓存问题：\n\n1. 缓存穿透（查不存在的 key）：\n- 布隆过滤器：在缓存前拦截不存在的 key\n- 空值缓存：将 null 也缓存，设短过期时间\n\n2. 缓存击穿（热点 key 过期）：\n- 互斥锁：只允许一个线程重建缓存\n- 永不过期 + 异步更新\n\n3. 缓存雪崩（大量 key 同时过期）：\n- 过期时间加随机值\n- 多级缓存（L1 本地 + L2 Redis）\n- 限流降级\n\n高可用架构：\n- Redis Cluster（3 主 3 从）\n- 一致性 Hash 分片\n- 哨兵模式自动故障转移\n- 持久化：RDB + AOF 混合'
  },
  {
    id: 23,
    title: '设计一个消息推送系统',
    category: '系统设计',
    difficulty: '困难',
    description: '请设计一个支持千万级用户的消息推送系统。',
    answer: '需求分析：\n- 支持单播、多播、广播\n- 实时性：秒级到达\n- 可靠性：消息不丢失\n\n架构设计：\n1. 接入层：WebSocket 长连接网关（百万连接/机器）\n2. 逻辑层：推送服务（路由、去重、限流）\n3. 存储层：消息队列（Kafka）+ 离线消息存储（MySQL）\n4. 推送链路：\n   - 在线用户：直接推送\n   - 离线用户：存离线消息，上线后拉取\n\n核心挑战：\n- 连接管理：Session 服务器记录用户连在哪台网关\n- 消息有序性：单用户消息队列\n- 广播优化：写扩散 vs 读扩散\n- ACK 机制：确保送达'
  },
  {
    id: 24,
    title: '如何保证分布式系统的数据一致性',
    category: '系统设计',
    difficulty: '困难',
    description: '在分布式环境下，如何保证多个服务之间的数据一致性？',
    answer: 'CAP 定理：一致性(C)、可用性(A)、分区容错(P) 三者只能满足两个。\n\n解决方案：\n\n1. 强一致性：\n- 分布式事务（2PC/3PC）：性能差，实际少用\n- Raft/Paxos 共识算法：etcd、ZooKeeper\n\n2. 最终一致性（实际最常用）：\n- Saga 模式：编排式/协调式补偿事务\n- 消息队列 + 本地消息表：\n  · 业务操作 + 写消息表在同一事务\n  · 异步发送消息，消费者处理\n  · 失败重试 + 幂等处理\n- TCC：Try-Confirm-Cancel\n\n3. 实际策略：\n- 核心链路用 Saga\n- 非核心用消息最终一致\n- 对账系统兜底'
  },
  {
    id: 25,
    title: '设计一个秒杀系统',
    category: '系统设计',
    difficulty: '中等',
    description: '请设计一个能承受高并发的电商秒杀系统。',
    answer: '核心挑战：瞬时高并发、超卖、恶意请求\n\n分层削峰方案：\n1. 前端：\n- 按钮防重复点击\n- 验证码/答题\n- 动态 URL（防脚本）\n\n2. 网关层：\n- 限流（令牌桶/滑动窗口）\n- IP/用户维度限制\n- 请求排队\n\n3. 服务层：\n- Redis 原子扣减库存（DECR + Lua 脚本）\n- 内存标记已售罄，直接拒绝后续请求\n\n4. 异步处理：\n- 下单请求入消息队列\n- 消费者异步创建订单\n- 超时未支付自动释放\n\n数据一致性：\n- Redis 预扣 → MQ → 数据库最终扣减\n- 对账任务兜底'
  },

  // ===== 行为面试 (7题) =====
  {
    id: 26,
    title: '请描述你遇到过的最大技术挑战',
    category: '行为面试',
    difficulty: '中等',
    description: '面试官想了解你解决复杂问题的能力。请用 STAR 方法描述一个你遇到的重大技术挑战。',
    answer: 'STAR 回答框架：\n\nSituation（情境）：\n简要描述项目背景和你的角色\n\nTask（任务）：\n遇到了什么具体的技术挑战\n\nAction（行动）：\n你采取了哪些步骤来解决问题\n- 分析问题根因\n- 调研可能的方案\n- 选择最优方案并实施\n- 遇到阻碍如何调整\n\nResult（结果）：\n最终结果和量化指标\n- 性能提升了多少\n- 系统稳定性改善\n- 团队受益\n\n注意要点：\n- 聚焦你个人的贡献\n- 展示技术深度和决策能力\n- 提及从中学到了什么'
  },
  {
    id: 27,
    title: '你是如何处理团队冲突的',
    category: '行为面试',
    difficulty: '简单',
    description: '描述一个你在团队中遇到意见分歧的情况，以及你是如何处理的。',
    answer: '推荐回答策略：\n\n1. 先肯定冲突的正常性\n- 不同观点能带来更好的决策\n- 重要的是如何建设性地解决\n\n2. STAR 方法举例：\n- 具体描述分歧场景（技术选型/优先级/设计方案）\n- 你如何主动沟通\n- 如何用数据和事实支持论点\n- 是否做了 POC 验证\n- 最终如何达成共识\n\n3. 展示的品质：\n- 换位思考能力\n- 数据驱动的决策\n- 尊重不同意见\n- 以团队利益为先\n- 妥协与坚持的平衡'
  },
  {
    id: 28,
    title: '你为什么想离开上一家公司',
    category: '行为面试',
    difficulty: '简单',
    description: '这是一个常见但容易踩坑的行为面试题，请给出恰当的回答策略。',
    answer: '回答原则：\n1. 积极正面（聚焦成长，而非抱怨）\n2. 诚实但策略性\n3. 与应聘岗位关联\n\n好的角度：\n- 寻求更大的技术挑战和成长空间\n- 希望接触新的业务领域\n- 想参与更大规模的系统建设\n- 职业规划与当前方向更匹配\n\n避免说的：\n- 直接贬低前公司或同事\n- 纯粹因为薪资（除非对方主动问）\n- 暴露不稳定倾向\n\n模板回答：\n"在上一家公司我学到了很多（具体说），但我现在希望在（具体领域）有更深入的发展，贵公司在这方面的（具体优势）非常吸引我。"'
  },
  {
    id: 29,
    title: '你如何平衡代码质量和开发速度',
    category: '行为面试',
    difficulty: '中等',
    description: '在项目紧急的情况下，你如何平衡代码质量和交付速度？',
    answer: '核心观点：两者并非完全对立\n\n短期策略：\n1. 区分 MVP 核心功能与非核心功能\n2. 核心功能保证质量，非核心可简化\n3. 记录技术债务（Tech Debt Log）\n4. 关键路径不妥协（安全、数据完整性）\n\n长期策略：\n1. 建立代码规范和 CI/CD\n2. 自动化测试覆盖核心逻辑\n3. 代码审查制度化\n4. 定期偿还技术债\n\n实际做法：\n- 时间充裕 → 完整测试 + 重构\n- 时间紧张 → 核心路径测试 + TODO 标记 + 排期偿还\n- 永远不要的 → 跳过安全检查、硬编码密码、不写注释的复杂逻辑'
  },
  {
    id: 30,
    title: '描述一个你主导的项目',
    category: '行为面试',
    difficulty: '中等',
    description: '请描述一个你从头到尾主导的项目，包括规划、执行和交付过程。',
    answer: 'STAR + 项目管理维度：\n\n1. 项目启动：\n- 需求分析和技术调研\n- 可行性评估\n- 制定技术方案和排期\n\n2. 架构设计：\n- 技术选型（为什么选这个）\n- 模块划分和接口设计\n- 评审和修改\n\n3. 开发执行：\n- 任务拆分和分配\n- 进度跟踪和风险管理\n- Code Review\n\n4. 测试交付：\n- 单元测试 + 集成测试\n- 性能测试\n- 灰度发布\n\n5. 成果总结：\n- 量化指标（用户量、性能提升、效率改善）\n- 踩过的坑和经验教训\n- 沉淀的工具/文档'
  },
  {
    id: 31,
    title: '你是如何学习新技术的',
    category: '行为面试',
    difficulty: '简单',
    description: '面试官想了解你的学习能力和方法论。',
    answer: '展示系统化的学习方法：\n\n1. 信息获取：\n- 官方文档（第一手资料）\n- 技术博客和社区（掘金、Medium）\n- 源码阅读\n- 技术大会/播客\n\n2. 实践驱动：\n- 小项目练手\n- 在工作中寻找应用场景\n- 参与开源项目\n- 写技术博客输出\n\n3. 深度学习：\n- 理解原理而非只会使用\n- 对比同类技术（为什么选 A 不选 B）\n- 了解最佳实践和反模式\n\n4. 具体例子：\n- 最近学了什么新技术\n- 学习过程和时间线\n- 如何应用到工作中\n- 产出了什么成果'
  },
  {
    id: 32,
    title: '你对未来三年的职业规划是什么',
    category: '行为面试',
    difficulty: '简单',
    description: '面试官想了解你的职业发展方向和稳定性。',
    answer: '回答策略：\n\n1. 展示方向感（不要说"没想过"）\n2. 与公司发展关联\n3. 具体但不僵硬\n\n框架回答：\n\n第一年：\n- 快速融入团队和业务\n- 在（具体技术方向）深入积累\n- 承担核心模块开发\n\n第二年：\n- 成为领域专家\n- 主导重要项目\n- 开始技术分享和团队贡献\n\n第三年：\n- 技术专家 OR 技术管理方向\n- 影响团队技术决策\n- 推动技术体系建设\n\n关键点：\n- 表明长期发展意愿\n- 技术深度 + 业务理解\n- 符合岗位的成长路径'
  }
]
