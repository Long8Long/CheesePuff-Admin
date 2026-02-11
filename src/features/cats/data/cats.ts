import { faker } from '@faker-js/faker'
import type { Cat } from './schema'
import { breeds } from './data'

faker.seed(12345)

// 猫咪名称列表
const catNames = [
  '小花', '大白', '汤圆', '布丁', '雪球', '奶茶', '咖啡', '奥利奥',
  '芝麻', '奶糖', '豆豆', '毛毛', '球球', '咪咪', '小白', '小黑',
  '可乐', '雪碧', '七喜', '芬达', '佳得乐', '红牛', '王老吉', '加多宝',
  '金毛', '银狐', '玉兔', '麒麟', '凤凰', '龙猫', '虎皮', '斑纹',
  '花花', '点点', '星星', '月亮', '太阳', '彩虹', '云朵', '微风',
  '闪电', '雷霆', '风暴', '雪花', '冰雹', '霜冻', '雾气', '露珠',
  '琥珀', '水晶', '钻石', '珍珠', '玛瑙', '珊瑚', '翡翠', '玉石',
  '棉花', '丝绸', '天鹅绒', '蕾丝', '缎带', '锦缎', '羊毛', '皮革',
]

// 猫咪描述模板
const descriptions = [
  '一只非常温顺的猫咪，喜欢被人抚摸，适合陪伴。',
  '性格活泼好动，喜欢玩耍，需要有足够的空间活动。',
  '比较内向，需要时间适应新环境，但熟悉后非常亲人。',
  '独立性强，不喜欢被过度打扰，适合有经验的主人。',
  '非常聪明，可以学会一些简单的指令和游戏。',
  '食量较大，需要注意控制饮食，防止肥胖。',
  '毛发光泽柔软，需要定期梳理，保持美观。',
  '好奇心强，喜欢探索周围的环境，需要留意安全。',
  '叫声甜美，喜欢与人交流，非常适合家庭饲养。',
  '优雅高贵的气质，举止优雅，是完美的伴侣宠物。',
  '已完成疫苗接种，健康状况良好。',
  '性格温和，与其他猫咪相处融洽。',
  '喜欢晒太阳，经常在窗台休息。',
  '有点挑食，需要耐心选择合适的食物。',
  '非常粘人，喜欢跟随主人到处走动。',
  '睡姿可爱，经常做出各种有趣的表情。',
]

// 生成随机日期（过去 1-5 年）
function randomBirthday(): string {
  const now = new Date()
  const yearsAgo = faker.number.int({ min: 1, max: 5 })
  const daysAgo = faker.number.int({ min: 0, max: 365 })
  const birthday = new Date(now)
  birthday.setFullYear(birthday.getFullYear() - yearsAgo)
  birthday.setDate(birthday.getDate() - daysAgo)
  return birthday.toISOString().split('T')[0]
}

// 生成图片 URL（使用占位图服务）
function generateCatImage(catId: string, index: number): string {
  // 使用 placecats.com 或 loremflickr 作为占位图
  return `https://loremflickr.com/400/400/cat,${catId}_${index}?lock=${catId.length + index}`
}

// 生成单条猫咪数据
function generateCat(id: number): Cat {
  const idStr = `cat_${String(id).padStart(3, '0')}`
  const breed = faker.helpers.arrayElement(breeds).value
  const birthday = randomBirthday()
  const price = faker.number.int({ min: 500, max: 10000 })

  // 生成 1-3 张图片
  const imageCount = faker.number.int({ min: 1, max: 3 })
  const images = Array.from({ length: imageCount }, (_, i) =>
    generateCatImage(idStr, i)
  )

  return {
    id: idStr,
    name: faker.helpers.arrayElement(catNames),
    breed,
    birthday,
    price,
    images,
    thumbnail: images[0],
    description: faker.helpers.arrayElement(descriptions),
    catcafeStatus: faker.helpers.arrayElement([
      'working',
      'resting',
      'sick',
      'retired',
      'pregnant',
      'nursing',
    ]),
    visible: faker.datatype.boolean(0.9), // 90% 可见
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  }
}

// 生成 50 条猫咪数据
export const cats: Cat[] = Array.from({ length: 50 }, (_, i) =>
  generateCat(i + 1)
)
