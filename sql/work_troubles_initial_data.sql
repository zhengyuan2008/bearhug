-- 工作烦恼初始数据
-- 创建日期：2025-12-28
-- 包含8个场景，每个场景12条话术（4种类型×3条）

-- ========================================
-- 插入工作场景（8个）
-- ========================================

INSERT INTO work_scenarios (category, name, icon, description, display_order, is_active) VALUES
('motivation', '不想上班', '😮‍💨', '早上起来就不想去公司，感觉上班好累好痛苦', 1, true),
('motivation', '工作没意义', '🌫️', '觉得现在的工作没有意义，看不到未来和希望', 2, true),
('criticism', '被领导批评', '😞', '被领导批评或者否定了自己的工作成果', 3, true),
('criticism', '犯了错误', '😔', '工作中犯了错误，担心被责怪或影响职业发展', 4, true),
('workload', '任务太多压力大', '😰', '工作任务堆积如山，压力很大，不知道从何做起', 5, true),
('workload', 'DDL要到了', '⏰', '截止日期快到了，工作还没完成，特别焦虑', 6, true),
('conflict', '同事关系紧张', '😣', '和同事或合作伙伴关系紧张，工作氛围不好', 7, true),
('pressure', '不想开会/社交', '😶', '不想参加会议或者公司社交活动，觉得累', 8, true);

-- ========================================
-- 场景1：不想上班
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '不想上班是很正常的感受，你不是一个人这样想。工作本来就不是生活的全部，你可以允许自己有"不想"的时候。这不代表你不够努力或者不负责任，这只是说明你也是个有情绪的普通人。', 1, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '感到疲惫和抗拒是身体在向你发出信号，它在告诉你需要休息和调整了。听听自己内心的声音，这种感受是值得被看见和尊重的。', 2, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '每个人都有低谷期，有时候就是会特别不想工作。这不是你的错，也不需要为这种感受感到愧疚。给自己一点时间和空间，慢慢来。', 3, true
FROM work_scenarios WHERE name = '不想上班';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '可以试试"小目标法"：不要想整天的工作，只告诉自己"先做10分钟"或"完成一个小任务"。有时候开始了就会好一点。如果实在不行，那就放慢节奏，一步一步来。', 1, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '给今天设置一个"最低完成线"：只要完成这一两件最重要的事就算成功。其他的都是额外奖励。降低预期，减少内耗。', 2, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '在通勤路上听喜欢的音乐或播客，给自己准备一杯喜欢的咖啡，或者穿上让自己舒服的衣服。用小小的仪式感让这一天不那么难熬。', 3, true
FROM work_scenarios WHERE name = '不想上班';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果需要向领导请假或调整工作节奏：
"不好意思，我最近身体/状态不太好，可能效率会低一些。如果[具体事项]比较紧急的话请告诉我优先级，我尽力完成。"

委婉表达，同时给自己留出空间。', 1, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '和信任的同事交流：
"最近有点累，感觉状态不太好。你有过这种时候吗？一般怎么调整的？"

寻求理解和支持，说出来会轻松一些。', 2, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己说：
"今天只需要出现，不需要表现完美。能完成基本工作就很好了。"

降低对自己的要求，减少心理负担。', 3, true
FROM work_scenarios WHERE name = '不想上班';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你今天已经起来了、出门了，这就已经很棒了。不想上班但还是去了，这需要很大的勇气和自律，你比自己想象的要坚强。', 1, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '记得，工作是为了更好地生活，不是生活的全部。如果今天真的撑不下去了，那就休息一下，没有工作值得你把自己逼到崩溃。你的健康和快乐更重要。', 2, true
FROM work_scenarios WHERE name = '不想上班';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '这种感觉会过去的。也许是今天，也许是下周，但它不会一直这样。坚持一下，给自己一些耐心，你一定能走出来。', 3, true
FROM work_scenarios WHERE name = '不想上班';

