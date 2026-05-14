// ========== DONNÉES MENU ==========
const MENU = [
  // SIGNATURES
  {
    id:'tteokbokki', cat:['signature','rice'], korean:'떡볶이', name:'Tteokbokki Signature', price:9.90,
    img:'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=600&q=80',
    desc:'L\'icône de Séoul. Gâteaux de riz moelleux mijotés dans une sauce gochujang douce-épicée maison.',
    ingredients:['Gâteaux de riz coréens (garaetteok)','Gochujang maison sans alcool','Sauce soja','Sucre de canne','Ail','Oignon nouveau','Graines de sésame','Bouillon d\'algue dashi (sans poisson)'],
    allergens:['Gluten','Soja','Sésame'],
    halal:true, popular:true, spice:true, veggie:true,
    badges:['popular','halal','veggie']
  },
  {
    id:'yangnyeom', cat:['signature','chicken'], korean:'양념치킨', name:'Poulet Yangnyeom', price:13.90,
    img:'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    desc:'Poulet halal double frit, ultra croustillant, enrobé d\'une sauce sucrée-épicée légendaire.',
    ingredients:['Poulet halal AVS (cuisse désossée)','Farine de blé + maïzena','Gochujang sans alcool','Miel','Ail','Gingembre','Sauce soja','Vinaigre de riz (sans alcool)','Graines de sésame'],
    allergens:['Gluten','Soja','Sésame'],
    halal:true, popular:true, spice:true,
    badges:['popular','halal']
  },
  {
    id:'corndog', cat:['signature','street'], korean:'감자핫도그', name:'Corn Dog Mozza', price:7.50,
    img:'https://images.unsplash.com/photo-1619221882266-0a8d6efba61a?auto=format&fit=crop&w=600&q=80',
    desc:'Saucisse de bœuf halal + mozzarella fondante, enrobée d\'une pâte croustillante et de cubes de pomme de terre.',
    ingredients:['Saucisse de bœuf halal','Mozzarella 100%','Farine de blé','Cubes de pomme de terre','Levure boulangère','Sucre','Chapelure panko','Sucre cristal pour saupoudrer'],
    allergens:['Gluten','Lait','Œuf'],
    halal:true, new_:true,
    badges:['new','halal']
  },

  // POULET FRIT
  {
    id:'kfc-original', cat:['chicken'], korean:'후라이드치킨', name:'Poulet Frit Original', price:12.90,
    img:'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    desc:'Pilons et ailes halal frits 2 fois pour un croustillant inégalé. Servi avec sauce ranch coréenne.',
    ingredients:['Poulet halal AVS','Farine de blé','Maïzena','Sel','Poivre blanc','Paprika doux','Huile de tournesol'],
    allergens:['Gluten'],
    halal:true,
    badges:['halal']
  },
  {
    id:'kfc-soy-garlic', cat:['chicken'], korean:'간장치킨', name:'Poulet Soja-Ail', price:13.90,
    img:'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
    desc:'Poulet frit halal glacé d\'une sauce soja-ail sucrée et noix de pin grillées.',
    ingredients:['Poulet halal AVS','Sauce soja','Cassonade','Ail','Gingembre','Pin grillé','Vinaigre de riz sans alcool'],
    allergens:['Gluten','Soja','Fruits à coque'],
    halal:true, popular:true,
    badges:['popular','halal']
  },
  {
    id:'kfc-honeybutter', cat:['chicken'], korean:'허니버터치킨', name:'Honey Butter Chicken', price:13.90,
    img:'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?auto=format&fit=crop&w=600&q=80',
    desc:'Le pêché mignon coréen. Poulet halal croustillant, beurre, miel et soupçon de fromage en poudre.',
    ingredients:['Poulet halal AVS','Beurre doux','Miel','Lait en poudre','Parmesan en poudre','Sel'],
    allergens:['Gluten','Lait'],
    halal:true,
    badges:['halal']
  },

  // RIZ & NOUILLES
  {
    id:'bibimbap', cat:['rice','signature'], korean:'비빔밥', name:'Bibimbap Bœuf', price:14.50,
    img:'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&w=600&q=80',
    desc:'Bol de riz, légumes croquants, bœuf halal mariné, œuf au plat et sauce gochujang à mélanger.',
    ingredients:['Bœuf halal mariné','Riz japonais','Carottes','Épinards','Pousses de soja','Champignons shiitake','Courgette','Œuf','Gochujang','Huile de sésame'],
    allergens:['Soja','Sésame','Œuf'],
    halal:true, popular:true,
    badges:['popular','halal']
  },
  {
    id:'bibimbap-veg', cat:['rice','veggie'], korean:'채식비빔밥', name:'Bibimbap Végé', price:11.90,
    img:'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?auto=format&fit=crop&w=600&q=80',
    desc:'Version végétarienne tout aussi gourmande. Tofu mariné en remplacement du bœuf.',
    ingredients:['Tofu ferme mariné','Riz japonais','Carottes','Épinards','Pousses de soja','Champignons','Courgette','Œuf','Gochujang','Huile de sésame'],
    allergens:['Soja','Sésame','Œuf'],
    halal:true, veggie:true,
    badges:['veggie','halal']
  },
  {
    id:'bulgogi-bowl', cat:['rice'], korean:'불고기덮밥', name:'Bol Bulgogi', price:13.50,
    img:'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&w=600&q=80',
    desc:'Bœuf halal finement tranché mariné dans une sauce soja-poire, sur lit de riz fumant.',
    ingredients:['Bœuf halal','Poire asiatique','Sauce soja','Sucre','Ail','Gingembre','Huile de sésame','Riz japonais','Oignons verts'],
    allergens:['Soja','Sésame'],
    halal:true,
    badges:['halal']
  },
  {
    id:'kimbap', cat:['rice','street'], korean:'김밥', name:'Kimbap Poulet', price:8.90,
    img:'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=600&q=80',
    desc:'Le "sushi roll" coréen. Algue nori, riz vinaigré, poulet halal, omelette, légumes croquants.',
    ingredients:['Algue nori','Riz vinaigré','Poulet halal','Œuf','Carotte','Épinards','Concombre','Radis jaune','Huile de sésame'],
    allergens:['Sésame','Œuf','Soja'],
    halal:true,
    badges:['halal']
  },
  {
    id:'japchae', cat:['rice','veggie'], korean:'잡채', name:'Japchae', price:11.50,
    img:'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
    desc:'Nouilles de patate douce sautées aux légumes croquants et huile de sésame.',
    ingredients:['Nouilles de patate douce (dangmyeon)','Épinards','Carottes','Oignon','Champignons shiitake','Poivron','Sauce soja','Huile de sésame','Sucre','Graines de sésame'],
    allergens:['Soja','Sésame'],
    halal:true, veggie:true,
    badges:['veggie','halal']
  },
  {
    id:'ramyeon', cat:['rice'], korean:'라면', name:'Ramyeon Spicy Beef', price:10.90,
    img:'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=600&q=80',
    desc:'Bouillon épicé maison, nouilles ramen, émincé de bœuf halal, œuf mollet et kimchi.',
    ingredients:['Nouilles ramen','Bouillon de bœuf halal','Gochugaru (piment doux)','Bœuf halal émincé','Œuf','Oignon vert','Kimchi','Ail','Pâte de soja doenjang'],
    allergens:['Gluten','Soja','Œuf'],
    halal:true, spice:true,
    badges:['halal']
  },

  // STREET SNACKS
  {
    id:'mandu', cat:['street'], korean:'만두', name:'Mandu Poulet (6 pcs)', price:7.90,
    img:'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
    desc:'Raviolis vapeur ou poêlés, farce poulet halal, ciboule et chou.',
    ingredients:['Pâte à raviolis (farine de blé)','Poulet halal haché','Chou','Ciboule','Tofu','Ail','Gingembre','Huile de sésame','Sauce soja'],
    allergens:['Gluten','Soja','Sésame'],
    halal:true,
    badges:['halal']
  },
  {
    id:'mandu-veg', cat:['street','veggie'], korean:'채식만두', name:'Mandu Légumes (6 pcs)', price:6.90,
    img:'https://images.unsplash.com/photo-1547928576-b822bc410bdf?auto=format&fit=crop&w=600&q=80',
    desc:'Raviolis 100% légumes : chou, vermicelles, tofu, champignons.',
    ingredients:['Pâte à raviolis','Chou','Tofu','Vermicelles','Champignons','Ciboule','Carottes','Ail','Huile de sésame'],
    allergens:['Gluten','Soja','Sésame'],
    halal:true, veggie:true,
    badges:['veggie','halal']
  },
  {
    id:'eomuk', cat:['street'], korean:'어묵', name:'Eomuk (Brochette de poisson)', price:5.90,
    img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    desc:'Brochettes de galettes de poisson dans un bouillon clair, un classique des marchés de nuit.',
    ingredients:['Galette de poisson blanc','Farine de blé','Carotte','Oignon','Bouillon de radis daikon','Algue kombu','Sauce soja'],
    allergens:['Gluten','Poisson','Soja'],
    halal:true,
    badges:['halal']
  },
  {
    id:'twigim', cat:['street','veggie'], korean:'튀김', name:'Twigim Mixte', price:6.50,
    img:'https://images.unsplash.com/photo-1625938145744-e380515399b7?auto=format&fit=crop&w=600&q=80',
    desc:'Assortiment de tempura à la coréenne : patate douce, algue gimmari, beignet aux légumes.',
    ingredients:['Patate douce','Algue nori','Vermicelles','Carotte','Oignon','Farine de blé','Maïzena','Sel'],
    allergens:['Gluten'],
    halal:true, veggie:true,
    badges:['veggie','halal']
  },
  {
    id:'kimchi-fries', cat:['street'], korean:'김치감자튀김', name:'Kimchi Fries', price:7.90,
    img:'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80',
    desc:'Frites maison, kimchi sauté, fromage fondu, sauce mayo épicée et oignons verts.',
    ingredients:['Pomme de terre','Kimchi','Fromage cheddar','Mayonnaise','Sriracha','Ciboule','Sel'],
    allergens:['Lait','Œuf','Soja'],
    halal:true, spice:true, new_:true,
    badges:['new','halal']
  },

  // SUCRÉ
  {
    id:'bingsu-strawberry', cat:['sweet'], korean:'딸기빙수', name:'Bingsu Fraise', price:9.90,
    img:'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    desc:'Glace pilée crémeuse au lait, montagne de fraises fraîches, lait concentré et mochi.',
    ingredients:['Glace au lait','Fraises fraîches','Lait concentré sucré','Mochi','Crème fouettée','Coulis de fraise'],
    allergens:['Lait','Gluten'],
    halal:true, popular:true,
    badges:['popular','halal']
  },
  {
    id:'bingsu-mango', cat:['sweet'], korean:'망고빙수', name:'Bingsu Mangue', price:9.90,
    img:'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    desc:'Glace au lait, dés de mangue Alphonso, coulis tropical et lait concentré.',
    ingredients:['Glace au lait','Mangue','Lait concentré','Mochi','Coulis de mangue'],
    allergens:['Lait','Gluten'],
    halal:true,
    badges:['halal']
  },
  {
    id:'hotteok', cat:['sweet','street'], korean:'호떡', name:'Hotteok (2 pcs)', price:5.90,
    img:'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=600&q=80',
    desc:'Crêpe coréenne dorée à la poêle, cœur fondant de cannelle, cassonade et noix.',
    ingredients:['Farine de blé','Levure','Cassonade','Cannelle','Noix','Cacahuètes','Lait','Sucre'],
    allergens:['Gluten','Lait','Fruits à coque','Arachides'],
    halal:true,
    badges:['halal']
  },
  {
    id:'dalgona', cat:['sweet','drinks'], korean:'달고나커피', name:'Dalgona Coffee', price:5.50,
    img:'https://images.unsplash.com/photo-1586195831824-3f4cef91da40?auto=format&fit=crop&w=600&q=80',
    desc:'Le café viral coréen. Lait frais surmonté d\'une mousse de café fouettée crémeuse.',
    ingredients:['Café soluble','Sucre','Eau chaude','Lait frais','Glace'],
    allergens:['Lait'],
    halal:true,
    badges:['halal']
  },

  // BOISSONS
  {
    id:'sikhye', cat:['drinks'], korean:'식혜', name:'Sikhye (boisson riz)', price:3.90,
    img:'https://images.unsplash.com/photo-1606755456206-b25206cde27e?auto=format&fit=crop&w=600&q=80',
    desc:'Boisson traditionnelle sucrée et désaltérante à base de riz fermenté (sans alcool).',
    ingredients:['Riz','Malt d\'orge','Sucre','Gingembre','Eau'],
    allergens:['Gluten'],
    halal:true,
    badges:['halal']
  },
  {
    id:'yuja-tea', cat:['drinks'], korean:'유자차', name:'Thé au Yuzu', price:4.50,
    img:'https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?auto=format&fit=crop&w=600&q=80',
    desc:'Marmelade artisanale de yuzu (agrume coréen) infusée à l\'eau chaude. Chaud ou glacé.',
    ingredients:['Yuzu','Sucre','Miel','Eau'],
    allergens:[],
    halal:true,
    badges:['halal']
  },
  {
    id:'aloe', cat:['drinks'], korean:'알로에음료', name:'Aloe Vera', price:3.50,
    img:'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    desc:'Boisson rafraîchissante aux pulpes d\'aloe vera.',
    ingredients:['Pulpe d\'aloe vera','Eau','Sucre','Acide citrique'],
    allergens:[],
    halal:true,
    badges:['halal']
  },
  {
    id:'soda-melon', cat:['drinks'], korean:'멜론소다', name:'Melon Soda', price:3.90,
    img:'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=600&q=80',
    desc:'Soda pétillant au melon coréen, ultra frais et fruité.',
    ingredients:['Eau gazeuse','Sirop de melon','Sucre'],
    allergens:[],
    halal:true,
    badges:['halal']
  }
];

