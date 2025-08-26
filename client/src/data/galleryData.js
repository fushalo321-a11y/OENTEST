// 갤러리 데이터 - 홈페이지와 갤러리 페이지에서 공유
export const galleryItems = [
  {
    id: 1,
    title: "몇주간 간만에 재밌었다 좋은작품으로 다시와라",
    category: "파인 촌뜨기들(드라마)",
    date: "08-14",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=200&fit=crop&crop=faces",
    description: "드라마 촬영 현장에서의 즐거운 순간들을 담은 사진입니다.",
    views: 156
  },
  {
    id: 2,
    title: "울 개 여의주 물었다",
    category: "멍멍이",
    date: "08-14",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop&crop=faces",
    description: "귀여운 강아지가 장난감을 물고 있는 모습입니다.",
    views: 89
  },
  {
    id: 3,
    title: "마 함 해보자는기가",
    category: "멍멍이",
    date: "08-13",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop&crop=faces",
    description: "고양이가 호기심 어린 표정으로 바라보는 모습입니다.",
    views: 234
  },
  {
    id: 4,
    title: "또 슬슬 여론조성 시작하네 ㅋㅋㅋㅋ 대단하다 사사방 ㅋㅋㅋ",
    category: "삼성 라이온즈",
    date: "08-14",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&crop=faces",
    description: "야구 경기에서의 흥미로운 순간을 포착한 사진입니다.",
    views: 178
  },
  {
    id: 5,
    title: "경기 끝나고 방긋 웃는 구자욱",
    category: "삼성 라이온즈",
    date: "08-14",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&crop=faces",
    description: "경기 후 선수들의 밝은 표정을 담은 사진입니다.",
    views: 92
  },
  {
    id: 6,
    title: "안스는 자랑해야 마땅하다",
    category: "식물",
    date: "08-14",
    image: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=300&h=200&fit=crop&crop=faces",
    description: "아름다운 식물의 생명력을 보여주는 사진입니다.",
    views: 145
  }
];

// 홈페이지용 갤러리 데이터 (상위 6개만)
export const getHomeGalleryData = () => {
  return galleryItems.slice(0, 6).map(item => ({
    ...item,
    image: item.image.replace('w=300&h=200', 'w=400&h=400') // 홈페이지용 이미지 크기 조정
  }));
}; 