-- ========================================
-- 场景2：工作没意义
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '觉得工作没意义，这是很多人都会经历的迷茫期。这不是你的问题，而是你在思考和成长的标志。愿意去思考"意义"本身，就已经说明你对自己的生活有更高的期待。', 1, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '失去目标感和动力是很正常的，特别是在重复性的工作中。你不需要强迫自己立刻找到意义，允许自己有一段"漂浮"的时间。', 2, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '工作的意义不一定要宏大或高尚。养活自己、支撑生活、给家人一份安心，这些本身就很有意义。不要低估这些"平凡"的价值。', 3, true
FROM work_scenarios WHERE name = '工作没意义';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '尝试在工作中设定一些小目标：学会一个新技能、帮助一个同事、优化一个流程。意义有时候不是找到的，而是创造出来的。', 1, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '可以把工作看作是一个"过渡阶段"：它为你提供收入和稳定，让你有时间和空间去探索真正想做的事。暂时的"没意义"不代表永远。', 2, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '在工作之外培养自己的兴趣和爱好，让生活的重心不要完全放在工作上。当工作不能给你满足感时，生活的其他部分可以补足。', 3, true
FROM work_scenarios WHERE name = '工作没意义';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '和领导讨论职业发展：
"我想和您聊聊我的职业规划。我希望能承担更多有挑战性的项目，或者在[某个方向]上有所发展。您觉得有什么机会吗？"

主动寻找改变的可能性。', 1, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '和朋友交流：
"你会觉得自己的工作有意义吗？你是怎么看待工作和生活的关系的？"

听听别人的想法，也许能给你新的视角。', 2, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己诚实：
"我现在感觉工作没意义，这是真实的感受。但我可以先做好当下的事，同时慢慢想清楚自己真正想要什么。"

接纳现状，但不放弃思考。', 3, true
FROM work_scenarios WHERE name = '工作没意义';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '能够思考"意义"这个问题，说明你不是在混日子，而是在认真对待自己的人生。这很难得，也很勇敢。', 1, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '找到真正有意义的工作是一个过程，不是一蹴而就的。现在的迷茫和探索，都是通往答案路上的必经之路。', 2, true
FROM work_scenarios WHERE name = '工作没意义';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '无论最后做什么决定——是留下、是换工作、还是暂时不做决定——只要是你深思熟虑后的选择，就是对的。相信自己的判断。', 3, true
FROM work_scenarios WHERE name = '工作没意义';

-- ========================================
-- 场景3：被领导批评
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '被批评真的很难受，特别是当你已经很努力的时候。这种委屈和难过是正常的，不要压抑自己的情绪，允许自己感到伤心。', 1, true
FROM work_scenarios WHERE name = '被领导批评';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '批评不代表你这个人不好，只是说明这件事可以做得更好。把批评和自我价值分开看，你依然是有能力、有价值的人。', 2, true
FROM work_scenarios WHERE name = '被领导批评';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '有时候领导的批评可能带着情绪或者沟通方式不够妥当，这不全是你的问题。不要把所有责任都揽在自己身上。', 3, true
FROM work_scenarios WHERE name = '被领导批评';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '给自己一点时间消化情绪，然后冷静下来想想：批评中有没有合理的部分？如果有，下次怎么改进？如果没有，那就记住这次经验，下次更好地保护自己。', 1, true
FROM work_scenarios WHERE name = '被领导批评';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '可以找领导进行一次一对一的沟通，问清楚具体的期待和改进方向。这样既能澄清误会，也能展示你的态度和诚意。', 2, true
FROM work_scenarios WHERE name = '被领导批评';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '记录下批评的具体内容和改进计划，过一段时间后复盘成长。把批评转化为成长的动力，而不是一直沉浸在负面情绪里。', 3, true
FROM work_scenarios WHERE name = '被领导批评';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '和领导沟通时：
"感谢您的反馈，我会认真思考和改进。能不能麻烦您具体说说哪些地方需要调整？我希望下次能做得更好。"

展现虚心接受，同时要求具体指导。', 1, true
FROM work_scenarios WHERE name = '被领导批评';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果批评不合理，可以礼貌反馈：
"我理解您的关注点，但我想说明一下当时的情况是[具体情况]。如果有更好的处理方式，请您指导我。"

不卑不亢，陈述事实。', 2, true
FROM work_scenarios WHERE name = '被领导批评';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '和信任的人倾诉：
"今天被领导批评了，我感觉很难受。你觉得我该怎么办？"

寻求支持和建议，说出来会好很多。', 3, true
FROM work_scenarios WHERE name = '被领导批评';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '一次批评不代表你的全部工作都被否定。想想之前做得好的地方，你依然是有能力的人，只是这次需要调整而已。', 1, true
FROM work_scenarios WHERE name = '被领导批评';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '能够接受批评并且想办法改进，这本身就是一种成熟和专业。这个过程虽然难受，但你会从中变得更强大。', 2, true
FROM work_scenarios WHERE name = '被领导批评';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '批评是暂时的，但你的成长是长久的。过一段时间回头看，这只是职业生涯中的一个小插曲，不会定义你。', 3, true
FROM work_scenarios WHERE name = '被领导批评';

