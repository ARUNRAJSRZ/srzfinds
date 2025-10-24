let products = [
  {id:"p1", name:"Car Mobile mount", category:"Car Accessories", price:1099, image:"images/carmount.jpg", description:"Mini Dashboard Mount for iPhone 17/16/15/13/12, Samsung Galaxy Series.", affiliate:"https://amzn.to/47m0UPb"}
  // {id:"p2", name:"Aesthetic Mouse Pad", category:"Accessories", price:249, image:"images/mousepad.jpg", description:"Smooth surface mouse pad with stitched edges.", affiliate:"https://www.amazon.in/"},
  // {id:"p3", name:"Cable Organizer Clips (6pcs)", category:"Accessories", price:129, image:"images/mouse_pad.jpg", description:"Keep your desk tangle-free with simple adhesive clips.", affiliate:"https://www.amazon.in/"},
  // {id:"p4", name:"Mini Bluetooth Speaker", category:"Audio", price:499, image:"images/speaker.jpg", description:"Portable speaker with clear sound and long battery life.", affiliate:"https://www.amazon.in/"},
  // {id:"p5", name:"Mini Bluetooth Speaker", category:"Audio", price:499, image:"images/speaker.jpg", description:"Portable speaker with clear sound and long battery life.", affiliate:"https://www.amazon.in/"}
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
  categorySel.innerHTML = '<option value="all">All categories</option>' + cats.map(c=>`<option value="${c}">${c}</option>`).join('');
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
    const matchesCat = cat==='all' || p.category===cat;
    return matchesQ && matchesCat;
  });
  if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
  else if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
  else if(sort==='name-asc') list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}

[qInput, categorySel, sortSel].forEach(el=>el.addEventListener('input',()=>{ currentPage = 1; render(getFiltered()); }));
clearBtn.addEventListener('click',()=>{qInput.value=''; currentPage = 1; qInput.dispatchEvent(new Event('input'));});
resetBtn.addEventListener('click',()=>{qInput.value=''; categorySel.value='all'; sortSel.value='relevance'; currentPage = 1; render(getFiltered());});

grid.addEventListener('click',ev=>{
  const a=ev.target.closest('a.details'); if(!a) return;
  ev.preventDefault();
  const id=a.dataset.id;
  const p=products.find(x=>x.id===id);
  if(p) alert(`${p.name}\nCategory: ${p.category}\nPrice: ₹${p.price}\nDescription:\n${p.description}`);
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
