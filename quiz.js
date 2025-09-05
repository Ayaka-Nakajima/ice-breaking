// ===== Minimal loader + judge for Python (Pyodide) =====
(() => {
  // ---------- selectors ----------
  const $ = (s) => document.querySelector(s);
  const SEL = {
    sectionName: '#section-name',
    prompt: '#prompt',
    answer: '#answer',
    run: '#run-tests',
    prev: '#prev-q',
    next: '#next-q',
    counter: '#question-counter',
    difficulty: '#difficulty',
    progressBar: '.progress__bar',
    testPanel: '#test-results',
    testSummary: '#test-summary',
    testList: '#test-list',
    loadingPanel: '.panel--loading',
    emptyPanel: '.panel--empty',
    quizPanel: '.panel--quiz',
  };

  // ---------- stage / UI helpers ----------
  function setText(el, t){ if(el) el.textContent = t ?? ''; }
  function setHTML(el, h){ if(el) el.innerHTML  = h ?? ''; }
  function show(el, v){ if(el) el.style.display = v ? 'block' : 'none'; }
  function setStage(stage){
    document.body?.classList?.remove('is-loading','is-empty','is-ready');
    if(stage==='loading') document.body?.classList?.add('is-loading');
    if(stage==='empty')   document.body?.classList?.add('is-empty');
    if(stage==='ready')   document.body?.classList?.add('is-ready');
    show($(SEL.loadingPanel), stage==='loading');
    show($(SEL.emptyPanel),   stage==='empty');
    show($(SEL.quizPanel),    stage==='ready');
  }

  // ---------- section ----------
  const SECTION_KEYS = {
    if_else: 'if_else_problems',
    for_loop: 'for_loop_problems',
    recursion: 'recursion_problems',
    algorithms: 'algo_problems',
    all: '__all__',
  };
  function getSection(){
    const p = new URLSearchParams(location.search);
    const raw = (p.get('section')||'all').toLowerCase();
    return SECTION_KEYS[raw] ? raw : 'all';
  }

  // ---------- problems normalize ----------
  function normalizeOne(node, idx=0){
    const description = node?.description || node?.prompt || node?.text || '';
    const tests = Array.isArray(node?.test_cases) ? node.test_cases : [];
    const difficulty = node?.difficulty || node?.level || '—';
    return { description, tests, difficulty, _index: idx };
  }
  function normalizeSection(sectionObj){
    if (!sectionObj || typeof sectionObj!=='object') return [];
    const keys = Object.keys(sectionObj).sort((a,b)=>Number(a)-Number(b));
    return keys.map((k,i)=> normalizeOne(sectionObj[k], i));
  }
  function sliceBySection(all, section){
    const key = SECTION_KEYS[section] || SECTION_KEYS.all;
    if (key === '__all__'){
      return []
        .concat(
          normalizeSection(all?.if_else_problems),
          normalizeSection(all?.for_loop_problems),
          normalizeSection(all?.recursion_problems),
          normalizeSection(all?.algo_problems),
        );
    }
    return normalizeSection(all?.[key]);
  }

  // ---------- state ----------
  let problems = [];
  let idx = 0;
  const answers = Object.create(null);

  // ---------- render ----------
  const DEFAULT_TEMPLATE =
`if __name__ == "__main__":
    # write your code here
    pass
`;
  function render(){
    const total = problems.length;
    const p = problems[idx] || {description:'', tests:[]};
    // text
    setText($(SEL.counter), `${idx+1} / ${total}`);
    setText($(SEL.difficulty), `difficulty: ${p.difficulty}`);
    setHTML($(SEL.prompt), `<code>${escapeHTML(p.description || '')}</code>`);
    // answer buffer
    const ans = $(SEL.answer);
    if (ans) ans.value = (answers[idx] ?? DEFAULT_TEMPLATE);
    // progress bar (optional)
    const bar = $(SEL.progressBar);
    if (bar){
      const pct = total ? Math.round(((idx+1)/total)*100) : 0;
      bar.style.width = `${pct}%`;
    }
    // clear results pane (if exists)
    const list = $(SEL.testList);
    const sum  = $(SEL.testSummary);
    const panel= $(SEL.testPanel);
    if (sum) setText(sum, 'Not run yet.');
    if (list) setHTML(list, '');
    if (panel) panel.classList.add('is-hidden');
  }
  function escapeHTML(str){
    if (str==null) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // ---------- load problems ----------
  async function loadProblems(){
    setStage('loading');
    try{
      const section = getSection();
      setText($(SEL.sectionName), section.replace('_',' ').toUpperCase());
      // embedded first
      const emb = document.getElementById('problems-json');
      let all;
      if (emb && emb.textContent.trim()){
        all = JSON.parse(emb.textContent);
      } else {
        const res = await fetch('problems.json', {cache:'no-store'});
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        all = await res.json();
      }
      problems = sliceBySection(all, section);
      if (!problems.length){ setStage('empty'); return; }
      idx = 0;
      render();
      setStage('ready');
    }catch(e){
      console.error(e);
      setStage('empty');
    }
  }

  // ---------- Pyodide runner ----------
  let _pyodide = null;
  async function ensurePyodide(){ if(_pyodide) return _pyodide; _pyodide = await loadPyodide(); return _pyodide; }

  async function runUserCode(code, inputData){
    const py = await ensurePyodide();
    py.globals.set('USER_CODE', String(code)); // ← 文字列埋め込みしない

    // stdin 準備（配列なら改行連結）
    let inputStr = '';
    if (Array.isArray(inputData)) inputStr = inputData.map(String).join('\n');
    else if (inputData!==null && inputData!==undefined) inputStr = String(inputData);

    const runner = `
import sys, io
_in = ${JSON.stringify(inputStr)}
buf_out, buf_err = io.StringIO(), io.StringIO()
old_in, old_out, old_err = sys.stdin, sys.stdout, sys.stderr
sys.stdin, sys.stdout, sys.stderr = io.StringIO(_in), buf_out, buf_err
try:
    exec(USER_CODE, {"__name__":"__main__"})
finally:
    sys.stdin, sys.stdout, sys.stderr = old_in, old_out, old_err
OUT = buf_out.getvalue()
ERR = buf_err.getvalue()
`;
    await py.runPythonAsync(runner);
    const OUT = py.globals.get('OUT');
    const ERR = py.globals.get('ERR');
    const res = { stdout: String(OUT), stderr: String(ERR) };
    OUT && OUT.destroy && OUT.destroy();
    ERR && ERR.destroy && ERR.destroy();
    return res;
  }

  // ---------- compare ----------
  function deepEqual(a,b){
    if (a===b) return true;
    if (typeof a!==typeof b) return false;
    if (Array.isArray(a)&&Array.isArray(b)){
      if (a.length!==b.length) return false;
      for(let i=0;i<a.length;i++) if(!deepEqual(a[i],b[i])) return false;
      return true;
    }
    if (a&&b&&typeof a==='object'){
      const ka=Object.keys(a).sort(), kb=Object.keys(b).sort();
      if(ka.length!==kb.length) return false;
      for(let i=0;i<ka.length;i++) if(ka[i]!==kb[i]) return false;
      for(const k of ka) if(!deepEqual(a[k],b[k])) return false;
      return true;
    }
    return false;
  }
  function compareOutput(expected, rawStdout){
    const out = (rawStdout??'').toString().trim();
    if (expected && typeof expected==='object'){
      try{
        const parsed = JSON.parse(out);
        if (deepEqual(parsed, expected))
          return {pass:true, expected:JSON.stringify(expected), actual:out};
      }catch{}
      if (Array.isArray(expected)){
        const tokens = out.split(/\s+/).filter(Boolean).map(String);
        const exp = expected.map(String);
        if (tokens.length===exp.length && tokens.every((t,i)=>t===exp[i])){
          return {pass:true, expected:exp.join(' '), actual:tokens.join(' ')};
        }
      }
      return {pass:false, expected:JSON.stringify(expected), actual:out};
    }
    const exp = String(expected??'').trim();
    return {pass: out===exp, expected:exp, actual:out};
  }

  // ---------- run tests ----------
  async function onRun(){
    const p = problems[idx]; if (!p) return;
    const code = ($(SEL.answer)?.value)||'';
    answers[idx] = code;
    const tests = Array.isArray(p.tests) ? p.tests : (Array.isArray(p.test_cases)?p.test_cases:[]);

    const panel = $(SEL.testPanel); panel && panel.classList.remove('is-hidden');
    setText($(SEL.testSummary), 'Running...');
    setHTML($(SEL.testList), '');

    const rows = []; let passed = 0;
    for (let i=0;i<tests.length;i++){
      const tc = tests[i], input = tc.input, expected = tc.output;
      let stdout='', stderr='';
      try{
        const r = await runUserCode(code, input);
        stdout = r.stdout||''; stderr = r.stderr||'';
      }catch(e){ stderr = e?.message || String(e); }

      const cmp = compareOutput(expected, stderr ? '' : stdout);
      if (cmp.pass) passed++;

      rows.push(
        `<li class="${cmp.pass?'ok':'ng'}">
           <div class="case-head"><strong>Case #${i+1}</strong>
             <span class="badge ${cmp.pass?'badge--ok':'badge--ng'}">${cmp.pass?'passed':'failed'}</span>
           </div>
           <div class="kv"><span>input:</span> <code>${escapeHTML(JSON.stringify(input))}</code></div>
           <div class="kv"><span>expected:</span> <code>${escapeHTML(cmp.expected)}</code></div>
           <div class="kv"><span>your output:</span> <code>${escapeHTML(stderr ? ('error:\\n'+stderr) : (stdout.trim()||'(empty)'))}</code></div>
         </li>`
      );
    }
    setText($(SEL.testSummary), `Passed ${passed} / ${tests.length} test(s).`);
    const list = $(SEL.testList);
    if (list) list.innerHTML = rows.join('');
  }

  // ---------- navigation ----------
  function onPrev(){ if(!problems.length) return; answers[idx] = ($(SEL.answer)?.value)||''; idx=(idx-1+problems.length)%problems.length; render(); }
  function onNext(){ if(!problems.length) return; answers[idx] = ($(SEL.answer)?.value)||''; idx=(idx+1)%problems.length; render(); }

  // ---------- wire ----------
  function attach(){
    $(SEL.run)?.addEventListener('click', ()=>onRun().catch(err=>{
      console.error(err);
      setText($(SEL.testSummary), `Runner error: ${err?.message||String(err)}`);
    }));
    $(SEL.prev)?.addEventListener('click', onPrev);
    $(SEL.next)?.addEventListener('click', onNext);
  }

  document.addEventListener('DOMContentLoaded', ()=>{ attach(); loadProblems(); });

})();
