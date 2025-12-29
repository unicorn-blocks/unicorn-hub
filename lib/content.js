// lib/content.js
// 集中管理所有页面的文字内容

export const translations = {
  en: {
    meta: {
      title: 'Unicorn Blocks | Not Just Stacking, Creating!',
      description:
        'Meet Sparky, the magical block buddy that turns every build into a story. Spark creativity, unlock STEAM skills, and keep playtime screen-free with uncompromising privacy.',
      keywords:
        'Sparky, Unicorn Blocks, STEM toys, STEAM learning, creative play, AI toys, educational building blocks, privacy-first kids tech'
    },
    hero: {
      title: {
        primary: 'Not Just Stacking',
        accent: 'Creating!'
      },
      description: 'Meet Sparky：The magical block buddy',
      descriptionLine2: 'who turns every build into a story',
      badges: [
        { label: 'Compatible with LEGO®', icon: '/assets/image/Vector_17_1381.png' },
        { label: "For Age 3-8", icon: '/assets/image/Vector_17_1385.png' }
      ],
      speechBubble: "Hi! I'm Sparky!"
    },
    steps: {
      heading: 'Spark Creativity',
      headingLine2: 'Through Adventure',
      subheading: 'With Sparky, Kids Create, Parents Relax.',
      cards: [
        {
          title: 'Pick To Start',
          description: 'Pick a Magic Hat. Snap on the hat to unlock the world.',
          background: '#D8CBFF',
          image: '/assets/ks_pic/space.png',
          mobileImage: '/assets/ima/section2-1.png'
        },
        {
          title: 'Story Sparks Creation',
          description: 'Every build is part of a Story.',
          background: '#FFD7D0',
          image: '/assets/ks_pic/room.png',
          mobileImage: '/assets/ima/section2-2.png'
        },
        {
          title: 'Create & Understand',
          description: 'Build and show your creation to Sparky.',
          background: '#FFE7B2',
          image: '/assets/ks_pic/App-1.png',
          mobileImage: '/assets/ima/section2-3.png'
        },
        {
          title: 'The Adventure Continues',
          description: 'The Magic Hat and Block light up to celebrate success!',
          background: '#CFEFD5',
          image: '/assets/ks_pic/App-2.png',
          mobileImage: '/assets/ima/section2-4.png'
        }
      ]
    },
    kit: {
      heading: 'Everything to Build the Magic.',
      subheading: "Meet Sparky's Adventure Kit:",
      button: 'Book Now',
      media: '/assets/reserve-vip-spot/adventure-kit.svg',
      mediaAlt: 'Sparky adventure kit illustration',
      categories: [
        {
          title: 'Magical Block Buddy: Sparky',
          highlights: [
            'Story Sparks Creation — The Magical Block Buddy that turns every build into a story.',
            'Magic Window — Sees and understands every creative build.',
            'Smart Brain — Adapts stories to Age (3-8) & Interests.',
            'Privacy Button — Press to talk. Eyes & ears closed when off.',
            '7-Hour Playtime — Long-lasting creative sessions.'
          ]
        },
        {
          title: 'The Magic Hats: 4x Magical Theme Hats',
          highlights: [
            'Themes — Magic, Knight, Princess, Vehicle, Animal, Flowers, Fantasy, Buildings.',
            'Creative Journey — Packed with 30+ stories per hat! Start with 6 Guided Stories to learn the basics, then unlock "Creator Mode" for infnite challenges!'
          ]
        },
        {
          title: 'The Magic Blocks: 4x Light-Up Magical Blocks',
          highlights: [
            'Theme Matched — Each block pairs specifically with one Magic Hat.',
            'The Magical Prize — Unlocks upon reaching "Creator Mode"—use this glowing magical block to light up your own infnite creations!'
          ]
        },
        {
          title: '100 Universal Blocks',
          highlights: [
            'Limitless Play — Compatible with LEGO® & major brands.',
            'Kid-Proof — BPA-Free, CPC/FCC Certified. Safe & Durable.'
          ]
        }
      ]
    },
    family: {
      heading: 'Our Family Says',
      testimonials: [
        {
          quote: '"So much better than watching TV."',
          author: '—Dad of 3-Year- Old'
        },
        {
          quote:
           "\"I love that Sparky doesn't 'correct' him. If he says it's a rocket, Sparky sees a rocket. It really protects his imagination.\"",
          author: '—Mom of 5-Year-Old'
        },
        {
          quote:
            '"Pleeease, just five more minutes! I have to light up all the lights on Sparky\'s hat!"',
          author: '—Our Little Builder, 5'
        }
      ]
    },
    privacy: {
      subheading: "Your Child's Data. Yours Alone.",
      tag: 'COPPA Compliant by Design',
      cards: [
        {
          title: 'All Data Stays Yours',
          description:
            'Data is automatically wiped and NEVER exposed to third parties. You can permanently delete any history instantly via the app.'
        },
        {
          title: 'No Eavesdropping. Ever',
          description:
            'Physically OFF until you press. Mic & Camera are hard-wired to stay OFF. They cannot see or hear a thing until you actively hold the button.'
        },
        {
          title: 'No Third-Party Ads',
          description:
            'A 100% Pure Play Zone. Contains no third-party ads, no tracking, and no stranger interaction.'
        }
      ]
    },
    impact: {
      heading: '3x Creativity. 90 Mins Focus. Real STEAM Skills',
      stats: [
        {
          title: '3x Creativity Boost',
          description:
            'From simple stacks to complex masterpieces. Testers show a 3x increase in complexity, using more colors, bolder shapes, and richer details than ever before.'
        },
        {
          title: '90 Mins Deep Focus',
          description:
            "Kids build wonderlands. Parents make coffee. Average play time extends to 90 minutes (vs. the usual 15). That's deep flow state for them, and well deserved downtime for you."
        },
        {
          title: 'STEAM & Problem Solving',
          description:
            'Learning engineering without knowing it. Sparky guides them to solve structural problems to advance the story. They learn physics and math naturally while saving the day.'
        }
      ]
    },
    story: {
      heading: 'From Dreamers to Builders',
      cards: [
        {
          title: 'The Team',
          description:
            '"As kids, we pretended our toys were alive. Now, we use our engineering minds to finally build them, turning the magic we once only imagined into reality for the next generation."',
          avatars: ['Bruce', 'Bryan']
        },
        {
          title: 'The Science',
          description:
            'Collaborating with Top Minds. We partnered with engineers and researchers from UPenn, Purdue, and other top universities to craft a play experience that is joyful and positive, ensuring kids love every moment of the adventure.'
        }
      ],
      milestones: [
        {
          title: 'Verified By 100+ Kids',
          subtitle: 'Refined over 1 year of beta testing'
        },
        {
          title: '40-Year Factory Partner',
          subtitle: 'Industrial-grade quality secured'
        },
        {
          title: 'On Schedule',
          subtitle: 'Shipping Jun 2026'
        }
      ]
    },
    faq: {
      heading: 'Frequently Asked Questions',
      items: [
        {
          question: 'What age is Unicorn Blocks suitable for?',
          answer:
            'Unicorn Blocks is perfectly designed for children aged 3 to 8 years old. The content adapts to their growing skills.'
        },
        {
          question: 'Do I need a subscription?',
          answer:
            'No subscription is required. Once you reserve your adventure kit, Sparky tells stories, tracks progress, and unlocks Creator Mode without hidden fees.'
        },
        {
          question: 'Is it safe for my child?',
          answer:
            'Every block is BPA-free, CPC/FCC certified, and paired with privacy-first voice controls. Parents stay in control from day one.'
        }
      ]
    },
    messages: {
      emailError: 'Please provide a valid email address',
      subscribeSuccess: 'Thank you for subscribing!',
      subscribeFailed: 'Subscription failed, please try again later',
      connectionError: 'Error connecting to server, please try again later'
    }
  },
  zh: {
    // 中文翻译（暂时保留英文，后续可以添加中文翻译）
    meta: {
      title: 'Unicorn Blocks | 不只是堆叠，而是创造！',
      description:
        '认识Sparky，神奇的积木伙伴，将每次搭建变成一个故事。激发创造力，解锁STEAM技能，保持无屏幕游戏时间，隐私保护不妥协。',
      keywords:
        'Sparky, 独角兽积木, STEM玩具, STEAM学习, 创意游戏, AI玩具, 教育积木, 隐私优先儿童科技'
    },
    hero: {
      title: {
        primary: '不只是堆叠',
        accent: '而是创造！'
      },
      description: '认识Sparky：神奇的积木伙伴',
      descriptionLine2: '将每次搭建变成一个故事',
      badges: [
        { label: '兼容乐高®', icon: '/assets/image/Vector_17_1381.png' },
        { label: "适合3-8岁", icon: '/assets/image/Vector_17_1385.png' }
      ],
      speechBubble: "嗨！我是Sparky！"
    },
    // ... 其他中文翻译可以后续添加
  }
};

