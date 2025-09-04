// assets/js/quiz.js
(function () {
  // ----- tiny helpers -----
  const qs = (sel, root = document) => root.querySelector(sel);

  // read ?section=... from URL
  const params = new URLSearchParams(location.search);
  const section = params.get("section") || "if_else";

  // map to human-friendly title
  const SECTION_TITLES = {
    if_else: "If / Else",
    for_loop: "For Loop",
    recursion: "Recursion",
    algorithms: "Algorithms",
  };

  // minimal mock questions (one per section) until JSON arrives
  const MOCK = {
    if_else: {
      difficulty: "easy",
      prompt:
        "Write a program that takes an integer and prints whether it is positive, negative, or zero.",
    },
    for_loop: {
      difficulty: "easy",
      prompt: "Print the first 10 natural numbers using a for loop.",
    },
    recursion: {
      difficulty: "easy",
      prompt: "Implement Fibonacci sequence using recursion (return nth).",
    },
    algorithms: {
      difficulty: "medium",
      prompt: "Implement binary search on a sorted array (return index or -1).",
    },
  };

  // ----- DOM refs -----
  const body = document.body;
  const sectionNameEl = qs("#section-name");
  const promptEl = qs("#prompt");
  const counterEl = qs("#question-counter");
  const difficultyEl = qs("#difficulty");
  const progressBar = qs(".progress__bar");

  // ----- UI state toggles -----
  function setLoading(on) {
    body.classList.toggle("is-loading", on);
  }
  function setReady(on) {
    body.classList.toggle("is-ready", on);
  }
  function setEmpty(on) {
    body.classList.toggle("is-empty", on);
  }

  // ----- render -----
  function renderFromMock(key) {
    const data = MOCK[key];
    if (!data) {
      // no mock for this key
      setLoading(false);
      setEmpty(true);
      setReady(false);
      return;
    }

    // header badges
    sectionNameEl.textContent = SECTION_TITLES[key] || key;
    difficultyEl.textContent = `difficulty: ${data.difficulty ?? "—"}`;

    // a single mock question
    counterEl.textContent = "Q 1 / 1";
    progressBar.style.width = "0%"; // stays at 0 for now

    // prompt text
    promptEl.textContent = data.prompt;

    // show quiz panel
    setLoading(false);
    setEmpty(false);
    setReady(true);
  }

  // ----- init -----
  function init() {
    // initial state: loading
    setLoading(true);
    setEmpty(false);
    setReady(false);

    // show section title immediately
    sectionNameEl.textContent = SECTION_TITLES[section] || section;

    // simulate async fetch (replace with real fetch when JSON is ready)
    setTimeout(() => {
      renderFromMock(section);
      // when JSON is ready, do:
      // fetch(`data/${section}.json`).then(r => r.json()).then(json => { ...render actual questions... })
    }, 300);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