-- ========================================
-- 场景4：犯了错误
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '犯错是人之常情，每个人都会犯错，包括你的领导和同事。一次错误不代表你不够好，只是说明你还在学习和成长。', 1, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你现在感到焦虑和担心是正常的，但请不要一直自责。错误已经发生了，重要的是接下来怎么补救和改进。', 2, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '很多时候，我们对错误的恐惧大于错误本身的影响。深呼吸，告诉自己：这不是世界末日，我可以解决这个问题。', 3, true
FROM work_scenarios WHERE name = '犯了错误';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '第一时间主动报告错误，并提出补救方案。主动承担责任比被发现后追究要好得多，这也展现了你的诚实和责任心。', 1, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '分析错误原因：是流程问题、沟通问题还是自己疏忽？找到根源，制定改进措施，避免下次再犯。把错误变成学习机会。', 2, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果错误已经造成损失，专注于"止损"和"补救"，而不是一直懊悔和自责。行动起来，把影响降到最低。', 3, true
FROM work_scenarios WHERE name = '犯了错误';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '向领导报告错误时：
"不好意思，[具体事项]出现了问题，原因是[具体原因]。我已经采取了[补救措施]，并会确保以后[改进措施]。"

承认错误+解决方案+预防措施，展现专业态度。', 1, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '如果需要同事帮助：
"我在[事项]上出了点问题，想请教你一下该怎么处理。你之前遇到过类似的情况吗？"

虚心求助，寻求经验指导。', 2, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己说：
"错误已经发生了，我不能改变过去，但我可以控制接下来怎么做。我会从中学习，下次做得更好。"

接纳现实，向前看。', 3, true
FROM work_scenarios WHERE name = '犯了错误';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '敢于承认错误并且积极补救，这本身就是一种勇气和担当。很多人会选择逃避或推卸责任，但你没有，这很了不起。', 1, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '每个成功的人背后都有无数次失败和错误，区别只在于他们从错误中学到了什么。你也可以做到，这次错误会让你变得更强。', 2, true
FROM work_scenarios WHERE name = '犯了错误';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '过几个月后再回头看，你会发现这个错误远没有现在想的那么严重。它只是你职业生涯中的一个小波澜，不会定义你的未来。', 3, true
FROM work_scenarios WHERE name = '犯了错误';

-- ========================================
-- 场景5：任务太多压力大
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '感到压力山大、喘不过气是很正常的反应。这说明你已经超负荷了，不是你能力不够，而是任务确实太多了。', 1, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你不需要成为超人，把所有事都做到完美。每个人的精力和时间都是有限的，承认自己的限制不是软弱，而是智慧。', 2, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '深呼吸，告诉自己：我只能尽力而为，无法完成所有事也没关系。不要让焦虑和自责消耗你仅有的能量。', 3, true
FROM work_scenarios WHERE name = '任务太多压力大';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '列出所有任务，按紧急和重要程度分类。优先做"紧急且重要"的事，其他的可以延后或委派。不要试图同时推进所有事情。', 1, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '和领导沟通，明确优先级："这些任务我都收到了，但如果要保证质量，我需要先做[某几项]，其他的可能需要延后。您觉得哪些最紧急？"主动管理期待。', 2, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '学会说"不"或者"延后"。如果真的做不完，及早沟通总比最后做砸要好。设定合理边界，保护自己的时间和精力。', 3, true
FROM work_scenarios WHERE name = '任务太多压力大';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '向领导反馈工作量：
"我现在手上有[A、B、C]几个项目，如果都要按时完成，我担心质量会受影响。能否帮我确认一下优先级，或者看看有没有其他资源支持？"

专业地表达压力，寻求支持。', 1, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '请求延期时：
"关于[项目名]，我评估了一下，如果要达到预期质量，需要更多时间。能否将deadline延后到[具体日期]？"

说明原因，给出具体方案。', 2, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '向同事求助：
"我这边有点忙不过来，[某个任务]能不能麻烦你帮忙看一下？或者给我一些建议？"

团队合作，分担压力。', 3, true
FROM work_scenarios WHERE name = '任务太多压力大';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你已经在努力应对这么多任务了，这本身就很不容易。不要因为没有做到完美就否定自己，你已经做得够好了。', 1, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '记住，任何工作都不值得你把自己逼到身心俱疲。如果真的超负荷了，请求支持、延期或者放弃一些事是合理的选择，不是逃避。', 2, true
FROM work_scenarios WHERE name = '任务太多压力大';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '这个忙碌的阶段会过去的。坚持住，合理分配任务和精力，你一定能渡过这个难关。加油！', 3, true
FROM work_scenarios WHERE name = '任务太多压力大';

