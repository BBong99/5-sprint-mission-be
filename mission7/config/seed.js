import { pool } from "./db.js";

export const seedDatabase = async () => {
  try {
    // 상품 시드 데이터
    const productsSeed = `
      INSERT INTO products (name, description, price, tags) 
      VALUES 
        ('테스트 상품 1', '테스트 상품 1 설명', 10000, ARRAY['전자기기', '신제품']),
        ('테스트 상품 2', '테스트 상품 2 설명', 20000, ARRAY['의류', '할인'])
      ON CONFLICT DO NOTHING;
    `;

    // 게시글 시드 데이터
    const articlesSeed = `
      INSERT INTO articles (title, content, likes) 
      VALUES 
        ('맥북 16인치 1테라 실버 팝니다', '맥북 16인치 1테라 실버 M2 프로 팝니다. 구매한지 3개월 됐고 상태 매우 좋습니다.', 156),
        ('아이패드 프로 12.9인치 판매합니다', '아이패드 프로 12.9인치 M2 스페이스그레이 WiFi 256GB 판매합니다. 애플펜슬 포함', 142),
        ('갤럭시 S24 울트라 자급제 팝니다', '갤럭시 S24 울트라 자급제 타이탄블랙 512GB 판매합니다. 개통 안했습니다.', 134),
        ('에어팟 맥스 스페이스 그레이 판매', '에어팟 맥스 스페이스 그레이 색상 판매합니다. 구매한지 1주일 됐습니다.', 98),
        ('아이폰 15 프로 자급제 256GB', '아이폰 15 프로 내추럴 티타늄 256GB 자급제 판매합니다. 풀박스입니다.', 87),
        ('갤럭시 워치6 클래식 실버 LTE', '갤럭시 워치6 클래식 실버 LTE 47mm 판매합니다. 구성품 전부 있습니다.', 76),
        ('애플워치 9 45mm GPS 미드나이트', '애플워치 9세대 45mm GPS 미드나이트 색상 판매합니다. 미개봉입니다.', 65),
        ('아이패드 에어 5세대 64GB', '아이패드 에어 5세대 스페이스그레이 WiFi 64GB 판매합니다. 케이스 포함', 54),
        ('갤럭시 버즈3 프로 그라파이트', '갤럭시 버즈3 프로 그라파이트 색상 판매합니다. 한달 사용했습니다.', 43),
        ('에어팟 프로 2세대 USB-C', '에어팟 프로 2세대 USB-C 버전 판매합니다. 미개봉 새제품입니다.', 32),
        ('맥 미니 M2 프로 512GB', '맥 미니 M2 프로 512GB 판매합니다. 메모리 16GB입니다.', 28),
        ('갤럭시 탭 S9 울트라 5G', '갤럭시 탭 S9 울트라 5G 256GB 그라파이트 색상 판매합니다.', 25),
        ('아이맥 M3 24인치 실버', '아이맥 M3 24인치 실버 512GB 판매합니다. 메모리 16GB입니다.', 21),
        ('갤럭시 Z 폴드5 자급제', '갤럭시 Z 폴드5 자급제 크림 512GB 판매합니다. 미개봉입니다.', 18),
        ('에어팟 3세대 MagSafe', '에어팟 3세대 MagSafe 충전 케이스 모델 판매합니다. 새제품입니다.', 15)
      ON CONFLICT DO NOTHING;
    `;

    // 댓글 시드 데이터
    const commentsSeed = `
      INSERT INTO comments (content, article_id, product_id) 
      VALUES 
        ('테스트 게시글 1의 댓글입니다.', 1, NULL),
        ('테스트 상품 1의 댓글입니다.', NULL, 1)
      ON CONFLICT DO NOTHING;
    `;

    await pool.query(productsSeed);
    await pool.query(articlesSeed);
    await pool.query(commentsSeed);

    console.log("데이터베이스 시딩 완료");
  } catch (error) {
    console.error("데이터베이스 시딩 실패:", error);
  }
};
