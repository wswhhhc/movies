import "dotenv/config";
import { PrismaSqlite } from "prisma-adapter-sqlite";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaSqlite({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const genres = [
  { id: 28, nameZh: "动作", nameEn: "Action", slug: "action" },
  { id: 12, nameZh: "冒险", nameEn: "Adventure", slug: "adventure" },
  { id: 16, nameZh: "动画", nameEn: "Animation", slug: "animation" },
  { id: 35, nameZh: "喜剧", nameEn: "Comedy", slug: "comedy" },
  { id: 80, nameZh: "犯罪", nameEn: "Crime", slug: "crime" },
  { id: 99, nameZh: "纪录片", nameEn: "Documentary", slug: "documentary" },
  { id: 18, nameZh: "剧情", nameEn: "Drama", slug: "drama" },
  { id: 10751, nameZh: "家庭", nameEn: "Family", slug: "family" },
  { id: 14, nameZh: "奇幻", nameEn: "Fantasy", slug: "fantasy" },
  { id: 36, nameZh: "历史", nameEn: "History", slug: "history" },
  { id: 27, nameZh: "恐怖", nameEn: "Horror", slug: "horror" },
  { id: 10402, nameZh: "音乐", nameEn: "Music", slug: "music" },
  { id: 9648, nameZh: "悬疑", nameEn: "Mystery", slug: "mystery" },
  { id: 10749, nameZh: "爱情", nameEn: "Romance", slug: "romance" },
  { id: 878, nameZh: "科幻", nameEn: "Science Fiction", slug: "science-fiction" },
  { id: 53, nameZh: "惊悚", nameEn: "Thriller", slug: "thriller" },
  { id: 10752, nameZh: "战争", nameEn: "War", slug: "war" },
  { id: 37, nameZh: "西部", nameEn: "Western", slug: "western" },
];

const mockMovies = [
  { id: 1, title: "肖申克的救赎", originalTitle: "The Shawshank Redemption", overview: "一个被冤枉的银行家安迪·杜弗兰被判终身监禁，在肖申克监狱中他经历了二十年的牢狱生活。凭借才智和毅力，他不仅赢得了狱友的尊重，还精心策划了一场惊天越狱。", posterPath: "/9cjIGRQL1m4E87FkTJVT0Z7S9Qy.jpg", backdropPath: "/zfbjgBEHq7JkfNbYR0PSBJzCq2r.jpg", releaseDate: "1994-09-23", voteAverage: 8.7, voteCount: 25000, popularity: 85.5, runtime: 142, genreIds: [18, 80] },
  { id: 2, title: "霸王别姬", originalTitle: "Farewell My Concubine", overview: "段小楼和程蝶衣从小在京剧班学艺，两人合演《霸王别姬》名震京师。历经半个世纪的沧桑变迁，两人之间的情感纠葛与命运沉浮令人唏嘘。", posterPath: "/jYHKM59Bmkz4P2zYq6WnsbHhB6b.jpg", backdropPath: "/3OUrkYMRNFZRIg3XG0SJLXR2Ckv.jpg", releaseDate: "1993-01-01", voteAverage: 8.6, voteCount: 12000, popularity: 72.3, runtime: 171, genreIds: [18, 10749] },
  { id: 3, title: "星际穿越", originalTitle: "Interstellar", overview: "在不远的未来，地球面临着严重的粮食危机和环境恶化。前NASA飞行员库珀被选中参与一项穿越虫洞的星际旅行，为人类寻找新的家园。", posterPath: "/nCbkOyOMTEgEVqZO41zUcrA36iK.jpg", backdropPath: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg", releaseDate: "2014-11-05", voteAverage: 8.4, voteCount: 35000, popularity: 95.2, runtime: 169, genreIds: [12, 18, 878] },
  { id: 4, title: "泰坦尼克号", originalTitle: "Titanic", overview: "1912年，泰坦尼克号首航途中，贫穷的画家杰克和贵族女孩罗丝坠入爱河。当巨轮撞上冰山沉没时，他们的爱情面临生死考验。", posterPath: "/kHZyG4GFCg4M7I8qZQ7JVoJHn8B.jpg", backdropPath: "/kXfNHn8YJMoYx2f7vWKoCvKjTzL.jpg", releaseDate: "1997-11-18", voteAverage: 8.4, voteCount: 28000, popularity: 78.9, runtime: 194, genreIds: [18, 10749] },
  { id: 5, title: "盗梦空间", originalTitle: "Inception", overview: "造梦师科布 specializes 在潜入别人梦境中盗取秘密。为了回到孩子身边，他接受了一个看似不可能的任务——在目标人物的潜意识中植入一个想法。", posterPath: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", backdropPath: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg", releaseDate: "2010-07-15", voteAverage: 8.3, voteCount: 38000, popularity: 92.1, runtime: 148, genreIds: [28, 878, 12] },
  { id: 6, title: "千与千寻", originalTitle: "Spirited Away", overview: "十岁的小女孩千寻随父母搬家途中误入一个神灵世界。她的父母因贪吃变成了猪，千寻必须在汤婆婆的汤屋中工作，寻找解救父母的办法。", posterPath: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", backdropPath: "/bSXfU4HQx9UAIHBKqMTdOxqMIdj.jpg", releaseDate: "2001-07-20", voteAverage: 8.5, voteCount: 18000, popularity: 68.7, runtime: 125, genreIds: [16, 14, 12] },
  { id: 7, title: "蝙蝠侠：黑暗骑士", originalTitle: "The Dark Knight", overview: "蝙蝠侠、戈登警长和检察官哈维·丹特组成联盟打击高谭市的犯罪。然而，混乱使者小丑的出现打破了这一切，他将城市推向了混乱的深渊。", posterPath: "/n1y094tVDFjixhSTjG6kOF1lP7.jpg", backdropPath: "/nMKdUUepR0i5zn0y1T4CsSB5ez.jpg", releaseDate: "2008-07-16", voteAverage: 8.5, voteCount: 32000, popularity: 88.3, runtime: 152, genreIds: [28, 80, 18] },
  { id: 8, title: "阿甘正传", originalTitle: "Forrest Gump", overview: "智商只有75的阿甘，凭着一颗单纯善良的心和永不停歇的双腿，见证了美国几十年的历史变迁，创造了属于自己的传奇人生。", posterPath: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", backdropPath: "/bdN3gXuIZYaJP7ftKK2sU0nPtEA.jpg", releaseDate: "1994-07-06", voteAverage: 8.5, voteCount: 27000, popularity: 82.4, runtime: 142, genreIds: [18, 35, 10749] },
  { id: 9, title: "辛德勒的名单", originalTitle: "Schindler's List", overview: "二战期间，德国商人辛德勒目睹了纳粹对犹太人的残酷迫害后，倾家荡产保护了1100多名犹太人免遭屠杀。", posterPath: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", backdropPath: "/teEf7H1CJ2GxhBSNvBpK5PvtP7h.jpg", releaseDate: "1993-11-30", voteAverage: 8.6, voteCount: 16000, popularity: 55.2, runtime: 195, genreIds: [18, 36, 10752] },
  { id: 10, title: "让子弹飞", originalTitle: "Let the Bullets Fly", overview: "北洋年间，南部中国。悍匪张牧之劫了马邦德的火车后，冒充县长去鹅城上任。他与恶霸黄四郎斗智斗勇，展开了一场波谲云诡的较量。", posterPath: "/snzpTGpQJuLgQO3o5uHHT0V2ydr.jpg", backdropPath: "/1MGNeM3wD18B2e0PCnFOkuE0y7Y.jpg", releaseDate: "2010-12-16", voteAverage: 8.3, voteCount: 15000, popularity: 65.8, runtime: 132, genreIds: [28, 18, 35] },
  { id: 11, title: "楚门的世界", originalTitle: "The Truman Show", overview: "楚门·伯班克从出生起就生活在一个巨大的摄影棚中，他的一切都是一场全球直播的真人秀。当他发现真相后，开始了寻找真实世界的旅程。", posterPath: "/vuzaNLg7w4lG2Bs8S2tBChJ10BF.jpg", backdropPath: "/hVIKyK8NLEjX7PifWREsCkmL1Hr.jpg", releaseDate: "1998-06-04", voteAverage: 8.2, voteCount: 19000, popularity: 58.4, runtime: 103, genreIds: [18, 35] },
  { id: 12, title: "机器人总动员", originalTitle: "WALL-E", overview: "公元2805年，地球被垃圾覆盖，人类已移居太空。一个小机器人瓦力孤独地清理垃圾，直到有一天，一个探测机器人伊娃的到来改变了一切。", posterPath: "/h0r4d4kWLBjntd7dyOSWSyCz0Gv.jpg", backdropPath: "/8gLqedkKWMGHUP6MNEzQ30SWJ89.jpg", releaseDate: "2008-06-22", voteAverage: 8.1, voteCount: 22000, popularity: 62.3, runtime: 98, genreIds: [16, 878, 12] },
  { id: 13, title: "疯狂动物城", originalTitle: "Zootopia", overview: "在一个动物和平共处的大都市中，小兔子朱迪实现了成为警察的梦想。她与狡猾的狐狸尼克搭档，共同调查一桩失踪案件。", posterPath: "/hlC6D82DJTCGIp2kqEKB1bXvhCp.jpg", backdropPath: "/mhdeE1yShHTaDbT6mDBCNQFIUAH.jpg", releaseDate: "2016-02-11", voteAverage: 8.0, voteCount: 20000, popularity: 56.8, runtime: 108, genreIds: [16, 12, 35] },
  { id: 14, title: "摔跤吧！爸爸", originalTitle: "Dangal", overview: "前摔跤冠军马哈维亚发现自己的两个女儿有摔跤天赋后，打破传统观念，将她们培养成了世界冠军摔跤手。", posterPath: "/xK6q2VxfK1l8uZqRAc73P4L1x3j.jpg", backdropPath: "/b7uQbw1PZ6lPQzjDXJHXNqG5DA8.jpg", releaseDate: "2016-12-23", voteAverage: 8.0, voteCount: 14000, popularity: 45.2, runtime: 161, genreIds: [28, 18, 35] },
  { id: 15, title: "无间道", originalTitle: "Infernal Affairs", overview: "警方卧底陈永仁和黑帮卧底刘建明分别潜入对方组织多年。在一次毒品交易中，双方都发现了内鬼的存在，一场身份与信任的博弈就此展开。", posterPath: "/okBVq7DxQIFM67WWdCYiF3mqx9E.jpg", backdropPath: "/wCEH4OBHmHzvxJCgo5v79nDQRtI.jpg", releaseDate: "2002-12-12", voteAverage: 8.2, voteCount: 11000, popularity: 52.6, runtime: 101, genreIds: [28, 80, 18] },
  { id: 16, title: "我不是药神", originalTitle: "Dying to Survive", overview: "程勇是一个卖印度神油的小商贩，为了挣钱他开始从印度走私廉价的仿制抗癌药。在一场关于生命、金钱和法律的较量中，他逐渐找到了自己的良知。", posterPath: "/nC3aY2tQjPqYR0BK7XJQHbsZ6Rm.jpg", backdropPath: "/7m5S6iPSsJALGFk9wFHFzMd4HgF.jpg", releaseDate: "2018-07-05", voteAverage: 8.1, voteCount: 9000, popularity: 48.9, runtime: 117, genreIds: [18, 35] },
  { id: 17, title: "寻梦环游记", originalTitle: "Coco", overview: "热爱音乐的小男孩米格在亡灵节误入亡灵世界，与已故曾曾祖父一起踏上了一段感人而奇妙的旅程，探索家庭与梦想的真谛。", posterPath: "/askg3WOBH53s3NRSYN1HrKcnEOf.jpg", backdropPath: "/askg3WOBH53s3NRSYN1HrKcnEOf.jpg", releaseDate: "2017-10-27", voteAverage: 8.1, voteCount: 21000, popularity: 54.3, runtime: 105, genreIds: [16, 14, 18] },
  { id: 18, title: "速度与激情7", originalTitle: "Furious 7", overview: "多米尼克和布莱恩各自回归平凡生活，但英国特工戴克·肖的出现打破了平静。为了复仇，他与整个团队展开了一场全球追杀。", posterPath: "/ktofZ9HtrAOzLvFvqGMEC1qgPnM.jpg", backdropPath: "/ypSZe8gQPCV9NTTKi5LXYxCSWKS.jpg", releaseDate: "2015-04-01", voteAverage: 7.7, voteCount: 18000, popularity: 88.7, runtime: 137, genreIds: [28, 80, 53] },
  { id: 19, title: "你的名字", originalTitle: "Your Name", overview: "生活在乡下的三叶和东京高中生�的泷，两人在梦中交换了身体。当他们开始寻找彼此时，却发现背后隐藏着一个跨越时空的秘密。", posterPath: "/xq1Ugd62d23K2kRUdE1EpoUPeZR.jpg", backdropPath: "/7OMAfDJX7NpSc3C6XbHqSNCoWac.jpg", releaseDate: "2016-08-26", voteAverage: 8.0, voteCount: 17000, popularity: 61.5, runtime: 106, genreIds: [16, 14, 10749] },
  { id: 20, title: "教父", originalTitle: "The Godfather", overview: "维托·柯里昂是纽约势力最大的黑帮家族首领。在他的小儿子迈克尔本想过正常生活，但家族的危机却迫使他接过了权力的接力棒。", posterPath: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", backdropPath: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg", releaseDate: "1972-03-14", voteAverage: 8.7, voteCount: 22000, popularity: 75.1, runtime: 175, genreIds: [18, 80] },
  { id: 21, title: "功夫", originalTitle: "Kung Fu Hustle", overview: "混混阿星误闯猪笼城寨，本想加入斧头帮为非作歹，却在这里发现了一群深藏不露的武林高手。一场关于功夫、正义与救赎的较量就此展开。", posterPath: "/1d0LSzYmrFjUCqZ6a4xV1ofmFwH.jpg", backdropPath: "/jqH0vL8XnE0DwnX9vWcIuIfL1xV.jpg", releaseDate: "2004-12-23", voteAverage: 7.9, voteCount: 8000, popularity: 42.1, runtime: 99, genreIds: [28, 35, 14] },
  { id: 22, title: "复仇者联盟4：终局之战", originalTitle: "Avengers: Endgame", overview: "灭霸的响指消灭了宇宙一半的生命，剩余的复仇者联盟成员必须再次集结，进行一场穿越时空的终极之战，逆转灭霸的所作所为。", posterPath: "/or06FNf7pDZ7HBFf2JAbY5w3L3G.jpg", backdropPath: "/7RyHsO4Q5GfVK7lH3BVEZQx3I5.jpg", releaseDate: "2019-04-24", voteAverage: 8.3, voteCount: 25000, popularity: 96.4, runtime: 181, genreIds: [28, 12, 878] },
  { id: 23, title: "美丽人生", originalTitle: "Life Is Beautiful", overview: "在二战期间的意大利，犹太父亲圭多用无尽的想象力和爱，告诉儿子他们经历的一切只是一场游戏，从而保护儿子免受集中营恐怖的伤害。", posterPath: "/6VnDtvWM2GkjkHWubMFbQkWkvFn.jpg", backdropPath: "/bO2mOd6wSNuw4nF9RRCmfE5MRni.jpg", releaseDate: "1997-12-20", voteAverage: 8.6, voteCount: 14000, popularity: 48.7, runtime: 116, genreIds: [18, 35, 10752] },
  { id: 24, title: "当幸福来敲门", originalTitle: "The Pursuit of Happyness", overview: "单身父亲克里斯·加德纳带着儿子流落街头，但他从未放弃对幸福的追求。通过不懈努力，他最终获得了股票经纪人的工作，改变了两人的命运。", posterPath: "/2B6LkLepENJh74hF7P2ORhxtNTr.jpg", backdropPath: "/3XJ9BaILwWnSAnKKAghUFbXi7mY.jpg", releaseDate: "2006-12-14", voteAverage: 8.0, voteCount: 16000, popularity: 52.8, runtime: 117, genreIds: [18, 35] },
  { id: 25, title: "寄生虫", originalTitle: "Parasite", overview: "贫穷的金家四口人全部失业，偶然机会进入富裕的朴社长家工作。两个家庭的命运交织在一起，阶层差异引发了一连串不可预测的事件。", posterPath: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", backdropPath: "/ApiB2NQrFXQ2q7ldnYq5KMeNURk.jpg", releaseDate: "2019-05-30", voteAverage: 8.5, voteCount: 19000, popularity: 71.2, runtime: 132, genreIds: [18, 35, 53] },
  { id: 26, title: "这个杀手不太冷", originalTitle: "Léon: The Professional", overview: "职业杀手莱昂独自生活在纽约。一天，邻居家的小女孩玛蒂尔达因家人被害而闯入了他的生活。两人的命运从此紧密相连。", posterPath: "/g4srpFPUgUwAEUJNQuCiG6PdKWN.jpg", backdropPath: "/s4VqO1GDqQGBFh1xL5VpYusv8vi.jpg", releaseDate: "1994-09-14", voteAverage: 8.5, voteCount: 21000, popularity: 74.5, runtime: 110, genreIds: [28, 80, 18] },
  { id: 27, title: "大话西游之大圣娶亲", originalTitle: "A Chinese Odyssey Part Two", overview: "至尊宝为了救紫霞仙子穿越时空回到五百年前，却发现自己就是孙悟空的转世。在爱情与使命之间，他做出了一个感人至深的选择。", posterPath: "/AbY48N5JX8kSdEW35OI3VJ8CCLr.jpg", backdropPath: "/b2l2UzFmhQONN75dDyFbRQBSgRo.jpg", releaseDate: "1995-02-04", voteAverage: 8.1, voteCount: 7000, popularity: 38.5, runtime: 99, genreIds: [28, 14, 35] },
  { id: 28, title: "少年派的奇幻漂流", originalTitle: "Life of Pi", overview: "少年派在一次海难中失去了家人，他与一只孟加拉虎在救生艇上漂流在大洋中。在227天的漂流中，他们经历了难以想象的挑战与奇迹。", posterPath: "/nExqMKmK9phL7glEf7kOZl7qQkI.jpg", backdropPath: "/j0SYgT6Y6zOQPhPhaosNPZYT7c.jpg", releaseDate: "2012-11-20", voteAverage: 8.0, voteCount: 15000, popularity: 50.3, runtime: 127, genreIds: [18, 14, 12] },
  { id: 29, title: "布达佩斯大饭店", originalTitle: "The Grand Budapest Hotel", overview: "传奇酒店管家古斯塔夫和门童零的冒险故事，围绕着名画《苹果少年》的争夺展开。故事以粉红色调呈现了一个关于欧洲文明逝去的诗意寓言。", posterPath: "/l8NUoXqWNwMqKLw6GpRFBdiF2Hn.jpg", backdropPath: "/7oWeFiNcQk7JuA4T8F98ljjYXKe.jpg", releaseDate: "2014-02-06", voteAverage: 8.1, voteCount: 14000, popularity: 46.8, runtime: 99, genreIds: [35, 18, 80] },
  { id: 30, title: "三傻大闹宝莱坞", originalTitle: "3 Idiots", overview: "兰彻是帝国工程学院最特立独行的学生，他质疑传统教育体制，与两个好友一起经历了欢笑与泪水交织的大学时光。十年后，一场寻找兰彻的旅程揭开了当年的秘密。", posterPath: "/sT7DuWlyATCsLif23Ly3Uv6ld8e.jpg", backdropPath: "/nQkRHmZQnpF7MXPxfW5rQOre4T8.jpg", releaseDate: "2009-12-25", voteAverage: 8.4, voteCount: 12000, popularity: 44.6, runtime: 170, genreIds: [35, 18] },
  { id: 31, title: "绿皮书", originalTitle: "Green Book", overview: "1962年，意裔美国保镖托尼被聘用为黑人钢琴家唐的司机，两人踏上了穿越美国南部的巡演之旅。在种族隔离的时代，这段旅程改变了他们的一生。", posterPath: "/7vWdC1CrbT7W8EvRnDGjd5VETkp.jpg", backdropPath: "/mRkR46dlllwzE43GvgfmNx7bxX9.jpg", releaseDate: "2018-11-16", voteAverage: 8.2, voteCount: 13000, popularity: 47.1, runtime: 130, genreIds: [18, 35] },
  { id: 32, title: "哈尔的移动城堡", originalTitle: "Howl's Moving Castle", overview: "少女苏菲被荒野女巫变成了老婆婆，她误入了魔法师哈尔的移动城堡。在城堡中，苏菲找回了自信与勇气，也解开了哈尔内心的秘密。", posterPath: "/iAjLo7WMoK7oOFDQMR0JFsVukkh.jpg", backdropPath: "/6sFybcFmyaUxOX2G5UzY3YCjBNj.jpg", releaseDate: "2004-11-19", voteAverage: 8.2, voteCount: 11000, popularity: 43.2, runtime: 119, genreIds: [16, 14, 12] },
  { id: 33, title: "黑客帝国", originalTitle: "The Matrix", overview: "程序员尼奥发现他生活的世界只是一个由人工智能创造的虚拟现实。在墨菲斯的引导下，他选择了红色药丸，开始了反抗机器统治的战争。", posterPath: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", backdropPath: "/7u3pxc0KjUo5q4TDL7x8xHMN4Nx.jpg", releaseDate: "1999-03-30", voteAverage: 8.2, voteCount: 26000, popularity: 69.8, runtime: 136, genreIds: [28, 878] },
  { id: 34, title: "飞屋环游记", originalTitle: "Up", overview: "78岁的老人卡尔为了实现与已故妻子的梦想，用大量气球将自己的房子升上了天空。旅途中，他与小男孩罗素结伴，开始了南美洲冒险。", posterPath: "/s7xw0FnYRsCWI6VHLN4hLF30i1h.jpg", backdropPath: "/nGcB3wVlCbfYctP7y5wYg3NgkmS.jpg", releaseDate: "2009-05-13", voteAverage: 8.1, voteCount: 19000, popularity: 55.6, runtime: 96, genreIds: [16, 12, 35] },
  { id: 35, title: "哪吒之魔童降世", originalTitle: "Ne Zha", overview: "天地灵气孕育出混元珠，元始天尊将其分为灵珠和魔丸。魔丸转世的哪吒被世人视为妖怪，但他决心逆天改命，用自己的方式证明善恶不由天定。", posterPath: "/4jH8w8L7bX27S4yUk2UNQ8lC4j7.jpg", backdropPath: "/pBvKXOBRP3GbjFwRG5D3RqO5yWZ.jpg", releaseDate: "2019-07-26", voteAverage: 8.0, voteCount: 8000, popularity: 41.5, runtime: 110, genreIds: [16, 14, 28] },
  { id: 36, title: "指环王：王者归来", originalTitle: "The Lord of the Rings: The Return of the King", overview: "佛罗多和山姆深入魔多销毁至尊魔戒，阿拉贡则带领人类最后的联军在米那斯提力斯城下与索伦的黑暗大军展开决战。", posterPath: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg", backdropPath: "/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg", releaseDate: "2003-12-01", voteAverage: 8.5, voteCount: 24000, popularity: 73.4, runtime: 201, genreIds: [12, 14, 28] },
  { id: 37, title: "搏击俱乐部", originalTitle: "Fight Club", overview: "一个失眠的白领遇到了肥皂商人泰勒·德顿，两人创建了一个秘密的地下搏击俱乐部。但随着俱乐部的发展，事态逐渐失去了控制。", posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", backdropPath: "/hZkgoQYus5dXo3H8T7Uef6DNknv.jpg", releaseDate: "1999-10-15", voteAverage: 8.4, voteCount: 24000, popularity: 67.9, runtime: 139, genreIds: [18, 53] },
  { id: 38, title: "龙猫", originalTitle: "My Neighbor Totoro", overview: "姐妹俩跟随父亲搬到乡下，在那里她们遇到了森林中的精灵龙猫。龙猫带着她们在月夜飞翔，在树顶眺望远方，给了姐妹俩最美好的童年记忆。", posterPath: "/mM5V4A3TjPK82AKIZCwYMnTFAFr.jpg", backdropPath: "/o4jNmCyOW69qLxMt7xGb5VhlTEv.jpg", releaseDate: "1988-04-16", voteAverage: 8.3, voteCount: 13000, popularity: 42.7, runtime: 86, genreIds: [16, 14, 10751] },
  { id: 39, title: "V字仇杀队", originalTitle: "V for Vendetta", overview: "在未来极权统治的英国，神秘面具人V开始了一场推翻政府的革命。他救出了被政府迫害的伊芙，并邀请她一起改变这个国家。", posterPath: "/njeSJ7X7GnY2rwSq6ab6Qk1lI7R.jpg", backdropPath: "/oYsILSmMqAOs2Sq8mn6YKBfYWCW.jpg", releaseDate: "2005-12-11", voteAverage: 8.1, voteCount: 17000, popularity: 53.4, runtime: 132, genreIds: [28, 18, 878] },
  { id: 40, title: "流浪地球", originalTitle: "The Wandering Earth", overview: "太阳即将膨胀毁灭，人类在地球表面建造了巨大的推进器，开启了长达2500年的星际流浪之旅。在途经木星时，地球面临被撕裂的危机。", posterPath: "/b0aEUBUvYMStAAMyM60QNRB1YWK.jpg", backdropPath: "/n4v2jN1WF5QDpfPQOvpHM6GqqJX.jpg", releaseDate: "2019-02-05", voteAverage: 7.9, voteCount: 9000, popularity: 43.8, runtime: 125, genreIds: [28, 878, 12] },
];

const castMembers = [
  { id: 101, name: "蒂姆·罗宾斯", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 102, name: "摩根·弗里曼", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 103, name: "张国荣", profilePath: "/5b5x5Q5b5Q5A4f0xOQ5BQq5QH5W.jpg" },
  { id: 104, name: "张丰毅", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 105, name: "马修·麦康纳", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 106, name: "安妮·海瑟薇", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 107, name: "莱昂纳多·迪卡普里奥", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 108, name: "凯特·温丝莱特", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 109, name: "渡边谦", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 110, name: "希斯·莱杰", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 111, name: "汤姆·汉克斯", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 112, name: "罗宾·怀特", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 113, name: "拉尔夫·费因斯", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 114, name: "姜文", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 115, name: "葛优", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 116, name: "金·凯瑞", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 117, name: "本·贝尔特", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 118, name: "伊德里斯·艾尔巴", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 119, name: "阿米尔·汗", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 120, name: "梁朝伟", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 121, name: "徐峥", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 122, name: "盖尔·加西亚·贝纳尔", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 123, name: "范·迪塞尔", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 124, name: "神木隆之介", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 125, name: "马龙·白兰度", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 126, name: "周星驰", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 127, name: "小罗伯特·唐尼", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 128, name: "罗伯托·贝尼尼", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 129, name: "威尔·史密斯", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 130, name: "宋康昊", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 131, name: "让·雷诺", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 132, name: "娜塔莉·波特曼", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 133, name: "周星驰", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 134, name: "伊尔凡·汗", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 135, name: "拉尔夫·费因斯", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 136, name: "维果·莫特森", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 137, name: "布拉德·皮特", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 138, name: "爱德华·诺顿", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 139, name: "日高法子", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 140, name: "雨果·维文", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
  { id: 141, name: "吴京", profilePath: "/A4f0xOQ5BQq5QH5W5b5x5Q5b5Q5.jpg" },
  { id: 142, name: "屈楚萧", profilePath: "/oIciQrFd4Tk5hR5n5b5x5Q5b5Q5.jpg" },
];

async function main() {
  console.log("=== 电影模拟数据播种器 ===\n");

  // Clear existing data
  await prisma.movieCast.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.cast.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();

  // Seed genres
  console.log("正在播种电影类型...");
  for (const genre of genres) {
    await prisma.genre.create({ data: genre });
  }
  console.log(`  ✓ ${genres.length} 个类型已添加`);

  // Seed movies
  console.log("正在播种电影...");
  for (const movie of mockMovies) {
    const { genreIds, ...movieData } = movie;
    await prisma.movie.create({ data: movieData });
    // Add genre relations
    for (const genreId of genreIds) {
      await prisma.movieGenre.create({
        data: { movieId: movie.id, genreId },
      });
    }
  }
  console.log(`  ✓ ${mockMovies.length} 部电影已添加`);

  // Seed cast
  console.log("正在播种演员...");
  for (const cast of castMembers) {
    await prisma.cast.create({ data: cast });
  }
  console.log(`  ✓ ${castMembers.length} 位演员已添加`);

  // Add cast to movies
  console.log("正在关联演员与电影...");
  let castCount = 0;
  for (const movie of mockMovies) {
    const castForMovie = castMembers.slice(0, 3 + Math.floor(Math.random() * 3));
    for (let i = 0; i < castForMovie.length; i++) {
      await prisma.movieCast.create({
        data: {
          movieId: movie.id,
          castId: castForMovie[i].id,
          role: i === 0 ? "director" : "actor",
          characterName: `角色${i + 1}`,
          sortOrder: i,
        },
      });
      castCount++;
    }
  }
  console.log(`  ✓ ${castCount} 个演职关联已添加`);

  // Summary
  console.log("\n=== 播种完成 ===");
  console.log(`  电影类型: ${genres.length}`);
  console.log(`  电影: ${mockMovies.length}`);
  console.log(`  演员: ${castMembers.length}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("播种失败:", e);
  process.exit(1);
});
