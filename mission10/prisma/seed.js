import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const mockUsers = [
  {
    email: "user1@example.com",
    password: "password123",
    nickname: "테스트유저1",
  },
  {
    email: "user2@example.com",
    password: "password123",
    nickname: "테스트유저2",
  },
];

const mockProducts = [
  {
    name: "아이폰 15 Pro",
    description:
      "애플 최신 스마트폰 아이폰 15 Pro 256GB 티타늄 색상입니다. 구매 후 1개월 사용했으며 상태 매우 좋습니다.",
    price: 1350000,
    tags: ["전자기기", "스마트폰", "애플", "아이폰"],
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a15a13426f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1695653422259-8a74ffe90bf6?w=800&h=600&fit=crop",
    ],
    favorites: 25,
  },
  {
    name: "갤럭시 S23 울트라",
    description:
      "삼성전자 갤럭시 S23 울트라 512GB 그린 색상입니다. 풀박스 있고 케이스 함께 드립니다.",
    price: 1050000,
    tags: ["전자기기", "스마트폰", "삼성", "갤럭시"],
    images: [
      "https://images.unsplash.com/photo-1675873671405-7129f67da54a?w=800&h=600&fit=crop",
    ],
    favorites: 18,
  },
  {
    name: "맥북 프로 16인치 M2",
    description:
      "2023년형 맥북 프로 16인치 M2 프로 32GB RAM 1TB SSD 스페이스 그레이입니다. 애케어 플러스 가입되어 있습니다.",
    price: 2850000,
    tags: ["전자기기", "노트북", "애플", "맥북"],
    images: [
      "https://images.unsplash.com/photo-1636211990414-8edec17ba047?w=800&h=600&fit=crop",
    ],
    favorites: 32,
  },
  {
    name: "LG 그램 17인치",
    description:
      "LG 그램 17인치 최신형 i7 16GB RAM 512GB SSD입니다. 배터리 성능 좋고 무게가 가벼워 휴대성이 좋습니다.",
    price: 1650000,
    tags: ["전자기기", "노트북", "LG", "그램"],
    images: [
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&h=600&fit=crop",
    ],
    favorites: 14,
  },
  {
    name: "아이패드 프로 12.9",
    description:
      "아이패드 프로 12.9인치 최신형 M2 칩셋, 256GB 스페이스 그레이입니다. 애플펜슬 2세대 포함입니다.",
    price: 1250000,
    tags: ["전자기기", "태블릿", "애플", "아이패드"],
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop",
    ],
    favorites: 22,
  },
  {
    name: "삼성 갤럭시 워치 6",
    description:
      "삼성 갤럭시 워치 6 클래식 블랙 47mm LTE 모델입니다. 3개월 사용했고 상태 좋습니다.",
    price: 280000,
    tags: ["전자기기", "스마트워치", "삼성", "갤럭시"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
    ],
    favorites: 8,
  },
  {
    name: "소니 WH-1000XM5",
    description:
      "소니 WH-1000XM5 노이즈캔슬링 헤드폰 블랙 색상입니다. 구매 후 2개월 사용했으며 깨끗합니다.",
    price: 320000,
    tags: ["전자기기", "헤드폰", "소니"],
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=600&fit=crop",
    ],
    favorites: 12,
  },
  {
    name: "다이슨 에어랩",
    description:
      "다이슨 에어랩 컴플리트 롱 에디션입니다. 모든 액세서리 포함, 상태 좋습니다.",
    price: 420000,
    tags: ["가전", "헤어", "다이슨"],
    images: [
      "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800&h=600&fit=crop",
    ],
    favorites: 29,
  },
  {
    name: "닌텐도 스위치 OLED",
    description:
      "닌텐도 스위치 OLED 화이트 모델입니다. 게임 젤다의 전설, 마리오 카트 8 포함합니다.",
    price: 380000,
    tags: ["전자기기", "게임기", "닌텐도", "스위치"],
    images: [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&h=600&fit=crop",
    ],
    favorites: 15,
  },
  {
    name: "캐논 EOS R6",
    description:
      "캐논 미러리스 카메라 EOS R6 바디입니다. 셔터 수 5천회 미만, 풀박스 구성품 모두 있습니다.",
    price: 2100000,
    tags: ["전자기기", "카메라", "캐논"],
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
    ],
    favorites: 20,
  },
  {
    name: "애플워치 울트라 2",
    description:
      "애플워치 울트라 2 티타늄 케이스 49mm GPS + 셀룰러 모델입니다. 알파인 루프 밴드 포함.",
    price: 950000,
    tags: ["전자기기", "스마트워치", "애플"],
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=600&fit=crop",
    ],
    favorites: 17,
  },
  {
    name: "발뮤다 토스터",
    description:
      "발뮤다 토스터 블랙 색상입니다. 거의 사용하지 않은 새 제품 수준입니다.",
    price: 180000,
    tags: ["가전", "주방", "발뮤다", "토스터"],
    images: [
      "https://images.unsplash.com/photo-1565363887715-8884629e09ee?w=800&h=600&fit=crop",
    ],
    favorites: 9,
  },
  {
    name: "소니 플레이스테이션 5",
    description:
      "소니 PS5 디스크 에디션입니다. 컨트롤러 2개, 게임 3개 포함합니다.",
    price: 520000,
    tags: ["전자기기", "게임기", "소니", "플레이스테이션"],
    images: [
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop",
    ],
    favorites: 24,
  },
  {
    name: "필립스 휴 조명세트",
    description:
      "필립스 휴 스타터 키트입니다. 브리지 1개, 컬러 전구 3개로 구성되어 있습니다.",
    price: 150000,
    tags: ["가전", "조명", "필립스", "스마트홈"],
    images: [
      "https://images.unsplash.com/photo-1563461661004-ba6c35340be4?w=800&h=600&fit=crop",
    ],
    favorites: 11,
  },
  {
    name: "나이키 에어맥스 97",
    description:
      "나이키 에어맥스 97 실버 불릿 사이즈 270입니다. 2번 신어서 상태 매우 좋습니다.",
    price: 180000,
    tags: ["패션", "신발", "나이키", "에어맥스"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
    ],
    favorites: 16,
  },
  {
    name: "자라 남성 코트",
    description:
      "자라 남성 울 코트 블랙 색상 L 사이즈입니다. 작년 겨울에 구매해서 몇 번 안 입었습니다.",
    price: 120000,
    tags: ["패션", "의류", "자라", "코트"],
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=600&fit=crop",
    ],
    favorites: 7,
  },
  {
    name: "구찌 반지갑",
    description:
      "구찌 마몬트 반지갑 블랙 색상입니다. 정품 보증서, 케이스 있습니다.",
    price: 480000,
    tags: ["패션", "잡화", "구찌", "지갑"],
    images: [
      "https://images.unsplash.com/photo-1612015670817-0127d21628d4?w=800&h=600&fit=crop",
    ],
    favorites: 21,
  },
  {
    name: "몽블랑 볼펜",
    description:
      "몽블랑 마이스터스튁 클래식 볼펜입니다. 사용감 있으나 상태 좋습니다.",
    price: 290000,
    tags: ["패션", "문구", "몽블랑", "필기구"],
    images: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&h=600&fit=crop",
    ],
    favorites: 13,
  },
  {
    name: "레고 스타워즈 밀레니엄 팔콘",
    description:
      "레고 스타워즈 UCS 밀레니엄 팔콘 75192입니다. 미개봉 새제품입니다.",
    price: 1200000,
    tags: ["취미", "레고", "스타워즈"],
    images: [
      "https://images.unsplash.com/photo-1518331483807-f6adb0e1ad23?w=800&h=600&fit=crop",
    ],
    favorites: 28,
  },
  {
    name: "아디다스 삼바 클래식",
    description:
      "아디다스 삼바 클래식 화이트/블랙 사이즈 265입니다. 한 번 신었습니다.",
    price: 130000,
    tags: ["패션", "신발", "아디다스", "삼바"],
    images: [
      "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=800&h=600&fit=crop",
    ],
    favorites: 19,
  },
  {
    name: "메종 마르지엘라 향수",
    description:
      "메종 마르지엘라 레이지 선데이 모닝 향수 100ml입니다. 30ml 정도 사용했습니다.",
    price: 150000,
    tags: ["뷰티", "향수", "마르지엘라"],
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=600&fit=crop",
    ],
    favorites: 10,
  },
  {
    name: "보스 사운드링크 미니",
    description:
      "보스 사운드링크 미니 2 블루투스 스피커입니다. 배터리 상태 양호합니다.",
    price: 120000,
    tags: ["전자기기", "스피커", "보스"],
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=600&fit=crop",
    ],
    favorites: 14,
  },
  {
    name: "라코스테 폴로 셔츠",
    description:
      "라코스테 클래식 폴로 셔츠 네이비 색상 L 사이즈입니다. 2번 착용했습니다.",
    price: 70000,
    tags: ["패션", "의류", "라코스테", "셔츠"],
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&h=600&fit=crop",
    ],
    favorites: 6,
  },
  {
    name: "스타벅스 텀블러 한정판",
    description:
      "스타벅스 크리스마스 한정판 텀블러 473ml입니다. 미사용 새제품입니다.",
    price: 45000,
    tags: ["주방", "텀블러", "스타벅스"],
    images: [
      "https://images.unsplash.com/photo-1577037834513-812e0e63978f?w=800&h=600&fit=crop",
    ],
    favorites: 8,
  },
  {
    name: "샤넬 립스틱 세트",
    description:
      "샤넬 루쥬 알뤼르 립스틱 3종 세트입니다. 각각 1-2번씩 사용했습니다.",
    price: 120000,
    tags: ["뷰티", "화장품", "샤넬", "립스틱"],
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=600&fit=crop",
    ],
    favorites: 23,
  },
  {
    name: "롤렉스 데이토나",
    description:
      "롤렉스 데이토나 116500LN 흰색판 입니다. 풀박스, 보증서 있습니다.",
    price: 23500000,
    tags: ["패션", "시계", "롤렉스", "데이토나"],
    images: [
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&h=600&fit=crop",
    ],
    favorites: 45,
  },
  {
    name: "루이비통 네버풀 MM",
    description:
      "루이비통 모노그램 네버풀 MM 토트백입니다. 상태 좋고 정품 보증서 있습니다.",
    price: 1350000,
    tags: ["패션", "가방", "루이비통"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=600&fit=crop",
    ],
    favorites: 33,
  },
  {
    name: "서핑보드 토치 피쉬",
    description:
      "토치 피쉬 5'10\" 서핑보드입니다. 1년 사용했으며 상태 좋습니다.",
    price: 580000,
    tags: ["스포츠", "서핑", "서핑보드"],
    images: [
      "https://images.unsplash.com/photo-1531722569936-825d3dd91b15?w=800&h=600&fit=crop",
    ],
    favorites: 14,
  },
  {
    name: "캠핑 텐트 4인용",
    description: "콜맨 선라이즈 4인용 텐트입니다. 2번 사용했으며 깨끗합니다.",
    price: 220000,
    tags: ["스포츠", "캠핑", "텐트", "콜맨"],
    images: [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop",
    ],
    favorites: 18,
  },
];

