const hero=document.getElementById('hero');
document.querySelectorAll('.thumbs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.thumbs button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); hero.src=b.dataset.img;
});
document.querySelectorAll('.swatches button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.swatches button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); hero.src=b.dataset.color==='black'?'assets/tee-black.svg':'assets/tee-cream.svg';
});
document.querySelectorAll('.chips .chip').forEach(c=>c.onclick=()=>{
  Array.from(c.parentElement.children).forEach(x=>x.classList.remove('active')); c.classList.add('active');
});
document.getElementById('buy').onclick=()=>{
  const url=document.getElementById('buy').dataset.url; 
  if(!url || url.includes('REPLACE_PRODUCT_URL')){
    alert('스마트스토어 상품 URL로 연결을 마저 설정해 주세요.');
  }else{
    window.open(url,'_blank','noopener');
  }
};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
  const key=t.dataset.tab;
  const map={
    details:`• 원형 레터링 “WE ARE 26” + 백호(등번호 7) / 방패형 HeBeZ 로고(왼가슴)<br>• 컬러: 크림/블랙<br>• 원단: 20수 코튼 또는 기능성 폴리(흡습속건)<br>• 프린팅: 디지털 프린트<br>• 핏: 레귤러`,
    wash:`• 뒤집어 찬물 세탁 · 저온 건조 권장<br>• 프린트 면 고열 다림질 금지<br>• 폴리 기능성은 표백제 금지`,
    policy:`• 우체국 택배 1~2영업일 출고<br>• 5만원 이상 무료, 미만 3,500원<br>• 단순 변심 7일 이내(미세탁/미착용)`
  };
  document.getElementById('tab-content').innerHTML=map[key];
});