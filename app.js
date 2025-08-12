// ====== 이미지 썸네일 → 메인 이미지 교체 ======
const hero = document.getElementById('hero');
document.querySelectorAll('.thumbs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.thumbs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const img = btn.dataset.img;
    if (img) hero.src = img; // 루트 참조
  });
});

// ====== 색상 스와치 → 이미지 전환 ======
document.querySelectorAll('.swatches button').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.swatches button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const color = b.dataset.color;
    hero.src = (color === 'black') ? 'tee-black.jpg' : 'tee-cream.jpg';
    document.querySelectorAll('.thumbs button').forEach(t => {
      t.classList.toggle('active', t.dataset.img === hero.src);
    });
  });
});

// ====== 사이즈 토글 ======
document.querySelectorAll('.chips .chip').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('.chips .chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
  });
});

// ====== 모달 공통 ======
function openModal(el){ el.classList.add('show'); el.setAttribute('aria-hidden','false'); }
function closeModal(el){ el.classList.remove('show'); el.setAttribute('aria-hidden','true'); }
document.querySelectorAll('[data-close]').forEach(el=>{
  el.addEventListener('click', ()=> closeModal(el.closest('.modal')));
});

// ====== 무통장 주문 모달 ======
const orderBtn   = document.getElementById('order');
const orderModal = document.getElementById('orderModal');
const orderForm  = document.getElementById('orderForm');
const priceNow   = document.getElementById('priceNow');
const priceHidden= document.getElementById('priceHidden');
const toast      = document.getElementById('orderToast');

orderBtn?.addEventListener('click', ()=>{
  const color = document.querySelector('.swatches .active')?.dataset.color || 'cream';
  const size  = document.querySelector('.chips .chip.active')?.textContent || 'M';
  orderForm.elements.color.value = color;
  orderForm.elements.size.value  = size;
  priceHidden.value = priceNow?.dataset.amount || '25000';
  openModal(orderModal);
});

// 계좌/금액 복사
document.getElementById('copyAcct')?.addEventListener('click', ()=> copyToClipboard(document.getElementById('acct')?.textContent || ''));
document.getElementById('copyAmt') ?.addEventListener('click', ()=> copyToClipboard(priceNow?.dataset.amount || '25000'));

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

// ====== 주문 제출 → Formspree 전송 ======
// ⬇⬇⬇ 여기를 본인 Formspree Endpoint로 바꾸세요 (예: https://formspree.io/f/abcd1234)
const endpoint = 'https://formspree.io/f/xjkolywq';

orderForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = new FormData(orderForm);
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