const mockArticles = [
  {
    title: "첫 번째 여행 후기",
    content:
      "제주도 여행을 다녀왔습니다. 정말 아름다운 자연과 맛있는 음식들이 인상적이었어요.",
    imageUrl:
      "https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?w=800&h=400&fit=crop",
    likes: 15,
  },
  {
    title: "맛집 추천: 강남 파스타",
    content: "강남에서 발견한 숨은 맛집! 수제 파스타가 정말 맛있었습니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1597393353415-b3730f3719fe?w=800&h=400&fit=crop",
    likes: 8,
  },
  {
    title: "새로 산 노트북 리뷰",
    content:
      "이번에 새로 산 노트북 사용 후기입니다. 성능도 좋고 디자인도 마음에 들어요.",
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop",
    likes: 12,
  },
  {
    title: "주말 등산 다녀왔어요",
    content: "북한산 등산 후기입니다. 날씨도 좋고 공기도 맑아서 정말 좋았어요.",
    imageUrl:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop",
    likes: 20,
  },
  {
    title: "신규 카페 방문 후기",
    content: "동네에 새로 생긴 카페를 방문했습니다. 분위기가 너무 좋네요.",
    imageUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop",
    likes: 5,
  },
  {
    title: "봄 꽃구경 다녀왔어요",
    content: "여의도 벚꽃 축제에 다녀왔습니다. 올해는 꽃이 더 예쁘게 폈네요.",
    imageUrl:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=400&fit=crop",
    likes: 25,
  },
  {
    title: "홈트레이닝 꿀팁",
    content: "집에서 할 수 있는 효과적인 운동 방법을 공유합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=400&fit=crop",
    likes: 18,
  },
  {
    title: "주말 브런치 맛집",
    content: "서울 연남동에서 발견한 브런치 맛집 소개합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=800&h=400&fit=crop",
    likes: 14,
  },
  {
    title: "독서 모임 후기",
    content:
      "매주 토요일 독서 모임에 참여하고 있습니다. 새로운 시각을 배우는 즐거움이 있어요.",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop",
    likes: 7,
  },
  {
    title: "반려견과의 산책",
    content: "우리 동네 반려견 산책하기 좋은 코스를 공유합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=400&fit=crop",
    likes: 22,
  },
  {
    title: "집밥 레시피",
    content: "간단하지만 맛있는 김치찌개 만드는 방법을 공유합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=400&fit=crop",
    likes: 16,
  },
  {
    title: "취미로 시작한 그림",
    content: "독학으로 시작한 그림 그리기 6개월 차 근황입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=400&fit=crop",
    likes: 9,
  },
  {
    title: "제주도 맛집 리스트",
    content: "제주도 여행에서 발견한 숨은 맛집들을 소개합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=400&fit=crop",
    likes: 30,
  },
  {
    title: "식물 키우기 일기",
    content: "집에서 키우는 반려식물들의 성장 일기입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=400&fit=crop",
    likes: 11,
  },
  {
    title: "직장인 점심 추천",
    content: "회사 근처에서 발견한 점심 맛집들을 소개합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&h=400&fit=crop",
    likes: 13,
  },
  {
    title: "주말 전시회 관람",
    content: "현대미술관에서 열린 특별전시 관람 후기입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=400&fit=crop",
    likes: 6,
  },
  {
    title: "신규 영화 리뷰",
    content: "이번 주말에 본 새로 개봉한 영화 후기입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop",
    likes: 17,
  },
  {
    title: "가을 단풍 명소",
    content: "서울 근교 단풍 구경하기 좋은 장소들을 소개합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1507783548227-544c3b8fc065?w=800&h=400&fit=crop",
    likes: 24,
  },
  {
    title: "홈카페 도전기",
    content: "집에서 만드는 맛있는 커피 레시피를 공유합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop",
    likes: 19,
  },
  {
    title: "주말 드라이브 코스",
    content: "수도권 근교 드라이브 코스 추천드립니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=400&fit=crop",
    likes: 21,
  },
];

async function main() {
  try {
    // 기존 데이터 삭제
    console.log("기존 데이터 삭제 중...");
    await prisma.productFavorite.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    console.log("기존 데이터 삭제 완료");

    // 사용자 생성
    console.log("사용자 생성 중...");
    const users = await Promise.all(
      mockUsers.map((user) => prisma.user.create({ data: user }))
    );
    console.log("사용자 생성 완료");

    // 게시글 생성
    console.log("게시글 생성 중...");
    await Promise.all(
      mockArticles.map((article, index) =>
        prisma.article.create({
          data: {
            ...article,
            author: {
              connect: { id: users[index % users.length].id },
            },
          },
        })
      )
    );
    console.log("게시글 생성 완료");

    // 상품 생성
    console.log("상품 생성 중...");
    await Promise.all(
      mockProducts.map((product, index) =>
        prisma.product.create({
          data: {
            ...product,
            author: {
              connect: { id: users[index % users.length].id },
            },
          },
        })
      )
    );
    console.log("상품 생성 완료");

    console.log("모든 데이터 생성이 완료되었습니다.");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
