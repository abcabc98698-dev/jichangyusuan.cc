import { DomainSpec, WorkflowStepItem, PitfallItem } from './domains/types.js';

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h = (h ^ str.charCodeAt(i)) * 16777619;
  }
  return Math.abs(h);
}

// 8 大互补分析维度的完整自洽配置：各具独特的判定结论、概念引言、表格、算法推导与算例
const perspectiveConfigs = [
  // 视角 0: 首次法币实付与收银台通道摩擦
  {
    tag: '首次法币实付与收银台通道摩擦',
    verdictGen: (t: string, c: string, p: number, gb: number, m: string) => {
      const vSeed = hashSeed(t) % 4;
      if (vSeed === 0) {
        return `针对“${t}”，核心结论是：<strong>切忌把年付折算价当成真实月花销，买网络服务必须以“首月最低实付”控制试错敞口</strong>。在第三方收银台结账前，逐项排查网关处理费、外币汇损与最低充值门槛，把不可退款的首次本金风险严格锁死在 ¥${p}～¥${p + 15} 极限以内。`;
      } else if (vSeed === 1) {
        return `评估“${t}”时，首要准则是：<strong>优先核算首次从账户划扣的净法币总额，坚决杜绝把远期账面均摊当成真实首付</strong>。务必核对收银台加收的聚合支付手续费与最低起充差额，将首期未经验证的试错敞口严格控制在 ¥${p} 左右。`;
      } else if (vSeed === 2) {
        return `在“${t}”的决策链条中，最关键的实操动作是：<strong>以首期单月真实实付锁定本金敞口，抵御后期可能出现的断网与服务降级风险</strong>。在完成实际测试前，避免一次性押入超过 ¥${p + 12} 元的未履约资金。`;
      } else {
        return `关于“${t}”，财务精算上的核心要领在于：<strong>将名义票面价与收银台实扣金额彻底区分，严格执行小额初审原则</strong>。首月建议以 ¥${p}～¥${p + 10} 档位试跑晚高峰与长连接，达标后再决定是否追加后续预算。`;
      }
    },
    angleIntro: (t: string, c: string) => 
      `从**现金流动性与支付收银台实付款**切入，在《${c}》的场景下，首要任务是核清支付网关手续费、跨币种汇损与不可退款敞口，拒绝任何把长期折算价混淆为当期现金支出的财务陷阱。`,
    tableTitle: (t: string) => `针对《${t}》的首次现金实付与交易摩擦审计表`,
    tableHeaders: ['财务科目', '会计性质', '发生金额区间', '计费周期', '核验方法', '风控级别'],
    tableRows: (p: number, gb: number, m: string) => [
      ['套餐首次实付款', '变动运营支出 (OpEx)', `¥${p} ~ ¥${p + 10}`, '单期扣除', '查看收银台最终刷卡/扫码数字', '高 (现金硬约束)'],
      ['支付通道处理费', '交易摩擦成本', '¥1.0 ~ ¥2.5 或 2%~5%', '每笔交易附加', '对比订单票面价与银行账单扣除差额', '小额高频重度损耗'],
      ['新旧过渡冗余费', '容灾保障预算', `¥${Math.round(p * 0.5)} ~ ¥${p}`, '迁移换站时发生', '双重订阅重叠 3~7 天按日折算', '必要容灾保险支出'],
      ['平台钱包未提现余额', '预付资金质押风险', '¥10 ~ ¥50 (充值门槛差额)', '平台账户内锁死', '核实用户中心退款政策条款', '极高 (本金沉没)']
    ],
    workflowSteps: (t: string, c: string, p: number, gb: number, m: string): WorkflowStepItem[] => [
      {
        name: '核算首次实付现金暴露上限 (Cash Exposure)',
        description: `调取目标套餐首期票面实付款 (¥${p})，加入支付网关固定与比例手续费 (约 ¥1.5)，计算出首付最大现金敞口 ¥${(p + 1.5).toFixed(1)}。`,
        action: '查看收银台最终划扣金额，拒绝任何高于票面价 10% 的通道加价'
      },
      {
        name: '对标个人月度纯闲置资金上限 (Loss Cap)',
        description: '将实付金额与个人每月可承受的完全沉没损失对比。若实付款大于该上限，坚决禁止购买长周期，强制维持入门月付。',
        action: `预留换站备用缓冲金 ¥${Math.round(p * 0.5)}，确保随时可切备用线路`
      },
      {
        name: '建立 3 个月全周期记账与对账审计',
        description: '设立连续 90 天现金流台账，按实付金额记账，绝不用折算折扣代替当期现金流。',
        action: '季度末复盘实际总支出，确认未产生隐性扣款或自动续订'
      }
    ],
    workedExample: (t: string, p: number, gb: number, m: string) => 
`针对《${t}》的财务现金流进行实际对账演算：
1. 结算出账：套餐票面价 ¥${p} 元，第三方支付网关加收 ¥1.5 元处理费，首月实际划扣 **¥${(p + 1.5).toFixed(1)} 元**；
2. 资金沉没对比：若用户受宣传误导，一次性购买了标价 ¥${p * 10} 元的年付套餐。在第 3 个月平台因机房被查封停网时，月付用户累计损失仅为 3 × ${(p + 1.5).toFixed(1)} = **¥${((p + 1.5) * 3).toFixed(1)} 元**；
3. 而年付用户直接产生不可逆本金损失 ${p * 10} - ${((p + 1.5) * 3).toFixed(1)} = **¥${(p * 10 - (p + 1.5) * 3).toFixed(1)} 元**！量化数据证明，维持短期小额决策能为用户阻断绝大部分不可控违约风险。`,
    boundaryRule: (t: string) => 
      `现金风控红线：单次交易掏出的净现金支出严禁超过月度通信娱乐可支配闲置资金的 30%；遇到要求“最低充值金额大于当前套餐售价 1.5 倍”的平台，一律视为高危资金质押，拒绝充值。`
  },

  // 视角 1: 物理网络性能与晚高峰链路质量
  {
    tag: '物理网络性能与晚高峰抗拥塞',
    verdictGen: (t: string, c: string, p: number, gb: number, m: string) => 
      `针对“${t}”，核心结论是：<strong>绝不要在白天或凌晨测速截图里找确定性，必须在晚高峰（20:30～22:30）实测长连接丢包与单线程吞吐</strong>。只要晚高峰丢包超过 2% 或出现持续 TCP 队头阻塞，标称再大的 1000M 带宽也无法支撑 4K 秒开与跨国实时通讯。`,
    angleIntro: (t: string, c: string) => 
      `从**晚高峰 20:00~23:00 真实网络吞吐与抗拥塞**切入，在《${c}》的实际环境中，白天的空载跑分与单次测速均缺乏参考价值，必须紧盯骨干网国际出口拥塞与持续长连接丢包率。`,
    tableTitle: (t: string) => `针对《${t}》的晚高峰网络链路与物理吞吐审计表`,
    tableHeaders: ['链路技术指标', '物理工程定义', '行业常见宣传表象', '晚高峰拥塞真实影响', '实机测量方法', '合格基准线'],
    tableRows: (p: number, gb: number, m: string) => [
      ['晚高峰持续丢包率', '晚 20~23 点数据包丢失比例', '刻意隐瞒晚高峰拥塞卡顿', '丢包超 5% 导致网页无法加载与断流', '持续向网关发送 100 次 ICMP/TCP 探测', '丢包率 < 2% 为核心合格线'],
      ['真实物理吞吐量', '按专线倍率折减后的真实 GB', '标榜海量配额甚至不限量', '高倍率专线导致额度迅速清零', '用标称额度除以主力专线倍率', `实际可用 ${(gb / parseFloat(m)).toFixed(1)} GB`],
      ['单线程持续传输速率', '单一长连接的抗抖动吞吐', '拿多线程瞬间跑分忽悠用户', '决定 4K 视频是否秒开与缓冲', '使用单线程拉取大体积真实数据流', '持续速率 > 25 Mbps'],
      ['链路往返延迟抖动', '连续数据包往返时间标准差', '只宣传极限直连几毫秒最低值', '抖动过大导致即时通讯音视频卡顿', '统计连续 50 次握手延迟离散程度', '延迟标准差抖动 < 15ms']
    ],
    workflowSteps: (t: string, c: string, p: number, gb: number, m: string): WorkflowStepItem[] => [
      {
        name: '执行晚高峰 (20:30~22:30) 真实网络压力采样',
        description: '避开白天闲时，在晚高峰黄金拥塞时段发起连续 100 次长连接探测，记录平均丢包率 (Packet Loss) 与延迟抖动 (Jitter)。',
        action: '若丢包率大于 3%，连续 2 天复测，确认为骨干拥塞后立即转备用节点'
      },
      {
        name: '物理有效额度与真实单价校准',
        description: `标称流量 (${gb}GB) 除以主力专线倍率 (${m}x)，得出真实物理可用配额仅为 ${(gb / parseFloat(m)).toFixed(1)} GB。`,
        action: `计算每 GB 真实物理成本：¥${p} / ${(gb / parseFloat(m)).toFixed(1)}GB = ¥${(p / (gb / parseFloat(m))).toFixed(3)}/GB`
      },
      {
        name: '单线程 4K 视频缓冲压力验收',
        description: '使用单线程模式拉取流媒体视频流，观察播放器缓冲区能否在 5 秒内积攒 30 秒以上冗余。',
        action: '缓冲区持续低于 5 秒说明链路存在隐性限速，不适合作为主用生产力工具'
      }
    ],
    workedExample: (t: string, p: number, gb: number, m: string) => 
`针对《${t}》的物理网络性能进行实测演算：
1. 真实倍率穿透：经查该方案核心专线倍率统一设置为 **${m}x**；
2. 实际物理传输能力核算：月度真实物理传输上限仅为 ${gb} / ${m} = **${(gb / parseFloat(m)).toFixed(1)} GB**；
3. 晚高峰压测：在晚 21:00 发起 100 次长连接探测，丢包率测试为 1.2%，平均延迟 42ms，单线程持续推流达到 25Mbps；
4. 综合结论：虽然额度因倍率缩水，但晚高峰可用率极佳，折算后每 GB 物理数据成本为 **¥${(p / (gb / parseFloat(m))).toFixed(3)} 元**，对于重视稳定性的用户而言具备极高采购价值。`,
    boundaryRule: (t: string) => 
      `网络技术准则：凡是晚高峰丢包率超过 8% 且持续 3 天未恢复的方案，不论标称价格多便宜，一律判定为不合格生产力工具；大流量任务必须以“标称流量除以专线倍率”作为唯一有效容量指标。`
  },

  // 视角 2: 软硬件生态与规则分流配置
  {
    tag: '客户端软硬件生态与分流规则',
    verdictGen: (t: string, c: string, p: number, gb: number, m: string) => 
      `针对“${t}”，核心结论是：<strong>自备客户端的授权买断费用属于终身数字资产，严禁摊入日常月费中稀释单价</strong>。自建精准的分流规则集（Direct 直连与 Proxy 代理分离），避免国内软件后台自动更新与网盘同步走代理，把宝贵的高速专线额度全量留给核心任务。`,
    angleIntro: (t: string, c: string) => 
      `从**客户端软硬件生态与规则分流效率**切入，在《${c}》的落地配置中，必须根据自备设备操作系统（iOS/Android/Windows/Mac）配置精确的 Direct 直连规则，杜绝国内大流量误走代理造成的额度浪费。`,
    tableTitle: (t: string) => `针对《${t}》的客户端环境适配与分流防耗对照表`,
    tableHeaders: ['终端操作系统', '推荐适配客户端', '授权成本属性', '分流核心特性', '防跑漏优化手段', '配置建议'],
    tableRows: (p: number, gb: number, m: string) => [
      ['iOS (移动端)', 'Shadowrocket / Stash', '外区 App Store 买断 ($2.99~$3.99)', '支持远程订阅与规则集覆写', '将国内应用商店更新分流至 Direct', '首月固定自备资产，不计入续费'],
      ['Android (移动端)', 'Clash Meta for Android', 'GitHub 开源免费 (¥0)', '多核心支持与进程分流', '关闭自动云同步全局代理', '零额外软件采购成本'],
      ['Windows (PC 桌面)', 'Clash Verge Rev', '开源免费 (¥0)', 'Mihomo 内核与 WebUI 面板', '设置百度网盘与 Steam 走直连', '首选稳定开源现代分支'],
      ['macOS (苹果电脑)', 'Clash Verge / Surge Mac', '开源免费或独立高级商业授权', '系统代理与增强模式透明分流', '配置 Fake-IP 避免 DNS 劫持', '根据专业抓包需求选择工具']
    ],
    workflowSteps: (t: string, c: string, p: number, gb: number, m: string): WorkflowStepItem[] => [
      {
        name: '清点设备操作系统矩阵与自备工具',
        description: '确认手机、平板与电脑的操作系统版本与开源工具支持；若使用 iOS 设备，确认是否已自备美区 Apple ID 并买断对应 App。',
        action: '切勿通过机场提供的共享 Apple ID 下载闭源定制客户端，防范账号被锁风险'
      },
      {
        name: '验证自备客户端对目标订阅协议的解析能力',
        description: '导入测试订阅链接，核查 Shadowsocks/Vmess/Trojan 节点是否完整下发，验证分流规则集 (Direct 与 Proxy 分流)。',
        action: '检查分流规则，确保微信、百度网盘、Steam 等大流量服务走 Direct 直连'
      },
      {
        name: '配置多设备并发保活与防踢线策略',
        description: `核实账号允许的同时在线设备数 (通常 ≥ 2 台)，合理分配手机与电脑的同时连接会话。`,
        action: '在路由器或客户端内设置会话保持，避免多端并发被服务商风控系统自动拉黑'
      }
    ],
    workedExample: (t: string, p: number, gb: number, m: string) => 
`针对《${t}》的软硬件配置进行成本与分流优化演算：
1. 软件端支出精算：Windows 下载开源免费的 Clash Verge Rev（支出 ¥0 元）；iPhone 需在美区 App Store 独立购买 Shadowrocket（支出 $2.99 约合人民币 ¥22 元）；
2. 服务端支出：选购月付 ¥${p} 元入门基础套餐；
3. 首月合并支出：¥22 + ¥${p} = **¥${p + 22} 元**。其中 ¥22 元为终身数字资产买断，次月续费支出仅需纯粹的 **¥${p} 元**；
4. 规则优化成效：通过在客户端中配置国内应用直连规则，次月原本计划消耗的 ${gb}GB 流量被成功节约了 35%，实现了工具与资费的最佳协同。`,
    boundaryRule: (t: string) => 
      `客户端生态准则：第三方商业客户端授权买断费应严格单独立项，严禁摊入日常月费；任何需要强制用户安装未经开源代码审计的专有闭源安装包的平台，在安全审计中一票否决。`
  },

  // 视角 3: 契约生命周期与争议退款退出
  {
    tag: '契约生命周期与争议退款退出',
    verdictGen: (t: string, c: string, p: number, gb: number, m: string) => 
      `针对“${t}”，核心结论是：<strong>虚拟代理服务不具备长期资产保值属性，任何中途退款几乎都会按月付原价扣除残值并加收手续费</strong>。在完成连续 3 个完整账单周期的稳定性验证前，绝不盲目跳入年付长周期，做好随时以零迁移成本切换备用节点的方案。`,
    angleIntro: (t: string, c: string) => 
      `从**服务生命周期退出与争议折旧维权**切入，在《${c}》的履约周期中，必须提前理清服务协议 (ToS) 中的退款门槛与换站迁移成本，避免在遭遇重大网络故障时陷入本金沉没的被动境地。`,
    tableTitle: (t: string) => `针对《${t}》的服务生命周期与退款维权核验表`,
    tableHeaders: ['契约生命周期阶段', '合规达标标准', '常见霸王条款陷阱', '潜在权益受损表现', '核验与维权方法', '风控对策'],
    tableRows: (p: number, gb: number, m: string) => [
      ['付款前协议审查', '退款条款清晰透明，允许折旧退还', '声明“虚拟商品一经售出绝不退款”', '发现故障无法拿回一分钱', '通读产品 ToS Refund 争议章节', '无退款通道方案严禁预付'],
      ['交付首日即时核验', '导入订阅 1 小时内全量节点可用', '节点大面积超时且无替代专线', '严重交付违约，业务受阻', '导出带时间戳的测速与丢包日志', '24 小时内启动正式工单退款'],
      ['周期中途换站迁移', '提供平稳过渡期，按天折算残值', '中途退出扣除全款或注销账号', '资金完全沉没于老平台', '计算双重订阅重叠 3~5 天费用', '新服务达标后再停用老服务'],
      ['老用户续费锁定', '维持首期相同的原价续费权益', '首期特价到期后续费无预警翻倍', '次年账单突然翻倍造成超支', '核查后台下期账单应付金额', '涨价幅度超 20% 坚决换站']
    ],
    workflowSteps: (t: string, c: string, p: number, gb: number, m: string): WorkflowStepItem[] => [
      {
        name: '设立服务到期与状态监测预警',
        description: '记录当期服务到期前 7 天日历提醒，检查下期续费账单是否暗中涨价，核实是否已关闭未经授权的免密自动扣款。',
        action: '在第三方支付应用中主动解约代扣协议，拒绝一切静默续订'
      },
      {
        name: '执行换站迁移双重订阅无缝交接',
        description: '在新旧两家服务重叠的 3~5 天内，将新订阅作为备份节点并行接入；晚高峰测试新服务完全达标后，停止对旧服务续费。',
        action: '双重订阅成本通常控制在 ¥10 以内，属于极高性价比的容灾保费'
      },
      {
        name: '启动争议抗辩与证据保全流',
        description: '若遇服务商单方面失联或大面积故障，调取带时间戳的节点超时截图与支付流水号，向支付网关发起交易不符申诉。',
        action: '保全工单往来记录与官方群公告截图作为第三方申诉依据'
      }
    ],
    workedExample: (t: string, p: number, gb: number, m: string) => 
`针对《${t}》的退出与维权进行实操演算：
1. 残值与损失测算：某半年付套餐总金额 ¥${p * 5} 元（总周期 180 天），在第 90 天时平台核心专线被拔线且不予修复，剩余未消费残值折算为 (¥${p * 5} / 180) × 90 = **¥${((p * 5) / 2).toFixed(1)} 元**；
2. 退出行动执行：
   - 提取过去 48 小时全部节点超时的 Ping 测试日志并截屏保全；
   - 在平台工单系统提交正式退款申请，要求退还剩余残值；
   - 无论客服是否同意，立即在微信/支付宝中解约该平台的自动扣款授权，并花费 ¥${p} 元在主站推荐榜单中平稳采购新的真月付备用方案；
3. 维权收益：通过果断启动退出流程，用户保全了后续数月的核心网络通信，避免了在失效服务上耗费更多精力。`,
    boundaryRule: (t: string) => 
      `退出保障准则：若平台在发生持续 48 小时以上全网断流时拒绝提供补时或退还残值，用户应立即停止任何后续充值并向收单网关发起交易不符投诉；换站迁移重叠冗余成本不得超过单月套餐的 50%。`
  },

  // 视角 4: 30天滚动与自然月日历时间漂移
  {
    tag: '30天滚动与自然月日历时间漂移',
    verdictGen: (t: string, c: string, p: number, gb: number, m: string) => 
      `针对“${t}”，核心结论是：<strong>流量预算超支多半发生在后半月，避免月初因‘流量焦虑’超额购买大套餐</strong>。以基准用量包打底，结合月中实际消耗率选择弹性加油包或按需平滑升档，能为个人或小团队挤出至少 30%～40% 的沉没结余。`,
    angleIntro: (t: string, c: string) => 
      `从**公历自然月与 30 天严格计时的时间剪刀差**切入，在《${c}》的账期循环中，必须防范付款日逐月提前带来的隐性年化超支，合理利用节假日断档反向抹平计费天数损耗。`,
    tableTitle: (t: string) => `针对《${t}》的 30 天与自然月计费模式对照表`,
    tableHeaders: ['对比维度', '按自然月计费 (Calendar Month)', '按 30 天计费 (30-Day Cycle)', '全年财务差额', '额度清零机制', '用户对账指引'],
    tableRows: (p: number, gb: number, m: string) => [
      ['全年扣费次数', '严格 12 次 (每月固定出账)', '12.167 次 (全年多付 5.25 天)', `年化多支出约 ¥${(p * 0.5).toFixed(1)} 元`, '月底 23:59 清零', '核对后台 Next Due Date 是否每月提前'],
      ['账单日平移规律', '固定每月同日 (如每月 10 号)', '付款日每月向前平移 1~2 天', '现金流计划易与发薪日错位', '按周期清零', '设置日历提前提醒防止被动停机'],
      ['大月天数损耗', '31 天大月享受完整天数', '大月第 31 天计入下一个周期', '相当于每年 7 个大月被各蚕食 1 天', '严格按 720 小时清零', '避免在月底最后一天首购'],
      ['二月特殊情况', '平年 28 天仍收全月资费', '二月依然享受满 30 天服务', '二月份稍微挽回部分差额', '无特殊清零例外', '综合全年考量两相抵消']
    ],
    workflowSteps: (t: string, c: string, p: number, gb: number, m: string): WorkflowStepItem[] => [
      {
        name: '查验后台账单到期时间戳与清零规则',
        description: '记录初始激活时间，查看下期到期日是按自然月同日顺延，还是严格按 720 小时（30天）向前递减。',
        action: '若为 30 天制，在个人日历中将账单日标记为浮动递减状态'
      },
      {
        name: '核算全年真实扣费频次与差额',
        description: `按 30 天制测算：年化总支出 = 月费 ¥${p} × (365 / 30) = ¥${(p * 12.1667).toFixed(1)} 元，年化多支出 ¥${(p * 12.1667 - p * 12).toFixed(1)} 元。`,
        action: '把多出的 0.167 个周期资费提前列入年度通信意外备用金'
      },
      {
        name: '制定利用天数漂移反向节流策略',
        description: '在长假或外出闲置时主动断档 3~5 天不续费，重新购买时自然对齐至新周期，反向抹平日历剪刀差。',
        action: '每年利用长假断档 1~2 次，即可完全冲销 30 天制带来的时间损耗'
      }
    ],
    workedExample: (t: string, p: number, gb: number, m: string) => 
`针对《${t}》的时间周期损耗进行实际演算：
1. 自然月对日计费模式：全年出账 12 次，实付法币为 12 × ¥${p} = **¥${p * 12} 元**；
2. 30 天滚动计费模式：全年产生 12.1667 次扣费，实付法币达到 **¥${(p * 12.1667).toFixed(1)} 元**；
3. 时间漂移影响：按 30 天滚动的用户在第 12 个月尚未过完时（第 360 天），就收到了第 13 期的续费催缴通知。通过日历对齐，用户看清了这看似不起眼的 ¥${(p * 12.1667 - p * 12).toFixed(1)} 元年化差额来源。`,
    boundaryRule: (t: string) => 
      `周期计费准则：在两款方案标价完全相同时，优先选择按自然月对日计费的服务；对于按 30 天计时的套餐，必须将年化成本乘上 1.014 的时间校正系数。`
  },

  // 视角 5: 专线倍率折减与真实物理有效容量
  {
    tag: '专线倍率折减与真实物理有效容量',
    verdictGen: (t: string, c: string, p: number, gb: number, m: string) => 
      `针对“${t}”，核心结论是：<strong>警惕标称 ${gb}GB 但主力节点全为 ${m}x 倍率的数字游戏，真实物理容量会被等比稀释</strong>。用标称额度除以主力专线倍率还原真实物理 GB，再倒推每 GB 真实单价，才能真正看懂哪款套餐才是最具性价比的选项。`,
    angleIntro: (t: string, c: string) => 
      `从**主力专线倍率折减与真实物理有效容量**切入，在《${c}》的流量测算中，绝不能轻信虚标的大流量包，必须用标称配额除以实际倍率，还原面向核心任务的真实物理 GB 单价。`,
    tableTitle: (t: string) => `针对《${t}》的节点倍率与实际物理可用容量折算表`,
    tableHeaders: ['节点类别与线路属性', '标称计费倍率', '标称 1000GB 套餐实际物理额度', '单任务 (20GB) 实际扣除', '每 GB 真实物理单价 (按月费 ¥20)', '适用任务场景'],
    tableRows: (p: number, gb: number, m: string) => [
      ['普通公网中继/直连', '0.5x ~ 1.0x', '1000 GB ~ 2000 GB (充沛)', '仅扣除 10 GB ~ 20 GB 额度', '¥0.01 ~ ¥0.02 / GB', '大文件离线下载 / 系统补丁更新'],
      ['优质多线 BGP 专线', '1.5x ~ 2.0x', '500 GB ~ 666 GB (适度缩水)', '扣除 30 GB ~ 40 GB 额度', '¥0.03 ~ ¥0.04 / GB', '晚高峰流媒体 1080P / 即时通讯'],
      ['顶级 IPLC 内网专线', '2.5x ~ 3.5x', '285 GB ~ 400 GB (严重缩水)', '扣除 50 GB ~ 70 GB 额度', '¥0.05 ~ ¥0.07 / GB', '跨国商务会议 / 股票交易 / 极低延迟需求'],
      ['定制流媒体解锁专线', '4.0x ~ 5.0x', '200 GB ~ 250 GB (极度昂贵)', '扣除 80 GB ~ 100 GB (迅速耗尽)', '¥0.08 ~ ¥0.10 / GB', '仅适合小流量解锁特殊版权地区']
    ],
    workflowSteps: (t: string, c: string, p: number, gb: number, m: string): WorkflowStepItem[] => [
      {
        name: '提取目标套餐各节点梯度的真实倍率矩阵',
        description: `记录日常直连节点倍率 (如 0.5x~1.0x)，重点审查晚高峰主力 BGP/IPLC 专线倍率 (${m}x)。`,
        action: '若主力晚高峰专线倍率超过 2.0x，必须提前对标称配额做折半预估'
      },
      {
        name: '计算面向核心任务的真实可用物理容量',
        description: `真实可用容量 = 标称总流量 (${gb}GB) / 专线倍率 (${m}x) = ${(gb / parseFloat(m)).toFixed(1)} GB。`,
        action: `每部 4K 视频按 20GB 计算，在 ${m}x 倍率下实际扣除 ${(20 * parseFloat(m)).toFixed(1)} GB 配额`
      },
      {
        name: '倒推每 GB 真实物理单价并做横向对标',
        description: `真实物理单价 = 月费 ¥${p} / ${(gb / parseFloat(m)).toFixed(1)}GB = ¥${(p / (gb / parseFloat(m))).toFixed(3)}/GB。`,
        action: '若真实单价超过 ¥0.15/GB，考虑改选以低倍率普通专线为主的稳健服务商'
      }
    ],
    workedExample: (t: string, p: number, gb: number, m: string) => 
`针对《${t}》的倍率损耗进行实际演算：
1. 表面估算：用户每月剪辑需要传输 ${(gb * 0.7).toFixed(0)}GB 视频，以为标称 ${gb}GB 绰绰有余；
2. 倍率刺客曝光：该套餐的香港高速专线倍率为 **${m}x**；
3. 真实物理吞吐量：${gb} / ${m} = **${(gb / parseFloat(m)).toFixed(1)} GB**！
4. 真实结果：该套餐实际可供传输的物理数据远低于用户的 ${(gb * 0.7).toFixed(0)}GB 需求。通过倍率折算，用户在付款前及时规避了月中因断流被迫加购昂贵补充包的风险。`,
    boundaryRule: (t: string) => 
      `倍率核算法则：任何未在购买前明确公示主力专线倍率的套餐均视为高危套路产品；选购大流量套餐时，必须以“标称流量除以主力专线倍率”作为唯一有效容量指标。`
  },

  // 视角 6: 优惠码时效与首单一次性折扣核销
  {
    tag: '优惠码时效与首单一次性折扣核销',
    verdictGen: (t: string, c: string, p: number, gb: number, m: string) => 
      `针对“${t}”，核心结论是：<strong>首单新客大额折扣往往绑定了到期自动按原价续费的协议陷阱</strong>。扫码结账前务必核查优惠代码的生效周期是一次性还是永久有效，并在支付网关主动关闭循环扣款授权，牢牢掌握下一期的去留主动权。`,
    angleIntro: (t: string, c: string) => 
      `从**优惠代码循环属性 (Recurring vs One-off) 与次期续费阶梯**切入，在《${c}》的结算核销中，必须在收银台看清折扣生效周期，并在支付平台主动关闭自动代扣授权，掌握账单主动权。`,
    tableTitle: (t: string) => `针对《${t}》的折扣码属性与次期续费价格审计表`,
    tableHeaders: ['优惠代码类型', '计算公式口径', '典型适用场景', '次期续费规则', '账面水分与陷阱', '风控级别'],
    tableRows: (p: number, gb: number, m: string) => [
      ['比例循环折扣 (Recurring)', 'Pay = Price × Rate', '长期老用户优惠', '次期维持相同折扣价', '折扣力度通常较小 (85~9折)', '低 (财务可预测)'],
      ['首期一次性打折 (One-off)', 'Pay1 = Price × Rate, Pay2 = Price', '拉新促销 / 节日活动', '次期强制恢复原价', '次月账单突然翻倍造成超支', '高 (易引发纠纷)'],
      ['满减固定券 (Fixed)', 'Pay = max(0, Price - Coupon)', '满额促销 (如满百减)', '通常仅限当次订单有效', '凑单门槛迫使用户选更高档', '中 (警惕凑单浪费)'],
      ['赠送时长权益 (+Month)', 'Effective = Price / (12 + Bonus)', '长周期买一年送 N 月', '中途退款赠送月份价值归零', '只有用满全周期才有实际收益', '中 (依赖服务存续)']
    ],
    workflowSteps: (t: string, c: string, p: number, gb: number, m: string): WorkflowStepItem[] => [
      {
        name: '核实优惠代码的续费属性 (Recurring vs One-time)',
        description: '在结账收银台输入代码，观察折扣明细是否明确标注“循环生效”还是“首期专享”。',
        action: '若为首期一次性优惠，次期预算必须按无折扣全额原价独立入账'
      },
      {
        name: '执行叠加次序与支付手续费精准演算',
        description: '标准扣减次序：先扣减固定代金券，再按比例折扣打折，最后加上支付网关固定处理费。',
        action: `实付 = max(0, 票面价 - 代金券) × 比例折扣 + 网关费用，核对无误后再扫码付款`
      },
      {
        name: '计算真实跨期年化平摊成本',
        description: '两期年均成本 = (首期折后实付 + 次期原价实付) / 2，理性剔除侥幸心理。',
        action: '若两期均价超过同类竞品常规价格，说明优惠码仅为诱导拉新手段'
      }
    ],
    workedExample: (t: string, p: number, gb: number, m: string) => 
`针对《${t}》的折扣核销进行实际演算：
1. 结算叠加演算：套餐原价 ¥${p * 10} 元/年，平台提供“立减 20 元”代金券与“首期 85 折”代码；
2. 基础标价扣减：¥${p * 10} - 20 = ¥${p * 10 - 20} 元，叠加 85 折后实付 (¥${p * 10 - 20}) × 0.85 = **¥${((p * 10 - 20) * 0.85).toFixed(1)} 元**；
3. 续费核实：由于该代码为首期专属，第二年续费恢复为原价 ¥${p * 10} 元；
4. 两期年均真实支出实为 (¥${((p * 10 - 20) * 0.85).toFixed(1)} + ¥${p * 10}) / 2 = **¥${((((p * 10 - 20) * 0.85) + p * 10) / 2).toFixed(1)} 元/年**，理性消除了“以后每年都只要八十几元”的错误幻想。`,
    boundaryRule: (t: string) => 
      `折扣核销定理：凡是要求“升级至更高两档套餐才能满足优惠券满减门槛”的活动，若额外掏出的现金超过优惠面额，严禁参与凑单；一次性首单优惠不得作为长周期预算基准。`
  },

  // 视角 7: 本地 DNS 防投毒与 Fake-IP 拓扑
  {
    tag: '本地 DNS 防投毒与 Fake-IP 拓扑',
    verdictGen: (t: string, c: string, p: number, gb: number, m: string) => 
      `针对“${t}”，核心结论是：<strong>算清账目更要守住安全底线，开启 Fake-IP 模式并做本地 DNS 分流是必不可少的防御手段</strong>。杜绝远端 DNS 污染与递归解析延迟，同时避免敏感域名的查询请求裸奔泄漏给本地网络运营商或公司内网审计。`,
    angleIntro: (t: string, c: string) => 
      `从**本地 DNS 防投毒与 Fake-IP 拓扑架构**切入，在《${c}》的通信链路中，必须开启 Fake-IP 模式并做本地 DNS 分流，彻底消除运营商劫持与远程解析延迟，守住稳定与隐私底线。`,
    tableTitle: (t: string) => `针对《${t}》的本地 DNS 解析模式与分流泄露防范表`,
    tableHeaders: ['DNS 解析模式', '工作运行原理', '抗运营商投毒能力', '首次查询延迟', '防泄漏安全表现', '配置与适用建议'],
    tableRows: (p: number, gb: number, m: string) => [
      ['传统本地明文 DNS (53端口)', '向运营商 Local DNS 发起 UDP 请求', '零抗污染能力 (必遭投毒)', '极低 (< 10ms)', '严重泄露，明文可被嗅探', '仅适合解析国内直连域名'],
      ['Fake-IP 智能映射模式', '客户端直接返回虚拟保留 IP 段 (198.18.x)', '极佳 (完全绕过本地解析)', '零延迟 (0ms 瞬时握手)', '零泄漏，由远端服务器代解', '现代 Clash/Surge 客户端首选模式'],
      ['加密 DNS (DoH / DoT)', '基于 TLS/HTTPS 443 加密传输', '极佳 (运营商无法篡改响应)', '稍高 (需先完成 TLS 握手)', '优异，防止运营商劫持', '适合作为客户端 Fallback 兜底 DNS'],
      ['远端代解 (Remote Proxy DNS)', '将域名直接封装在协议包由节点解析', '最高 (与目标服务器同源)', '取决于节点往返延迟', '完全杜绝本地 DNS 污染', '针对被污染阻断的境外网站强制开启']
    ],
    workflowSteps: (t: string, c: string, p: number, gb: number, m: string): WorkflowStepItem[] => [
      {
        name: '排查本地 DNS 泄漏与污染状态',
        description: '连接代理后，访问在线 DNS 泄漏测试工具，观察探测到的 DNS 服务器是否包含本地国内运营商 IP。',
        action: '若显示为国内运营商 IP，判定存在 DNS 泄漏风险，境外域名随时可能被劫持'
      },
      {
        name: '配置客户端 Fake-IP 与透明代解机制',
        description: '在客户端配置中将 enhanced-mode 设为 fake-ip，将境外域名解析彻底剥离出本地环境。',
        action: '国内域名保留本地 Direct 直连解析，确保爱奇艺等流媒体 CDN 就近接入'
      },
      {
        name: '刷新本地网络缓存并验证连通率',
        description: '在终端执行 ipconfig /flushdns，重新测试跨国目标域名的握手耗时与丢包率。',
        action: '验证海外域名实现 0ms 本地瞬时响应，解析成功率达到 100%'
      }
    ],
    workedExample: (t: string, p: number, gb: number, m: string) => 
`针对《${t}》的本地 DNS 拓扑进行实操演算：
1. 抓包排查：发现该用户的客户端使用了传统的本地直连解析，向本地运营商 DNS 查询境外服务器，收到了被污染的伪造 IP（127.0.0.1）；
2. 拓扑优化：用户在客户端开启 **Fake-IP 模式**，并将境外分流规则强制绑定至远端节点代解；
3. 成果检验：DNS 响应延迟从原本的 120ms 下降至 **0ms 瞬时返回**，境外网站连接成功率从 55% 飙升至 **100%**，零成本解决了被运营商劫持的隐性网络故障。`,
    boundaryRule: (t: string) => 
      `本地网络准则：严禁在未开启防污染 Fake-IP 或远程代解的环境下运行核心业务；任何将国内全部流量无脑走代理导致 DNS 错乱的配置，均属于严重不合规网络拓扑。`
  }
];

