-- 工作烦恼初始数据 V2 - 为Apple MDE工程师定制
-- 创建日期：2025-12-29
-- 包含6个场景，每个场景12条话术（4种类型×3条）

-- ========================================
-- 插入工作场景（6个）
-- ========================================

INSERT INTO work_scenarios (category, name, icon, description, display_order, is_active) VALUES
('motivation', '不想上班', '😮‍💨', '早上起来就不想去公司，感觉完全提不起劲', 1, true),
('motivation', '工作没意义', '🌫️', '感觉做的事情没有价值，看不到自己在做什么', 2, true),
('criticism', '犯了错误', '😔', '制程/测试出问题了，担心被责怪或影响评价', 3, true),
('workload', '任务太多压力大', '😰', '多线并行，到处都在催，完全不知道怎么排优先级', 4, true),
('conflict', '同事关系紧张', '😣', '跨团队扯皮、甩锅，感觉被针对或不被尊重', 5, true),
('pressure', '不想开会/社交', '😶', '又要开会/social了，完全不想去，只想一个人做事', 6, true);

-- ========================================
-- 场景1：不想上班
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '不想上班是完全正常的感受。你不需要每天都斗志满满，你也不欠公司一个"永远有动力"的自己。你的疲惫和抗拒是真实的，值得被看见。', 1, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你习惯一个人扛很多事，但这不代表你不会累。感到"不想"不是软弱，而是你的身体在告诉你：我需要喘口气了。这个信号很重要，听听它。', 2, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '工作不是你存在的全部意义。如果今天只是"出现"而不是"表现"，那也完全OK。你有权利保留一部分能量给自己，而不是全部燃烧在工作上。', 3, true
FROM work_scenarios WHERE name = '不想上班';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '试试"最小完成单位"：今天只完成1个最关键的deliverable就算赢。其他的都是bonus。

跟自己说："I''ll just show up and see what happens. No pressure to overperform today."

降低内耗，保护能量。', 1, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果实在撑不住，可以调整当天节奏：
• 上午处理简单的email/routine task
• 避开复杂问题和会议
• WFH if possible，减少社交消耗

告诉自己："Today I''m in maintenance mode, not delivery mode."', 2, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '设置"safe zone"：
• Headphones on = 不要打扰我
• 找个安静corner focus
• Block calendar for "deep work"

保护你的边界，控制自己的节奏。这是你的权利，不是奢侈品。', 3, true
FROM work_scenarios WHERE name = '不想上班';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果状态真的不好，可以跟manager说：

"I''m not feeling 100% today. I''ll focus on [critical task] first and keep you posted on bandwidth for other items."

诚实但不过度解释，给自己留出空间。', 1, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果有人催你不紧急的事：

"Got it. Currently prioritizing [X]. Can we revisit this [timeframe]?"

温和但坚定地守住边界，不是拒绝而是排序。', 2, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己说：

"我今天只需要出现，不需要证明什么。完成基本职责就够了。我不欠任何人一个超人版本的我。"

降低自我要求，减少心理负担。', 3, true
FROM work_scenarios WHERE name = '不想上班';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你今天还是来了，这本身就很了不起。不是所有人都能在不想的时候还保持责任感。你比自己想象的要坚韧。', 1, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '记住：你的价值不等于你的产出。工作只是你生活的一部分，不是你存在的证明。如果今天做得少一点，你依然是个完整的、值得被爱的人。', 2, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '这种感觉会过去的。也许是今天下午，也许是明天，但它不会永远这样。坚持一小步就好，不需要一口气跑完马拉松。你可以的。', 3, true
FROM work_scenarios WHERE name = '不想上班';

-- ========================================
-- 场景2：工作没意义
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '感觉工作没意义，不是你的问题，而是你在思考和成长。能够质疑"为什么要做这个"本身就说明你不是一个只会执行的机器，你在寻找属于自己的价值锚点。', 1, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你习惯先保证自我完整，再考虑其他。所以当工作让你感觉"在消耗我但没给我成长"时，这种空虚感会特别强烈。这是你的内在保护机制，不是你太挑剔。', 2, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '意义不一定要宏大。养活自己、维持独立、不被工作压垮、保留自我空间——这些本身就很有价值。你不需要"改变世界"才算有意义。', 3, true
FROM work_scenarios WHERE name = '工作没意义';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '重新定义"有意义"：
• 不是"这个project会改变世界"
• 而是"我在这个过程中学到了什么"

