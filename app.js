// 이미지 썸네일 → 히어로 변경
const hero = document.getElementById('hero');
document.querySelectorAll('.thumbs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.thumbs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const img = btn.dataset.img;
    if (img) hero.src = img; // 루트 참조 (assets/ 없음)
  });
});

// 스와치(색상) → 이미지 전환
document.querySelectorAll('.swatches button').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.swatches button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const color = b.dataset.color;
    hero.src = (color === 'black') ? 'tee-black.svg' : 'tee-cream.svg';
    // 썸네일 active도 동기화
    document.querySelectorAll('.thumbs button').forEach(t => {
      t.classList.toggle('active', t.dataset.img === hero.src);
    });
  });
});

// 사이즈 토글
document.querySelectorAll('.chips .chip').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('.chips .chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
  });
});

// ---------- 모달 공통 ----------
function qs(id){ return document.getElementById(id); }
function openModal(el){ el.classList.add('show'); el.setAttribute('aria-hidden','false'); }
function closeModal(el){ el.classList.remove('show'); el.setAttribute('aria-hidden','true'); }
document.querySelectorAll('[data-close]').forEach(el=>{
  el.addEventListener('click', ()=> closeModal(el.closest('.modal')));
});

// ---------- 무통장 주문 모달 ----------
const orderBtn = qs('order');
const orderModal = qs('orderModal');
const orderForm = qs('orderForm');
const toast = qs('orderToast');
const priceNow = qs('priceNow');
const priceHidden = qs('priceHidden');

orderBtn?.addEventListener('click', ()=>{
  // 현재 선택사항을 폼에 반영
  const color = document.querySelector('.swatches .active')?.dataset.color || 'cream';
  const size = document.querySelector('.chips .chip.active')?.textContent || 'M';
  orderForm.elements.color.value = color;
  orderForm.elements.size.value = size;
  priceHidden.value = priceNow?.dataset.amount || '29900';
  openModal(orderModal);
});

// 계좌/금액 복사
qs('copyAcct')?.addEventListener('click', ()=> copyToClipboard(qs('acct')?.textContent || ''));
qs('copyAmt')?.addEventListener('click', ()=> copyToClipboard(priceNow?.dataset.amount || '29900'));

function copyToClipboard(text){
  const t = document.createElement('textarea');
  t.value = text.trim();
  document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
  showToast('복사되었습니다.');
}
function showToast(msg){
  if(!toast) return;
  toast.textContent = msg;
  toast.hidden = false;
  setTimeout(()=> toast.hidden = true, 2500);
}

// 주문 제출 → Formspree 전송
orderForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = new FormData(orderForm);

  // ★★★ 여기 본인 Formspree 엔드포인트로 교체 ★★★
  const endpoint = 'https://formspree.io/f/https://formspree.io/f/xjkolywq;

  try{
    const r = await fetch(endpoint, { method:'POST', body:data, headers:{ 'Accept':'application/json' }});
    if(r.ok){
      showToast('주문이 접수되었습니다. 24시간 내 입금 부탁드려요!');
      orderForm.reset();
      setTimeout(()=> closeModal(orderModal), 800);
    }else{
      showToast('전송 실패. 잠시 후 다시 시도해주세요.');
    }
  }catch{
    showToast('네트워크 오류. 잠시 후 다시 시도해주세요.');
  }
});

// ---------- 카드 결제(토스/카카오 송금 링크) ----------
const payBtn = qs('pay');
const payModal = qs('payModal');
const btnToss = qs('btnToss');
const btnKakao = qs('btnKakao');

payBtn?.addEventListener('click', ()=>{
  // 버튼 data-* 에 넣어둔 링크를 모달 버튼에 주입
  const toss = payBtn.dataset.toss?.trim();
  const kakao = payBtn.dataset.kakao?.trim();

  if(toss) { btnToss.href = toss; btnToss.style.display = 'inline-flex'; }
  else { btnToss.removeAttribute('href'); btnToss.style.display = 'none'; }

  if(kakao) { btnKakao.href = kakao; btnKakao.style.display = 'inline-flex'; }
  else { btnKakao.removeAttribute('href'); btnKakao.style.display = 'none'; }

  if(!toss && !kakao){
    alert('빠른결제 링크가 설정되지 않았습니다. index.html의 #pay data-toss / data-kakao를 본인 링크로 교체하세요.');
    return;
  }
  openModal(payModal);
});