export function enhanceSpecWithTitleContext(
  baseSpec: DomainSpec,
  art: { title: string; url: string; clusterId: string },
  clusterTitle: string,
  articleIndexInCluster: number = 0
): DomainSpec {
  const t = art.title;
  const seed = hashSeed(t);
  
  // 综合集群哈希与文章内序号，实现 8 大视角平滑均匀的伪随机分布
  const clusterSeed = hashSeed(art.clusterId);
  const articleSeed = hashSeed(t);
  const perspectiveIdx = (clusterSeed + articleIndexInCluster * 3 + (articleSeed % 7)) % 8;
  const config = perspectiveConfigs[perspectiveIdx];

  const p = 14 + (seed % 16); // ¥14 ~ ¥29
  const gb = 60 + ((seed % 8) * 30); // 60GB ~ 270GB
  const multiplier = (1.5 + ((seed % 4) * 0.5)).toFixed(1); // 1.5x ~ 3.0x

  // 1. 生成结合具体标题、集群与视角的 AnswerFirst 核心结论
  const answerFirst = config.verdictGen(t, clusterTitle, p, gb, multiplier);

  // 2. 深度结合多态切入句与 baseSpec 的领域概念，彻底消除同构机械模板句
  const angleIntro = config.angleIntro(t, clusterTitle);
  const introPatterns = [
    `在评估“${t}”时，核心在于对照《${clusterTitle}》下的真实网络工程边界与支付履约事实。`,
    `围绕“${t}”展开决策，首要依据是《${clusterTitle}》所圈定的网络交付条件与预算约束。`,
    `落地“${t}”的执行方案，必须回归《${clusterTitle}》的实际承载能力与日常摩擦成本。`,
    `分析“${t}”的投入产出比，关键在于辨析《${clusterTitle}》中的参数真实性与隐性开销。`,
    `落实“${t}”的选型动作，需以《${clusterTitle}》的底层运行环境为硬性基准。`,
    `针对“${t}”的场景推演，务必建立在《${clusterTitle}》的合规资费与可用性基础之上。`
  ];
  const selectedIntro = introPatterns[seed % introPatterns.length];
  const concept = `${selectedIntro}\n\n${angleIntro}\n\n${baseSpec.concept}`;

  // 3. 采用该序号对应的专属视角表格
  const tableTitle = config.tableTitle(t);
  const tableHeaders = config.tableHeaders;
  const tableRows = config.tableRows(p, gb, multiplier);

  // 4. 采用该序号对应的专属推导工作流
  const workflowSteps = config.workflowSteps(t, clusterTitle, p, gb, multiplier);

  // 5. 采用该序号对应的专属算例与边界准则
  const workedExample = config.workedExample(t, p, gb, multiplier);
  const boundaryRule = config.boundaryRule(t);

  // 6. 为 baseSpec 的反例注入风控评级与避坑对策，并打乱
  const enrichedPitfalls: PitfallItem[] = baseSpec.pitfalls.map((item, idx) => ({
    title: item.title,
    desc: item.desc,
    level: idx === 0 ? '高危' : (idx === 1 ? '中危' : '常踩'),
    action: item.action || '坚持以单月低首付验证 2~3 个周期，跨越高峰期稳定可用后再考虑长期续费。'
  }));

  const shuffledPitfalls = [...enrichedPitfalls].sort((a, b) => {
    return (hashSeed(a.title + t) % 10) - (hashSeed(b.title + t) % 10);
  });

  const shuffledFaqs = [...baseSpec.faqs].sort((a, b) => {
    return (hashSeed(a.q + t) % 10) - (hashSeed(b.q + t) % 10);
  });

  return {
    ...baseSpec,
    answerFirst,
    concept,
    tableTitle,
    tableHeaders,
    tableRows,
    workflowSteps,
    workedExample,
    boundaryRule,
    pitfalls: shuffledPitfalls,
    faqs: shuffledFaqs
  };
}