问自己：
"What skills am I building? What problems am I learning to solve?"

意义在能力增长里，不只在产出里。', 1, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '尝试"微控制实验"：
在一个小范围内掌握主导权，比如：
• 优化一个流程
• 主导一个小module
• 跟supplier建立更高效的沟通机制

"I may not control the big picture, but I can own this piece."

边界感和控制感会让工作less meaningless。', 2, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果真的觉得这份工作长期无法满足你：
• 开始记录skills & achievements
• 建立side learning（不一定跳槽，但给自己选项）
• 定期review："我还能从这里拿到什么？"

"This job doesn''t define me. It''s a resource, not my identity."

保持清醒和主动权。', 3, true
FROM work_scenarios WHERE name = '工作没意义';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果想跟mentor T探讨career direction：

"I''d like to get your perspective on how to grow my impact in this role. What areas do you think I should focus on to develop more ownership?"

不是抱怨"没意义"，而是主动寻求成长路径。', 1, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果别人dump不重要的事给你：

"I want to make sure I''m prioritizing the right things. Can you help me understand how this ties to our key deliverables?"

温和质疑，守住你的时间和能量。', 2, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己说：

"意义不是被给予的，是我选择赋予的。我可以选择把这份工作当成「学习平台」「经济支撑」「过渡期」，而不是「全部人生」。"

重新框定关系，夺回主动权。', 3, true
FROM work_scenarios WHERE name = '工作没意义';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你在质疑意义，说明你还有热情和期待。很多人早就麻木了，但你还在思考、还在要求更多。这是好事，证明你没有放弃自己。', 1, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '意义感可以是阶段性的。也许现在的工作确实不是"终点"，但它可以是"跳板""学费""缓冲期"。这些也是一种意义，只是不那么闪亮而已。', 2, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你有能力、有思考、有标准，这些都会引导你找到更适合的路。现在的迷茫不是终点，是转折点。慢慢来，答案会出现的。', 3, true
FROM work_scenarios WHERE name = '工作没意义';

-- ========================================
-- 场景3：犯了错误
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '犯错不等于你不够好。在NPI/制程开发这种高不确定性环境里，trial and error本来就是必经过程。你不是失败了，你是在探索边界。', 1, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你的"能力焦虑"可能会放大这次错误的影响，让你觉得"我果然做不好"。但实际上，每个人都会犯错，包括那些看起来很厉害的人。你不是特例，你只是人。', 2, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '这个错误不会毁掉你的职业生涯。也许当下很难受，但一个月后回看，它只是众多learning中的一个。给自己一点时间和宽容。', 3, true
FROM work_scenarios WHERE name = '犯了错误';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '快速止损 + 主动沟通：
1. Assess impact & scope
2. Propose fix/mitigation ASAP
3. Loop in stakeholders早一点

"Here''s what happened, here''s the impact, here''s my proposed fix."

主动掌控narrative，不要等别人发现。', 1, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '转化为learning moment：
• 写个quick post-mortem（哪怕只给自己看）
• Root cause analysis
• "What can I systematize to prevent this?"

"Mistakes are expensive teachers, but they teach things success never does."

把错误变成你的资产，不是污点。', 2, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果担心被blame：
• Document你的decision-making process
• 说明当时的constraints & tradeoffs
• Show你已经在fix

"I made the best call with available info at the time. Here''s how I''m addressing it."

不是甩锅，是说明context。', 3, true
FROM work_scenarios WHERE name = '犯了错误';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '向manager E汇报问题：

"I wanted to give you a heads-up on [issue]. Here''s what happened, the current impact, and my action plan to fix it. I''ll keep you posted on progress."

提前告知，展示ownership，不藏着掖着。', 1, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果别人开始blame：

"I understand the concern. Let''s focus on the fix first and do a proper debrief after we stabilize. I''m owning this."

承认问题，但redirecting到solution，不陷入finger-pointing。', 2, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己说：

"这个错误不定义我。我的价值在于我如何respond，不在于我有没有犯过错。我会fix it，然后move on。"

