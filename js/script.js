let products = [
  {id:"p1", name:"Car Mobile mount", category:"Car Accessories", price:1099, image:"images/carmount.jpg", description:"Mini Dashboard Mount for iPhone 17/16/15/13/12, Samsung Galaxy Series.", affiliate:"https://amzn.to/47m0UPb", offer:true},
  {id:"p2", name:"Safety Hand Gloves", category:"Accessories", price:144, image:"images/SafetyHandGloves.jpg", description:"Industrial Safety Hand Gloves (Pack of 1) Anti-Cut | Cut Resistant | Heat Resistant | Industrial Use | for Finger and Hand Protection.", affiliate:"https://amzn.to/4qnWTSU", offer:false},
  {id:"p3", name:"Baby Cradle Swing", category:"Baby products", price:1599, image:"images/Baby_Cradle_Swing.jpg", description:"Baby Cradle Swing/Jhula (Thottil Cloth, Palna, Dolna) Set | Cradle Cloth with Padded Bed", affiliate:"https://amzn.to/49l12Rn", offer:true},
  {id:"p4", name:"Magnetic Phones Holder", category:"Car Accessories", price:629, image:"images/Magnetic_Phones_Holder.jpg", description:"360° Vaccum Magnetic Phones Holder, Magnetic Car Phone Mount", affiliate:"https://amzn.to/4ohCUUk", offer:false}
];

const grid = document.getElementById('grid');
const qInput = document.getElementById('q');
const categorySel = document.getElementById('category');
const sortSel = document.getElementById('sort');
const emptyEl = document.getElementById('empty');
const countBadge = document.getElementById('countBadge');
const clearBtn = document.getElementById('clearBtn');
const resetBtn = document.getElementById('resetBtn');
const paginationEl = document.getElementById('pagination');

// pagination
const PAGE_SIZE = 8;
let currentPage = 1;

function populateCategories(){
  const cats = Array.from(new Set(products.map(p => p.category))).sort();
  let options = '<option value="all">All categories</option>';
  options += '<option value="offer">Offer Zone ⭐️ </option>';
  options += cats.map(c=>`<option value="${c}">${c}</option>`).join('');
  categorySel.innerHTML = options;
}

function render(list){
  grid.innerHTML = '';
  if(!list.length){ emptyEl.style.display='block'; countBadge.textContent='0 items'; renderPagination(0); return; }
  emptyEl.style.display='none';
  countBadge.textContent=list.length + (list.length===1?' item':' items');

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if(currentPage > totalPages) currentPage = 1;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageList = list.slice(start, start + PAGE_SIZE);

  pageList.forEach(p=>{
    const card=document.createElement('article');
    card.className='card';
    card.innerHTML=`
      <div class="thumb"><img src="${p.image}" alt="${p.name}"></div>
      <div class="meta"><div><div class="title">${p.name}</div><div class="cat">${p.category}</div></div><div class="price">₹${p.price}</div></div>
      <div class="desc">${p.description}</div>
      <div class="actions">
        <a class="buy" target="_blank" rel="noopener noreferrer" href="${p.affiliate}">Buy on Amazon</a>
        <a class="details" href="#" data-id="${p.id}">Details</a>
      </div>`;
    grid.appendChild(card);
  });

  renderPagination(totalPages);
}

function getFiltered(){
  const q=qInput.value.trim().toLowerCase();
  const cat=categorySel.value;
  const sort=sortSel.value;
  let list=products.filter(p=>{
    const matchesQ = !q || (p.name+' '+p.description+' '+p.category).toLowerCase().includes(q);
    let matchesCat = cat==='all' || p.category===cat;
    if(cat==='offer') matchesCat = p.offer === true;
    return matchesQ && matchesCat;
  });
  if(cat==='offer') {
    // Show offer products first
    list = list.sort((a,b)=>b.offer-a.offer);
  } else {
    if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
    else if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
    else if(sort==='name-asc') list.sort((a,b)=>a.name.localeCompare(b.name));
  }
  return list;
}

[qInput, categorySel, sortSel].forEach(el=>el.addEventListener('input',()=>{ currentPage = 1; render(getFiltered()); }));
clearBtn.addEventListener('click',()=>{qInput.value=''; currentPage = 1; qInput.dispatchEvent(new Event('input'));});
resetBtn.addEventListener('click',()=>{qInput.value=''; categorySel.value='all'; sortSel.value='relevance'; currentPage = 1; render(getFiltered());});

grid.addEventListener('click', ev => {
  const a = ev.target.closest('a.details');
  if(!a) return;
  ev.preventDefault();
  
  const id = a.dataset.id;
  const p = products.find(x => x.id === id);
  if(p) showProductModal(p);
});

function showProductModal(product) {
  const modal = document.getElementById('productModal');
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalCategory').textContent = product.category;
  document.getElementById('modalPrice').textContent = `₹${product.price}`;
  document.getElementById('modalDesc').textContent = product.description;
  document.getElementById('modalImage').src = product.image;
  document.getElementById('modalImage').alt = product.name;
  document.getElementById('modalBuy').href = product.affiliate;
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeModal() {
  const modal = document.getElementById('productModal');
  modal.style.display = 'none';
  document.body.style.overflow = ''; // Restore scroll
}

// Add modal close handlers
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.getElementById('productModal').addEventListener('click', e => {
  if (e.target.id === 'productModal') closeModal();
});

// Add keyboard handler for accessibility
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
/**
 * Render pagination controls into `paginationEl`.
 * Shows Prev, numbered page buttons, and Next when totalPages > 1.
 */
function renderPagination(totalPages){
  if(!paginationEl) return;
  paginationEl.innerHTML = '';
  if(totalPages <= 1){ paginationEl.style.display = 'none'; return; }
  paginationEl.style.display = 'flex';

  const fragment = document.createDocumentFragment();

  const prev = document.createElement('button');
  prev.className = 'btn';
  prev.textContent = 'Prev';
  prev.disabled = currentPage === 1;
  prev.addEventListener('click', ()=>{ if(currentPage>1){ currentPage--; render(getFiltered()); } });
  fragment.appendChild(prev);

  for(let i=1;i<=totalPages;i++){
    const btn = document.createElement('button');
    btn.className = 'btn' + (i===currentPage? ' active' : '');
    btn.textContent = i;
    btn.addEventListener('click', ()=>{ if(currentPage !== i){ currentPage = i; render(getFiltered()); } });
    fragment.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'btn';
  next.textContent = 'Next';
  next.disabled = currentPage === totalPages;
  next.addEventListener('click', ()=>{ if(currentPage<totalPages){ currentPage++; render(getFiltered()); } });
  fragment.appendChild(next);

  paginationEl.appendChild(fragment);
}
populateCategories();
render(getFiltered());
