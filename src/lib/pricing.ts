export interface Plan {
  id: string;
  name: string;
  price: number; // 人民币（元）
  days: number;
  description: string;
  badge: string;
}

export const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "月度会员",
    price: 19.9,
    days: 30,
    description: "适合偶尔看电影的你",
    badge: "基础",
  },
  {
    id: "yearly",
    name: "年度会员",
    price: 199,
    days: 365,
    description: "资深影迷首选，省更多",
    badge: "热门",
  },
  {
    id: "forever",
    name: "永久会员",
    price: 499,
    days: 36500, // 100年≈永久
    description: "一次付费，终身使用",
    badge: "超值",
  },
];