Self-compassion，不要自我攻击。', 3, true
FROM work_scenarios WHERE name = '犯了错误';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你能快速发现问题并开始fix，这本身就说明你的能力和责任感。很多人会藏着问题或推卸责任，但你在直面它。这很难得。', 1, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '每一个优秀的工程师背后都有一堆failed experiments。区别不是"有没有犯过错"，而是"犯错后怎么处理"。而你正在用正确的方式处理。', 2, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '这次经历会让你更强。下次遇到类似情况，你会know exactly what to watch out for。成长有时候就是这样，painful但有效。你会挺过去的。', 3, true
FROM work_scenarios WHERE name = '犯了错误';

-- ========================================
-- 场景4：任务太多压力大
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你现在面对的不是"我不够努力"，而是"系统性的bandwidth不足"。CE、PD、System、MQE、供应商...多线并行本来就是不可能完美juggle的。这不是你的问题。', 1, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你习惯一个人扛，但T揽活不做、KQ好高骛远、GR往外抛——这不是你的能力问题，是资源分配和协作机制的问题。你已经在超负荷运转了。', 2, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '感到overwhelmed是身体在保护你，提醒你"这个workload不sustainable"。听听这个信号，不要强行push through到burnout。', 3, true
FROM work_scenarios WHERE name = '任务太多压力大';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', 'Ruthless prioritization：
• P0: Must be done this week
• P1: Important but can slip
• P2: Nice to have

跟manager说：
"Given current bandwidth, here''s my priority stack. Anything I should reorder?"

让manager做trade-off decision，不是你一个人扛。', 1, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '建立"push-back机制"：
• "I''m at capacity. To take this on, I''d need to deprioritize [X]. Is that the right call?"
• "Can we loop in [person] for support on this?"
• "What''s the actual deadline vs. ideal deadline?"

不是说no，是要求clarity和tradeoff discussion。', 2, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '每天只给自己3个"must-win"：
• 其他都是bonus
• Block 2-3hr focus time
• Email可以晚回，会议可以reschedule

"I can''t do everything perfectly. I can do 3 things well."

降低标准，保护sanity。', 3, true
FROM work_scenarios WHERE name = '任务太多压力大';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '跟manager E escalate workload：

"I want to flag that I''m currently juggling [list]. To maintain quality, I need help prioritizing or getting support on [specific area]. What would you recommend?"

不是complain，是request guidance。', 1, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '当KQ或GR想dump事情给你：

"I see the urgency. My current plate is [X, Y, Z]. Can we align on priority or discuss who else might have bandwidth?"

温和但坚定，protect your boundary。', 2, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己说：

"我不需要成为superhero。我只需要manage好我能控制的范围。剩下的，不是我的responsibility。"

卸下不该背的包袱。', 3, true
FROM work_scenarios WHERE name = '任务太多压力大';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你能同时handle这么多线，已经证明你的能力远超常人。很多人在你这个workload下早就崩了，但你还在运转。这是strength，不是理所当然。', 1, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '记住：你的价值不等于你能扛多少。设置边界、要求支持、说"我需要help"——这些都是professional maturity的标志，不是软弱。', 2, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '这个阶段会过去的。也许需要一些tough conversation，也许需要调整expectations，但你不会一直这样扛。相信自己，你有能力改变这个局面。', 3, true
FROM work_scenarios WHERE name = '任务太多压力大';

-- ========================================
-- 场景5：同事关系紧张
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '跨团队扯皮和甩锅不是你的错。在责任模糊、多方施压的环境里，conflict是结构性问题，不是你"不会处理关系"。你的感受是正当的。', 1, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你对"被针对""不被尊重"特别敏感，因为你的安全感来自边界和控制。当别人侵入你的space或质疑你的能力时，触发的不只是工作冲突，还有更深层的不安。你有权利保护自己。', 2, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '不是所有人都值得你调整自己去迁就。有些人就是difficult，这不是你的问题。保持professional distance是智慧，不是冷漠。', 3, true
FROM work_scenarios WHERE name = '同事关系紧张';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', 'Email trail everything：
• 重要决定都要written confirmation
• CC relevant stakeholders
• "Per our discussion, here''s my understanding..."

不是不信任，是protect yourself from后续甩锅。Documentation is your armor。', 1, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '建立"professional buffer"：
• 减少不必要的1:1互动
• 通过email/meeting notes沟通，避免he-said-she-said
• 保持礼貌但distance

