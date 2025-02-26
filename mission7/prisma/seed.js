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