-- ========================================
-- 场景6：DDL要到了
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', 'DDL临近时的焦虑是每个人都会有的，这种紧迫感很正常。但请相信，你比自己想象的更有能力应对这种情况。', 1, true
FROM work_scenarios WHERE name = 'DDL要到了';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '现在慌乱和自责都于事无补，先稳住情绪。深呼吸几次，告诉自己：我还有时间，我可以做完。', 2, true
FROM work_scenarios WHERE name = 'DDL要到了';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '即使最后结果不完美也没关系，完成比完美更重要。先做出来，能做到什么程度就做到什么程度。', 3, true
FROM work_scenarios WHERE name = 'DDL要到了';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '停止纠结，立刻开始做。哪怕只有10分钟也好，先做起来比一直焦虑要好。有时候开始了就会进入状态。', 1, true
FROM work_scenarios WHERE name = 'DDL要到了';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '快速梳理剩余工作，砍掉不必要的部分。用"MVP思维"：什么是最核心的部分？先保证核心完成，其他的能做多少做多少。', 2, true
FROM work_scenarios WHERE name = 'DDL要到了';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果实在完不成，及早沟通请求延期。晚说不如早说，提前沟通总比最后交不出来要好。解释原因，给出新的时间规划。', 3, true
FROM work_scenarios WHERE name = 'DDL要到了';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '请求延期时：
"关于[项目名]，由于[具体原因]，我担心无法在[原deadline]前完成到预期质量。如果延后到[新日期]，我可以确保[具体成果]。这样可以吗？"

诚实说明，给出新方案。', 1, true
FROM work_scenarios WHERE name = 'DDL要到了';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '寻求帮助时：
"我在赶[项目名]的deadline，[某个部分]卡住了，能否麻烦你帮我看一下？或者给个思路？"

紧急情况下，大胆求助。', 2, true
FROM work_scenarios WHERE name = 'DDL要到了';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己说：
"我现在要做的就是专注当下，一步一步推进。不想结果，只关注过程。做多少算多少。"

减少内耗，专注行动。', 3, true
FROM work_scenarios WHERE name = 'DDL要到了';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你之前一定也度过很多次这样的时刻，最后不都完成了吗？相信自己，你有这个能力。', 1, true
FROM work_scenarios WHERE name = 'DDL要到了';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', 'Deadline是工作的一部分，不完美也是生活的一部分。无论最后结果如何，你的努力都是值得认可的。', 2, true
FROM work_scenarios WHERE name = 'DDL要到了';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '这次deadline过去后，记得复盘一下时间管理，下次可以更从容。但现在，就专心冲刺吧，你可以的！', 3, true
FROM work_scenarios WHERE name = 'DDL要到了';

-- ========================================
-- 场景7：同事关系紧张
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '人际关系紧张真的很消耗人，这种不舒服的感觉是正常的。你不需要和所有人都相处融洽，有些关系就是这样。', 1, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '如果你已经尝试过改善但没有效果，那可能不是你的问题。有些人就是性格不合，这很正常，不要过度自责。', 2, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '工作关系不一定要成为朋友关系，能够专业地完成合作就够了。给自己松松绑，不要强求所有人都喜欢你。', 3, true
FROM work_scenarios WHERE name = '同事关系紧张';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '保持专业距离：公事公办，减少不必要的个人交流。把注意力放在工作本身，而不是人际关系上。', 1, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果是误会或沟通问题，可以找个合适的时机坦诚沟通一次：\n"我感觉我们之间好像有些不太顺畅，是不是有什么误会？我希望我们能更好地合作。"

给彼此一个机会。', 2, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果对方确实有问题（如：挑衅、甩锅、霸凌），保留证据，必要时寻求领导或HR的帮助。保护自己不是小题大做。', 3, true
FROM work_scenarios WHERE name = '同事关系紧张';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '主动沟通时：
"我想和你聊聊我们的工作配合。我感觉有些地方可能沟通不太顺畅，有什么建议吗？"

开放式提问，给对方台阶下。', 1, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '设定边界时：
"关于[某事]，我希望我们能按[具体方式]来处理，这样会更高效。你觉得呢？"

明确表达需求，保持礼貌但坚定。', 2, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '向领导反馈时（如果必要）：
"我想反馈一下和[同事]的合作情况。[具体事例]影响了工作进展，希望能得到您的建议和协调。"