/**
 * 获取指定语言的翻译内容
 * @param {string} language - 语言代码 ('en' 或 'zh')
 * @returns {object} 翻译内容对象
 */
export function getTranslations(language) {
  return translations[language] || translations.en;
}

/**
 * 获取指定section的内容
 * @param {string} language - 语言代码
 * @param {string} section - section名称 (如 'hero', 'steps', 'kit' 等)
 * @returns {object} section内容对象
 */
export function getSectionContent(language, section) {
  const trans = getTranslations(language);
  return trans[section] || {};
}

/**
 * 获取Steps Section的移动端图片
 * @param {number} index - 卡片索引 (0-3)
 * @returns {string} 移动端图片路径
 */
export function getStepsMobileImage(index) {
  const mobileImages = [
    '/assets/ima/section2-1.png',
    '/assets/ima/section2-2.png',
    '/assets/ima/section2-3.png',
    '/assets/ima/section2-4.png'
  ];
  return mobileImages[index] || mobileImages[0];
}

/**
 * 获取Impact Section的移动端图片
 * @param {number} index - 卡片索引 (0-2)
 * @returns {string} 移动端图片路径
 */
export function getImpactMobileIcon(index) {
  const mobileIcons = [
    '/assets/ima/section6-1.svg',
    '/assets/ima/section6-2.svg',
    '/assets/ima/section6-3.svg'
  ];
  return mobileIcons[index] || mobileIcons[0];
}