"I don''t need to be friends with everyone. I need clear, respectful collaboration."

边界清晰，心理安全。', 2, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果conflict escalate：
• 找mentor T或manager E介入
• Frame it as "process issue" not "people issue"
• "We need clearer scope/ownership to move forward efficiently"

让系统解决，不要solo battle。', 3, true
FROM work_scenarios WHERE name = '同事关系紧张';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '当KQ想甩锅时：

"I think there might be some confusion on ownership. Let me clarify: I''m responsible for [X], and [Y] is outside my scope. Can we align on this?"

温和但firm，clarify boundary。', 1, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '当GR往外抛问题时：

"I''d like to help, but this falls under [team/person]''s domain. Let''s loop them in to make sure we''re solving this the right way."

Redirect，不接锅。', 2, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果被unfairly blame：

"I hear your concern. Let''s look at the timeline and decision points together to understand what happened. I''m happy to discuss how to prevent this in the future."

冷静、factual、不defensive。', 3, true
FROM work_scenarios WHERE name = '同事关系紧张';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你能在这种复杂的人际环境里still deliver，说明你的professional能力和emotional resilience都很强。很多人早就被拖垮了，但你还在战斗。', 1, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '设置边界、保护自己、不过度迁就——这些都是healthy的professional behavior。你不需要让所有人都喜欢你，你只需要maintain respect and clarity。', 2, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '记住：difficult people是他们的问题，不是你的失败。你已经做得够好了，不需要prove anything to anyone。Keep your integrity，剩下的交给时间。', 3, true
FROM work_scenarios WHERE name = '同事关系紧张';

-- ========================================
-- 场景6：不想开会/社交
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '不想开会/social完全正常。你是introvert who recharges alone，强行社交会消耗你的能量储备。这不是你不合群，这是你的神经系统在保护你。', 1, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你习惯一个人做事、一个人扛，因为这样更有控制感。meeting和social都是"被动配合"的场景，触发你的"被要求"敏感点。这种抗拒是你在守护自己的边界。', 2, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '不是所有meeting都值得你的时间。不是所有social event都需要你出现。你有权利选择性参与，而不是被期待"永远available"。', 3, true
FROM work_scenarios WHERE name = '不想开会/社交';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', 'Meeting hygiene：
• 提前看agenda，没agenda就ask "What''s the goal?"
• 如果你不是decision-maker或key contributor: "Can I get notes instead?"
• Block "focus time" on calendar to prevent random meetings

"My time is finite. I choose where to spend it."

主动管理calendar，不被动接受。', 1, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', 'Social event策略：
• 只去必须的（manager要求的、critical networking）
• Set time limit: "I can stop by for 30min"
• 找个理由提前离开："I have another commitment"

不是撒谎，是protect your energy。你不欠任何人无限社交。', 2, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果实在要去：
• 找一个安全的corner/小群体
• 设定"完成3个有意义对话就可以走"的目标
• Headphones on immediately after = signal "don''t approach me"

Minimize exposure，maximize efficiency。', 3, true
FROM work_scenarios WHERE name = '不想开会/社交';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '婉拒不必要的meeting：

"Thanks for the invite. Could you share the agenda? If my input isn''t critical, I''d prefer to review notes and follow up async."

礼貌但clear about your preference。', 1, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果被push参加social：

"I appreciate the invite. I''ll try to stop by if bandwidth allows, but I''m heads-down on [project] right now."

不说死no，但也不commit。', 2, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己说：

"我不需要prove我是个team player through excessive socializing. 我的工作质量说明一切。我可以选择性参与，而不是被迫always on。"

重新框定expectations。', 3, true
FROM work_scenarios WHERE name = '不想开会/社交';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你的生产力来自focus和独立工作，不是endless meetings。保护你的deep work time不是selfish，是professional。优秀的人知道how to manage their energy。', 1, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', 'Introverts不是defective extroverts。你有自己的节奏和充电方式。尊重这个需求，设置边界，是self-care，不是逃避。', 2, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你不需要参加每一个meeting、每一个social event来prove your value。你的能力和deliverables会speak for themselves。保护好自己的能量，这才能长久。', 3, true
FROM work_scenarios WHERE name = '不想开会/社交';