客观陈述，寻求支持。', 3, true
FROM work_scenarios WHERE name = '同事关系紧张';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '你已经在努力维护这段关系了，如果还是不行，那真的不是你的问题。有些关系就是这样，接受它，然后继续前行。', 1, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '不要让一个不愉快的同事关系影响你对工作的整体感受。还有其他同事、其他项目、其他值得你投入的事情。', 2, true
FROM work_scenarios WHERE name = '同事关系紧张';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '能够在困难的人际环境中保持专业和冷静，这本身就是一种能力和成熟。你做得很好，继续保持。', 3, true
FROM work_scenarios WHERE name = '同事关系紧张';

-- ========================================
-- 场景8：不想开会/社交
-- ========================================

-- 情感安慰（comfort）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '不想开会或社交是很正常的感受，特别是对内向的人来说。这些活动确实很消耗能量，你的疲惫是真实的。', 1, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '你不需要强迫自己喜欢这些活动，也不需要假装很享受。保持基本的职业礼貌就够了，不用勉强自己。', 2, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'comfort', '如果今天真的很累，不想参加非必须的社交活动，那就不去。保护自己的能量和边界是正当的需求。', 3, true
FROM work_scenarios WHERE name = '不想开会/社交';

-- 应对策略（strategy）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '区分"必须参加"和"可以不参加"的会议/活动。对于后者，诚实地婉拒："不好意思，我手头有些紧急工作，这次就不参加了。"', 1, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '如果必须参加，设定一个"最短停留时间"：露个面、说几句话就可以离开。不用从头待到尾，给自己一个退出时间。', 2, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'strategy', '会议期间，专注倾听和记录，适当发言即可。不用强迫自己很活跃。做好自己该做的部分就够了。', 3, true
FROM work_scenarios WHERE name = '不想开会/社交';

-- 对话话术（script）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '婉拒社交活动时：
"感谢邀请，但我今天有点累/有些事要处理，下次有机会再一起。"

简单直接，不需要过度解释。', 1, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '提前退场时：
"不好意思，我还有些工作要跟进，先走一步。大家继续！"

礼貌告知，不打扰他人。', 2, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'script', '对自己说：
"我今天的社交能量有限，我可以选择保护自己。做该做的事就够了，不需要勉强。"

给自己permission to rest。', 3, true
FROM work_scenarios WHERE name = '不想开会/社交';

-- 鼓励支持（support）
INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '能够认识到自己的边界并且保护它，这是一种自我关怀和智慧。不是每个人都能做到，你已经很棒了。', 1, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '工作中的你不需要是"社交达人"，只需要是"专业可靠"就够了。做真实的自己，不要为了迎合而耗尽能量。', 2, true
FROM work_scenarios WHERE name = '不想开会/社交';

INSERT INTO work_phrases (scenario_id, phrase_type, content, display_order, is_active)
SELECT id, 'support', '会议和社交结束后，记得给自己一些独处时间恢复能量。你需要这个空间，这很正常也很重要。', 3, true
FROM work_scenarios WHERE name = '不想开会/社交';

-- ========================================
-- 验证查询
-- ========================================

-- 查看所有场景
SELECT id, name, icon, display_order
FROM work_scenarios
ORDER BY display_order;

-- 统计每个场景的话术数量
SELECT
  ws.name AS scenario_name,
  COUNT(wp.id) AS phrase_count,
  SUM(CASE WHEN wp.phrase_type = 'comfort' THEN 1 ELSE 0 END) AS comfort_count,
  SUM(CASE WHEN wp.phrase_type = 'strategy' THEN 1 ELSE 0 END) AS strategy_count,
  SUM(CASE WHEN wp.phrase_type = 'script' THEN 1 ELSE 0 END) AS script_count,
  SUM(CASE WHEN wp.phrase_type = 'support' THEN 1 ELSE 0 END) AS support_count
FROM work_scenarios ws
LEFT JOIN work_phrases wp ON ws.id = wp.scenario_id
GROUP BY ws.id, ws.name
ORDER BY ws.display_order;

-- 总计统计
SELECT
  (SELECT COUNT(*) FROM work_scenarios WHERE is_active = true) AS total_scenarios,
  (SELECT COUNT(*) FROM work_phrases WHERE is_active = true) AS total_phrases,
  (SELECT COUNT(*) FROM work_phrases WHERE phrase_type = 'comfort' AND is_active = true) AS total_comfort,
  (SELECT COUNT(*) FROM work_phrases WHERE phrase_type = 'strategy' AND is_active = true) AS total_strategy,
  (SELECT COUNT(*) FROM work_phrases WHERE phrase_type = 'script' AND is_active = true) AS total_script,
  (SELECT COUNT(*) FROM work_phrases WHERE phrase_type = 'support' AND is_active = true) AS total_support;