/**
 * 获取Story Section的移动端图片
 * @param {number} index - 卡片索引 (0-1)
 * @returns {string} 移动端图片路径
 */
export function getStoryMobileImage(index) {
  const mobileImages = [
    '/assets/ima/section7-1.png',
    '/assets/ima/section7-2.png'
  ];
  return mobileImages[index] || mobileImages[0];
}

/**
 * 获取Privacy Section的图标
 * @param {number} index - 卡片索引 (0-2)
 * @returns {string} 图标路径
 */
export function getPrivacyIcon(index) {
  const icons = [
    '/assets/ima/section5-11.svg',
    '/assets/ima/section5-22.svg',
    '/assets/ima/section5-33.svg'
  ];
  return icons[index] || icons[0];
}

/**
 * 获取Kit Section的图标
 * @param {number} index - 卡片索引 (0-3)
 * @returns {string} 图标路径
 */
export function getKitIcon(index) {
  const icons = [
    '/assets/ima/section3-1.svg',
    '/assets/ima/section3-2.svg',
    '/assets/ima/section3-3.svg',
    '/assets/ima/section3-4.svg'
  ];
  return icons[index] || icons[0];
}

/**
 * 获取Kit Section的新标题
 * @param {number} index - 卡片索引 (0-3)
 * @returns {string} 新标题
 */
export function getKitTitle(index) {
  const titles = [
    'Magical Buddy',
    'Magic Hats',
    'Magic Blocks',
    '100 Universal Blocks'
  ];
  return titles[index] || titles[0];
}

// 导出默认对象
export default {
  translations,
  getTranslations,
  getSectionContent,
  getStepsMobileImage,
  getImpactMobileIcon,
  getStoryMobileImage,
  getPrivacyIcon,
  getKitIcon,
  getKitTitle
};
