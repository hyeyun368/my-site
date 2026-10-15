// 푸터에 현재 연도 표시
document.getElementById("year").textContent = new Date().getFullYear();

// 스크롤 시 섹션이 부드럽게 나타나도록 처리
const sections = document.querySelectorAll(".section");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  sections.forEach((section) => observer.observe(section));
} else {
  sections.forEach((section) => section.classList.add("visible"));
}

// 다크 모드 토글 (선택은 localStorage에 기억)
const THEME_KEY = "theme";
const root = document.documentElement;
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // 저장소를 쓸 수 없으면 이번 방문에만 적용
  }
}

function currentTheme() {
  return root.dataset.theme || (darkQuery.matches ? "dark" : "light");
}

const themeToggle = document.createElement("button");
themeToggle.type = "button";
themeToggle.className = "theme-toggle";

function updateToggle() {
  const isDark = currentTheme() === "dark";
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

const savedTheme = getSavedTheme();
if (savedTheme === "light" || savedTheme === "dark") {
  root.dataset.theme = savedTheme;
}

themeToggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  saveTheme(next);
  updateToggle();
});

// 저장된 선택이 없을 때 시스템 설정이 바뀌면 아이콘도 갱신
darkQuery.addEventListener("change", updateToggle);

updateToggle();
document.body.appendChild(themeToggle);
