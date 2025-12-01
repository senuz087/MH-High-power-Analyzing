// script.js — purely client-side simulation. NOT a real predictor.
(function(){
  const photoInput = document.getElementById('photoInput');
  const photoPreview = document.getElementById('photoPreview');
  const time1 = document.getElementById('time1');
  const odd1 = document.getElementById('odd1');
  const time2 = document.getElementById('time2');
  const odd2 = document.getElementById('odd2');
  const generateBtn = document.getElementById('generateBtn');
  const simulateManyBtn = document.getElementById('simulateManyBtn');
  const outputArea = document.getElementById('outputArea');
  const analyticsArea = document.getElementById('analyticsArea');

  // photo preview
  photoInput.addEventListener('change', e=>{
    const f = e.target.files && e.target.files[0];
    if(!f){ photoPreview.textContent = 'No photo'; return; }
    const url = URL.createObjectURL(f);
    photoPreview.style.backgroundImage = `url(${url})`;
    photoPreview.style.backgroundSize = 'cover';
    photoPreview.textContent = '';
  });

  // small helper: format time string
  function addSecondsToTime(tStr, secs){
    if(!tStr) return tStr;
    const [h,m] = tStr.split(':').map(Number);
    const dt = new Date(); dt.setHours(h, m, 0, 0);
    dt.setSeconds(dt.getSeconds() + secs);
    return dt.toTimeString().slice(0,8);
  }

  function simulateNextHigh(oddA, oddB){
    // PURELY SIMULATED function: given two prior high odds, create a randomized next guess.
    // We intentionally do NOT claim real predictive power. This is for educational demo only.
    const base = Math.max(10, (oddA||12) * 0.6 + (oddB||15) * 0.4);
    // Add random heavy-tail variation
    const randFactor = Math.pow(Math.random(), 0.6) * 1.8; // skewed
    const predicted = Math.round((base * (1 + randFactor)) * 100) / 100;
    // Simulated "confidence" number but label it clearly as simulated estimate
    const conf = Math.min(99, Math.round((40 + (Math.random()*55))));
    // produce a time within next 1-7 minutes (random)
    const seconds = Math.floor(30 + Math.random()*360); // 30 .. 390 seconds
    return {
      predicted,
      conf,
      secondsFromNow: seconds
    };
  }

  generateBtn.addEventListener('click', ()=>{
    const a = parseFloat(odd1.value) || null;
    const b = parseFloat(odd2.value) || null;
    const t1 = time1.value || null;
    const t2 = time2.value || null;

    // input checking
    if((a && a < 10) || (b && b < 10)){
      outputArea.innerHTML = `<div style="color:#ffb4b4">Please enter odds ≥ 10 for high events (simulation expects 10x+).</div>`;
      return;
    }

    // generate simulated prediction
    const sim = simulateNextHigh(a, b);
    const now = new Date();
    const targetTime = new Date(now.getTime() + sim.secondsFromNow*1000);
    const timeStr = targetTime.toTimeString().slice(0,8);

    // show result — note: we plainly label as simulated estimate
    outputArea.innerHTML = `
      <div><strong>Simulated next high (educational only):</strong></div>
      <div style="margin-top:8px;font-size:18px">
        <span style="font-weight:800">${timeStr}</span>
        &nbsp; — &nbsp;
        <span style="font-weight:800">${sim.predicted}×</span>
        &nbsp; <span style="opacity:0.85"> (simulated estimate)</span>
      </div>
      <div style="margin-top:8px;color:#c6d9f8">
        Simulated likelihood (for demo only): <strong>${sim.conf}%</strong>
      </div>
      <div style="margin-top:10px;color:var(--muted);font-size:13px">
        Inputs used:
        <ul style="margin:6px 0 0 18px;padding:0;color:#bcd7ff">
          <li>High 1: ${t1 || '—'} • ${a ? a+'×' : '—'}</li>
          <li>High 2: ${t2 || '—'} • ${b ? b+'×' : '—'}</li>
        </ul>
      </div>
    `;

    // small analytics (single-run)
    analyticsArea.innerHTML = `
      <div>Simulation snapshot:</div>
      <div style="margin-top:6px">Predicted multiplier: <strong>${sim.predicted}×</strong></div>
      <div>Simulated estimate: <strong>${sim.conf}%</strong></div>
      <div style="margin-top:6px;color:var(--muted)">Note: This is a randomized simulation, not a real-world prediction.</div>
    `;
  });

  // run a larger simulation to compute frequency of >=10x events (demo)
  simulateManyBtn.addEventListener('click', ()=>{
    const N = 1000;
    let count = 0;
    const highs = [];
    for(let i=0;i<N;i++){
      // mix distribution similar to earlier discussion
      const r = Math.random();
      let val;
      if(r < 0.88){
        val = 1 + Math.pow(Math.random(), 0.9) * 2.0; // mostly low
      } else if(r < 0.98){
        val = 3 + Math.random()*7;
      } else {
        val = 10 + Math.pow(Math.random(),  -1.2) * 20; // occasional heavy tail
      }
      val = Math.round(val*100)/100;
      if(val >= 10){ count++; highs.push(val); }
    }
    const freq = (count / N * 100).toFixed(2);
    analyticsArea.innerHTML = `
      <div>Large simulation (${N} rounds) — educational only</div>
      <div style="margin-top:6px">Simulated >=10× count: <strong>${count}</strong> (${freq}%)</div>
      <div style="margin-top:6px">Example simulated highs: ${highs.slice(0,6).join(', ')}</div>
      <div style="margin-top:8px;color:var(--muted)">This illustrates how rare large multipliers can be in random setups.</div>
    `;
  });

})();