// ========== ÉTAT ==========
const STATE = {
  cart: JSON.parse(localStorage.getItem('nuna_cart')||'[]'),
  favorites: JSON.parse(localStorage.getItem('nuna_favs')||'[]'),
  filter: 'all',
  search: '',
  promo: null, // {code, percent}
  mode: 'delivery'
};

const PROMOS = {
  'NUNA10': {percent:10, label:'NUNA10 (-10%)'},
  'WELCOME': {percent:15, label:'WELCOME (-15%)'},
  'SEOUL': {percent:5, label:'SEOUL (-5%)'}
};

// ========== UTILS ==========
const fmt = n => n.toFixed(2).replace('.',',')+' €';
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._tt);
  window._tt = setTimeout(()=>t.classList.remove('show'), 2200);
}

function persist(){
  localStorage.setItem('nuna_cart', JSON.stringify(STATE.cart));
  localStorage.setItem('nuna_favs', JSON.stringify(STATE.favorites));
}

// ========== RENDU MENU ==========
function renderMenu(){
  const grid = $('#menuGrid');
  const filtered = MENU.filter(d=>{
    const matchCat = STATE.filter==='all' || d.cat.includes(STATE.filter);
    const matchSearch = !STATE.search ||
      d.name.toLowerCase().includes(STATE.search) ||
      d.korean.includes(STATE.search) ||
      d.desc.toLowerCase().includes(STATE.search);
    return matchCat && matchSearch;
  });

  if(filtered.length===0){
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray)">
      <div style="font-size:4rem;margin-bottom:1rem">🥢</div>
      <h3>Aucun plat trouvé</h3>
      <p>Essayez un autre terme ou catégorie.</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(d=>{
    const isFav = STATE.favorites.includes(d.id);
    const badges = d.badges.map(b=>{
      const labels = {popular:'⭐ POPULAIRE', halal:'🌙 HALAL', new:'🆕 NOUVEAU', veggie:'🌱 VÉGÉ'};
      return `<span class="dish-badge ${b}">${labels[b]}</span>`;
    }).join('');
    return `
      <article class="dish" data-id="${d.id}">
        <div class="dish-img" onclick="openProduct('${d.id}')">
          <img src="${d.img}" alt="${d.name}" loading="lazy" onerror="this.style.display='none'"/>
          <div class="dish-badges">${badges}</div>
          <button class="dish-fav ${isFav?'active':''}" onclick="event.stopPropagation();toggleFav('${d.id}')" aria-label="Favoris">${isFav?'❤️':'🤍'}</button>
        </div>
        <div class="dish-body">
          <div class="dish-korean">${d.korean}</div>
          <h3 class="dish-name">${d.name}</h3>
          <p class="dish-desc">${d.desc}</p>
          <div class="dish-meta">
            ${d.spice?'<span>🌶️ Épicé</span>':''}
            ${d.veggie?'<span>🌱 Végé</span>':''}
            <span>🌙 Halal</span>
          </div>
          <div class="dish-foot">
            <div class="dish-price">${fmt(d.price)}</div>
            <button class="dish-add" onclick="openProduct('${d.id}')">Ajouter +</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ========== FAVORIS ==========
function toggleFav(id){
  const i = STATE.favorites.indexOf(id);
  if(i>=0){ STATE.favorites.splice(i,1); toast('Retiré des favoris'); }
  else { STATE.favorites.push(id); toast('Ajouté aux favoris ❤️'); }
  persist();
  renderMenu();
}

// ========== MODAL PRODUIT ==========
function openProduct(id){
  const d = MENU.find(m=>m.id===id);
  if(!d) return;
  const modal = $('#productModal');
  const spiceLevels = d.spice ? `
    <div class="pm-section">
      <h4>🌶️ Niveau de piment</h4>
      <div class="spice-options" id="spiceOpts">
        <button class="option-pill" data-spice="1">🌶️ Doux</button>
        <button class="option-pill selected" data-spice="2">🌶️🌶️ Moyen</button>
        <button class="option-pill" data-spice="3">🌶️🌶️🌶️ Fort</button>
        <button class="option-pill" data-spice="4">🌶️🌶️🌶️🌶️ Volcan</button>
      </div>
    </div>` : '';

  const sizes = `
    <div class="pm-section">
      <h4>📏 Format</h4>
      <div class="option-group" id="sizeOpts">
        <button class="option-pill selected" data-size="0" data-size-name="Standard">Standard (${fmt(d.price)})</button>
        <button class="option-pill" data-size="3" data-size-name="Grand">Grand (+3,00 €)</button>
        <button class="option-pill" data-size="6" data-size-name="XL famille">XL famille (+6,00 €)</button>
      </div>
    </div>`;

  $('#productDetails').innerHTML = `
    <div class="pm-img">
      <img src="${d.img}" alt="${d.name}" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:5rem\\'>🍜</div>'"/>
    </div>
    <div class="pm-body">
      <div class="dish-korean">${d.korean}</div>
      <h2>${d.name}</h2>
      <p style="color:var(--gray);margin-bottom:1rem">${d.desc}</p>

      <div class="pm-section">
        <h4>🥢 Ingrédients</h4>
        <p style="font-size:.9rem">${d.ingredients.join(' · ')}</p>
      </div>

      ${d.allergens.length ? `
      <div class="pm-section">
        <h4>⚠️ Allergènes</h4>
        <div class="allergens">${d.allergens.map(a=>`<span class="allergen">${a}</span>`).join('')}</div>
      </div>`:''}

      ${sizes}
      ${spiceLevels}

      <div class="pm-section">
        <h4>📝 Instructions spéciales</h4>
        <textarea id="pmNotes" rows="2" placeholder="Ex : pas d'oignon, sauce à part…" style="width:100%;padding:.7rem;border:2px solid var(--border);border-radius:10px;font-family:inherit"></textarea>
      </div>

      <div class="pm-foot">
        <div class="qty-ctrl">
          <button onclick="pmQty(-1)">−</button>
          <span id="pmQty">1</span>
          <button onclick="pmQty(1)">+</button>
        </div>
        <button class="btn btn-primary" onclick="addFromModal('${d.id}')">Ajouter <span id="pmTotal">${fmt(d.price)}</span></button>
      </div>
    </div>
  `;

  // Listeners options
  modal.classList.add('open');
  $$('#sizeOpts .option-pill').forEach(b=>{
    b.onclick = ()=>{
      $$('#sizeOpts .option-pill').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      updatePmTotal(d);
    };
  });
  if(d.spice){
    $$('#spiceOpts .option-pill').forEach(b=>{
      b.onclick = ()=>{
        $$('#spiceOpts .option-pill').forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
      };
    });
  }
}
let pmQuantity = 1;
function pmQty(delta){
  pmQuantity = Math.max(1, Math.min(20, pmQuantity+delta));
  $('#pmQty').textContent = pmQuantity;
  const d = MENU.find(m=>m.id===currentProductId());
  if(d) updatePmTotal(d);
}
function currentProductId(){
  // We grab from the rendered title — simpler: store
  return window._currentPid;
}
function updatePmTotal(d){
  const size = +($('#sizeOpts .option-pill.selected')?.dataset.size || 0);
  const total = (d.price + size) * pmQuantity;
  $('#pmTotal').textContent = fmt(total);
}
// Override openProduct to remember id
const _openProduct = openProduct;
openProduct = function(id){
  pmQuantity = 1;
  window._currentPid = id;
  _openProduct(id);
};

function addFromModal(id){
  const d = MENU.find(m=>m.id===id);
  const sizeBtn = $('#sizeOpts .option-pill.selected');
  const size = +sizeBtn.dataset.size;
  const sizeName = sizeBtn.dataset.sizeName;
  const spice = d.spice ? $('#spiceOpts .option-pill.selected')?.textContent : null;
  const notes = $('#pmNotes').value;
  addToCart(d, pmQuantity, size, sizeName, spice, notes);
  closeModal('productModal');
}

// ========== PANIER ==========
function addToCart(d, qty=1, sizeAdd=0, sizeName='Standard', spice=null, notes=''){
  const sig = `${d.id}|${sizeName}|${spice||''}|${notes}`;
  const existing = STATE.cart.find(c=>c.sig===sig);
  if(existing){ existing.qty += qty; }
  else {
    STATE.cart.push({
      sig, id:d.id, name:d.name, korean:d.korean, img:d.img,
      price:d.price+sizeAdd, basePrice:d.price, sizeAdd, sizeName, spice, notes, qty
    });
  }
  persist();
  renderCart();
  toast(`${qty}× ${d.name} ajouté 🍱`);
  // Pulse cart btn
  $('#cartBtn').animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}], 400);
}

function removeFromCart(sig){
  STATE.cart = STATE.cart.filter(c=>c.sig!==sig);
  persist();
  renderCart();
}
function changeQty(sig, delta){
  const item = STATE.cart.find(c=>c.sig===sig);
  if(!item) return;
  item.qty = Math.max(1, item.qty+delta);
  persist();
  renderCart();
}

function addCombo(){
  STATE.cart.push({
    sig:'combo-'+Date.now(), id:'combo', name:'Combo Séoul Night (4 pers.)', korean:'서울나잇',
    img:'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&w=400&q=80',
    price:49.90, basePrice:49.90, sizeAdd:0, sizeName:'Famille', qty:1, notes:''
  });
  persist();
  renderCart();
  toggleCart();
  toast('Combo ajouté ! 🎉');
}

function renderCart(){
  // Items
  const items = $('#cartItems');
  if(STATE.cart.length===0){
    items.innerHTML = `<div class="empty-cart">
      <div class="empty-cart-icon">🍽️</div>
      <p>Votre panier est vide.<br/>Choisissez vos plats préférés !</p>
    </div>`;
  } else {
    items.innerHTML = STATE.cart.map(c=>`
      <div class="cart-item">
        <img src="${c.img}" alt="${c.name}" onerror="this.style.background='var(--pink-soft)';this.src=''"/>
        <div class="cart-item-info">
          <h4>${c.name}</h4>
          <small>${c.sizeName}${c.spice?' · '+c.spice:''}${c.notes?' · '+c.notes:''}</small>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:.5rem">
            <div class="qty-ctrl">
              <button onclick="changeQty('${c.sig}',-1)">−</button>
              <span>${c.qty}</span>
              <button onclick="changeQty('${c.sig}',1)">+</button>
            </div>
            <div class="cart-item-price">${fmt(c.price*c.qty)}</div>
          </div>
          <button class="cart-remove" onclick="removeFromCart('${c.sig}')">🗑️ Supprimer</button>
        </div>
      </div>
    `).join('');
  }

  // Totals
  const subtotal = STATE.cart.reduce((s,c)=>s+c.price*c.qty,0);
  let discount = 0;
  if(STATE.promo) discount = subtotal * STATE.promo.percent / 100;
  const deliveryFee = STATE.mode==='delivery' ? (subtotal>=25?0:3.90) : 0;
  const total = subtotal - discount + deliveryFee;

  $('#subtotal').textContent = fmt(subtotal);
  $('#deliveryFee').textContent = deliveryFee===0 ? 'OFFERTE 🎁' : fmt(deliveryFee);
  $('#total').textContent = fmt(total);
  if(discount>0){
    $('#discountRow').style.display='flex';
    $('#discount').textContent = '- '+fmt(discount);
  } else {
    $('#discountRow').style.display='none';
  }

  // Navbar
  const count = STATE.cart.reduce((s,c)=>s+c.qty,0);
  $('#cartCount').textContent = count;
  $('#cartTotalNav').textContent = fmt(total);
}

function toggleCart(){
  $('#cartDrawer').classList.toggle('open');
  $('#overlay').classList.toggle('open');
}

function applyPromo(){
  const code = $('#promoCode').value.trim().toUpperCase();
  if(PROMOS[code]){
    STATE.promo = {code, ...PROMOS[code]};
    toast(`Code ${code} appliqué ! ✨`);
  } else {
    STATE.promo = null;
    toast('Code invalide ❌');
  }
  renderCart();
}

// ========== CHECKOUT ==========
function openCheckout(){
  if(STATE.cart.length===0){ toast('Votre panier est vide 🥢'); return; }
  toggleCart();
  $('#checkoutModal').classList.add('open');
  renderCheckoutSummary();
  setMode(STATE.mode);
}

function setMode(mode){
  STATE.mode = mode;
  $$('.ck-tab').forEach(t=>t.classList.toggle('active', t.dataset.mode===mode));
  $$('.delivery-only').forEach(el=>el.style.display = mode==='delivery' ? '' : 'none');
  $$('.delivery-only input').forEach(i=>i.required = mode==='delivery');
  renderCart();
  renderCheckoutSummary();
}

function renderCheckoutSummary(){
  const subtotal = STATE.cart.reduce((s,c)=>s+c.price*c.qty,0);
  let discount = 0;
  if(STATE.promo) discount = subtotal * STATE.promo.percent / 100;
  const deliveryFee = STATE.mode==='delivery' ? (subtotal>=25?0:3.90) : 0;
  const total = subtotal - discount + deliveryFee;

  $('#checkoutSummary').innerHTML = `
    <h4 style="margin-bottom:.6rem">📋 Récapitulatif</h4>
    ${STATE.cart.map(c=>`<div class="cs-row"><span>${c.qty}× ${c.name} <small style="color:var(--gray)">${c.sizeName}</small></span><b>${fmt(c.price*c.qty)}</b></div>`).join('')}
    <div class="cs-row" style="border-top:1px dashed var(--border);padding-top:.5rem;margin-top:.5rem"><span>Sous-total</span><b>${fmt(subtotal)}</b></div>
    ${discount>0?`<div class="cs-row"><span>Remise ${STATE.promo.label}</span><b style="color:var(--green)">- ${fmt(discount)}</b></div>`:''}
    <div class="cs-row"><span>${STATE.mode==='delivery'?'Livraison':STATE.mode==='pickup'?'À emporter':'Sur place'}</span><b>${deliveryFee===0?'OFFERTE':fmt(deliveryFee)}</b></div>
    <div class="cs-row total"><span>Total TTC</span><b>${fmt(total)}</b></div>
  `;
  $('#payBtnAmount').textContent = fmt(total);
}

function placeOrder(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  const ref = '#NUNA-'+String(Math.floor(Math.random()*9000)+1000);
  const eta = STATE.mode==='delivery' ? '30-40 min' : STATE.mode==='pickup' ? '15-20 min' : 'Servi à table';

  $('#successName').textContent = data.fname;
  $('#successEmail').textContent = data.email;
  $('#orderRef').textContent = ref;
  $('#successEta').textContent = eta;

  closeModal('checkoutModal');
  $('#successModal').classList.add('open');

  // Reset
  STATE.cart = [];
  STATE.promo = null;
  persist();
  renderCart();
  form.reset();
}

function sendContact(e){
  e.preventDefault();
  toast('Message envoyé ✉️ Réponse sous 24h.');
  e.target.reset();
}

function closeModal(id){
  $('#'+id).classList.remove('open');
}

// ========== INIT ==========
function init(){
  renderMenu();
  renderCart();

  // Search
  $('#searchInput').addEventListener('input', e=>{
    STATE.search = e.target.value.toLowerCase();
    renderMenu();
  });

  // Filters
  $$('.filter').forEach(b=>{
    b.onclick = ()=>{
      $$('.filter').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      STATE.filter = b.dataset.cat;
      renderMenu();
    };
  });

  // Cart
  $('#cartBtn').onclick = toggleCart;

  // Burger
  $('#burger').onclick = ()=> $('.nav-links').classList.toggle('mobile-open');
  $$('.nav-links a').forEach(a=>a.onclick=()=>$('.nav-links').classList.remove('mobile-open'));

  // To top
  const toTop = $('#toTop');
  window.addEventListener('scroll', ()=>{
    toTop.classList.toggle('show', window.scrollY>500);
  });
  toTop.onclick = ()=>window.scrollTo({top:0,behavior:'smooth'});

  // Close modals on backdrop
  $$('.modal').forEach(m=>{
    m.addEventListener('click', e=>{
      if(e.target===m) m.classList.remove('open');
    });
  });

  // Escape
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      $$('.modal.open').forEach(m=>m.classList.remove('open'));
      $('#cartDrawer').classList.remove('open');
      $('#overlay').classList.remove('open');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
