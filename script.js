/* ============================================================
   [실습] 장안대학교 소개 홈페이지 - script.js (동작 담당)
   ------------------------------------------------------------
   JS 의 기본 3단계 공식 (리모컨 비유)
     ① 요소 찾기   : document.querySelector(...)   → 리모컨 집기
     ② 이벤트 연결 : addEventListener("click", ...) → 버튼 누르면
     ③ 변화 주기   : classList.add / textContent    → TV 채널 변경
   기능 목록
     1) 모바일 햄버거 메뉴    2) 스크롤 시 헤더 그림자 + 맨위로 버튼
     3) 현재 섹션 메뉴 강조   4) 타이핑 효과
     5) 숫자 카운터           6) 학과 필터
     7) 주소 복사             8) 스크롤 등장 애니메이션
     9) 푸터 연도 자동 표시
   ============================================================ */

/* ---------- 1) 모바일 햄버거 메뉴 ---------- */
const menuToggle = document.querySelector("#menuToggle");  // # = id 로 찾기
const nav = document.querySelector("#nav");

menuToggle.addEventListener("click", () => {
  // toggle: 클래스가 없으면 추가, 있으면 제거 (스위치처럼)
  nav.classList.toggle("open");
});

// 메뉴 항목을 누르면 메뉴를 자동으로 닫기 (모바일 편의)
const navLinks = document.querySelectorAll(".nav-link");     // 여러 개 → NodeList
navLinks.forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

/* ---------- 2) 스크롤 시 헤더 그림자 + 맨위로 버튼 ---------- */
const header = document.querySelector("#header");
const topBtn = document.querySelector("#topBtn");

window.addEventListener("scroll", () => {
  // window.scrollY : 현재 위에서부터 내려온 거리(px)
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // 300px 이상 내려가면 맨위로 버튼 표시
  topBtn.classList.toggle("show", window.scrollY > 300);

  highlightMenu();   // 3번 기능 호출
});

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- 3) 현재 보고 있는 섹션의 메뉴 강조 ---------- */
const sections = document.querySelectorAll("section");

function highlightMenu() {
  let currentId = "";
  sections.forEach((sec) => {
    // offsetTop: 페이지 맨 위에서 섹션까지의 거리
    // 헤더 높이(64px)를 고려해 100px 정도 여유를 둠
    if (window.scrollY >= sec.offsetTop - 100) {
      currentId = sec.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    // 템플릿 리터럴 `...${변수}...` 로 문자열 조합 (백틱 ` 주의!)
    if (link.getAttribute("href") === `#${currentId}`) {
      link.classList.add("active");
    }
  });
}

/* ---------- 4) 타이핑 효과 ---------- */
const typingEl = document.querySelector("#typing");
const sentences = [
  "파이썬으로 시작하는 프로그래밍 사고력",
  "자바스크립트로 움직이는 웹을 만듭니다",
  "코틀린으로 나만의 안드로이드 앱 완성",
  "IoT와 모바일을 잇는 실무형 개발자로!",
];
let sentenceIdx = 0;   // 몇 번째 문장인지
let charIdx = 0;       // 몇 번째 글자까지 출력했는지

function typeText() {
  const current = sentences[sentenceIdx];
  // slice(0, n): 앞에서 n 글자만 잘라오기
  typingEl.textContent = current.slice(0, charIdx + 1);
  charIdx++;

  if (charIdx < current.length) {
    setTimeout(typeText, 100);        // 0.1초 뒤 다음 글자
  } else {
    // 한 문장이 끝나면 2초 쉬고 다음 문장으로 (% 로 처음으로 순환)
    setTimeout(() => {
      charIdx = 0;
      sentenceIdx = (sentenceIdx + 1) % sentences.length;
      typeText();
    }, 2000);
  }
}
typeText();   // 처음 한 번 실행 시작

/* ---------- 5) 숫자 카운터 ---------- */
const counters = document.querySelectorAll(".counter");
let counted = false;   // 한 번만 실행되도록 막는 깃발(flag)

function startCounter() {
  counters.forEach((counter) => {
    // data-target 속성값 읽기 → 문자열이므로 Number() 로 숫자 변환!
    const target = Number(counter.dataset.target);
    let num = 0;
    const step = Math.ceil(target / 60);    // 약 60번에 나눠 증가

    const timer = setInterval(() => {
      num += step;
      if (num >= target) {
        num = target;
        clearInterval(timer);   // 목표 도달 시 반복 멈춤 (안 하면 무한 반복)
      }
      counter.textContent = num;
    }, 25);
  });
}

/* ---------- 6) 학과 필터 ---------- */
const filterBtns = document.querySelectorAll(".filter-btn");
const deptCards = document.querySelectorAll(".dept-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // 버튼 강조 표시 바꾸기
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;   // data-filter 값 (all / it / biz / art)

    deptCards.forEach((card) => {
      // 전체이거나, 카테고리가 같으면 보이기 / 아니면 숨기기
      if (filter === "all" || card.dataset.category === filter) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    });
  });
});

/* ---------- 7) 주소 복사 ---------- */
const copyBtn = document.querySelector("#copyBtn");
const address = "경기도 화성시 봉담읍 삼천병마로 1182";

copyBtn.addEventListener("click", () => {
  // Clipboard API 는 https 또는 localhost 에서만 동작 (Live Server 권장)
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(address)
      .then(() => alert("주소가 복사되었습니다!\n" + address))
      .catch(() => alert("복사에 실패했습니다. 직접 복사해 주세요."));
  } else {
    alert("이 환경에서는 자동 복사가 지원되지 않습니다.\n" + address);
  }
});

/* ---------- 8) 스크롤 등장 애니메이션 ---------- */
// 애니메이션을 줄 요소들에 fade-in 클래스 붙이기
const animTargets = document.querySelectorAll(
  ".about-card, .stat, .timeline li, .dept-card, .contact-box"
);
animTargets.forEach((el) => el.classList.add("fade-in"));

// IntersectionObserver: 요소가 화면에 "보이는 순간"을 감지하는 감시자
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // 숫자 영역이 보이면 카운터 시작 (딱 한 번)
        if (entry.target.classList.contains("stat") && !counted) {
          counted = true;
          startCounter();
        }
        observer.unobserve(entry.target);   // 한 번 보였으면 감시 해제
      }
    });
  },
  { threshold: 0.2 }   // 요소가 20% 보이면 실행
);
animTargets.forEach((el) => observer.observe(el));

/* ---------- 9) 푸터 연도 자동 표시 ---------- */
document.querySelector("#year").textContent = new Date().getFullYear();
