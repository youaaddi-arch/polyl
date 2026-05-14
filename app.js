// ========== DONNÉES MENU ==========
// Photos via Wikipedia Commons (URLs canoniques, photos garanties = au plat).
// Emoji + gradient en fallback CSS si une photo ne charge pas.
const MENU = [
  // SIGNATURES
  {
    id:'tteokbokki', cat:['signature','rice'], korean:'떡볶이', name:'Tteokbokki Signature', price:9.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Tteok-bokki.jpg/640px-Tteok-bokki.jpg',
    emoji:'🍢', bg:'linear-gradient(135deg,#FF4D4D,#FF8E53)',
    desc:'L\'icône de Séoul. Gâteaux de riz moelleux mijotés dans une sauce gochujang douce-épicée maison.',
    ingredients:['Gâteaux de riz coréens (garaetteok)','Gochujang maison sans alcool','Sauce soja','Sucre de canne','Ail','Oignon nouveau','Graines de sésame','Bouillon d\'algue dashi (sans poisson)'],
    allergens:['Gluten','Soja','Sésame'],
    halal:true, popular:true, spice:true, veggie:true,
    badges:['popular','halal','veggie']
  },
  {
    id:'yangnyeom', cat:['signature','chicken'], korean:'양념치킨', name:'Poulet Yangnyeom', price:13.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Korean_fried_chicken_-Yangnyeom-tongdak-01.jpg/640px-Korean_fried_chicken_-Yangnyeom-tongdak-01.jpg',
    emoji:'🍗', bg:'linear-gradient(135deg,#E63946,#FFB627)',
    desc:'Poulet halal double frit, ultra croustillant, enrobé d\'une sauce sucrée-épicée légendaire.',
    ingredients:['Poulet halal AVS (cuisse désossée)','Farine de blé + maïzena','Gochujang sans alcool','Miel','Ail','Gingembre','Sauce soja','Vinaigre de riz (sans alcool)','Graines de sésame'],
    allergens:['Gluten','Soja','Sésame'],
    halal:true, popular:true, spice:true,
    badges:['popular','halal']
  },
  {
    id:'corndog', cat:['signature','street'], korean:'감자핫도그', name:'Corn Dog Mozza', price:7.50,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Gamja-hot-dog.jpg/640px-Gamja-hot-dog.jpg',
    emoji:'🌭', bg:'linear-gradient(135deg,#FFB627,#FF8E53)',
    desc:'Saucisse de bœuf halal + mozzarella fondante, enrobée d\'une pâte croustillante et de cubes de pomme de terre.',
    ingredients:['Saucisse de bœuf halal','Mozzarella 100%','Farine de blé','Cubes de pomme de terre','Levure boulangère','Sucre','Chapelure panko','Sucre cristal pour saupoudrer'],
    allergens:['Gluten','Lait','Œuf'],
    halal:true, new_:true,
    badges:['new','halal']
  },

  // POULET FRIT
  {
    id:'kfc-original', cat:['chicken'], korean:'후라이드치킨', name:'Poulet Frit Original', price:12.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Korean.cuisine-Huraideu_chikin-01.jpg/640px-Korean.cuisine-Huraideu_chikin-01.jpg',
    emoji:'🍗', bg:'linear-gradient(135deg,#C9A227,#FFE066)',
    desc:'Pilons et ailes halal frits 2 fois pour un croustillant inégalé. Servi avec sauce ranch coréenne.',
    ingredients:['Poulet halal AVS','Farine de blé','Maïzena','Sel','Poivre blanc','Paprika doux','Huile de tournesol'],
    allergens:['Gluten'],
    halal:true,
    badges:['halal']
  },
  {
    id:'kfc-soy-garlic', cat:['chicken'], korean:'간장치킨', name:'Poulet Soja-Ail', price:13.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Ganjang-chikin.jpg/640px-Ganjang-chikin.jpg',
    emoji:'🍗', bg:'linear-gradient(135deg,#5C2E00,#C9A227)',
    desc:'Poulet frit halal glacé d\'une sauce soja-ail sucrée et noix de pin grillées.',
    ingredients:['Poulet halal AVS','Sauce soja','Cassonade','Ail','Gingembre','Pin grillé','Vinaigre de riz sans alcool'],
    allergens:['Gluten','Soja','Fruits à coque'],
    halal:true, popular:true,
    badges:['popular','halal']
  },
  {
    id:'kfc-honeybutter', cat:['chicken'], korean:'허니버터치킨', name:'Honey Butter Chicken', price:13.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Korean_fried_chicken_with_seasoning.jpg/640px-Korean_fried_chicken_with_seasoning.jpg',
    emoji:'🍗', bg:'linear-gradient(135deg,#FFB627,#FFE066)',
    desc:'Le pêché mignon coréen. Poulet halal croustillant, beurre, miel et soupçon de fromage en poudre.',
    ingredients:['Poulet halal AVS','Beurre doux','Miel','Lait en poudre','Parmesan en poudre','Sel'],
    allergens:['Gluten','Lait'],
    halal:true,
    badges:['halal']
  },

  // RIZ & NOUILLES
  {
    id:'bibimbap', cat:['rice','signature'], korean:'비빔밥', name:'Bibimbap Bœuf', price:14.50,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dolsot-bibimbap.jpg/640px-Dolsot-bibimbap.jpg',
    emoji:'🍱', bg:'linear-gradient(135deg,#06A77D,#E63946)',
    desc:'Bol de riz, légumes croquants, bœuf halal mariné, œuf au plat et sauce gochujang à mélanger.',
    ingredients:['Bœuf halal mariné','Riz japonais','Carottes','Épinards','Pousses de soja','Champignons shiitake','Courgette','Œuf','Gochujang','Huile de sésame'],
    allergens:['Soja','Sésame','Œuf'],
    halal:true, popular:true,
    badges:['popular','halal']
  },
  {
    id:'bibimbap-veg', cat:['rice','veggie'], korean:'채식비빔밥', name:'Bibimbap Végé', price:11.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bibimbap_in_Jeonju.jpg/640px-Bibimbap_in_Jeonju.jpg',
    emoji:'🥗', bg:'linear-gradient(135deg,#52B788,#FFD23F)',
    desc:'Version végétarienne tout aussi gourmande. Tofu mariné en remplacement du bœuf.',
    ingredients:['Tofu ferme mariné','Riz japonais','Carottes','Épinards','Pousses de soja','Champignons','Courgette','Œuf','Gochujang','Huile de sésame'],
    allergens:['Soja','Sésame','Œuf'],
    halal:true, veggie:true,
    badges:['veggie','halal']
  },
  {
    id:'bulgogi-bowl', cat:['rice'], korean:'불고기덮밥', name:'Bol Bulgogi', price:13.50,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Bulgogi.jpg/640px-Bulgogi.jpg',
    emoji:'🍚', bg:'linear-gradient(135deg,#7B3F00,#C9A227)',
    desc:'Bœuf halal finement tranché mariné dans une sauce soja-poire, sur lit de riz fumant.',
    ingredients:['Bœuf halal','Poire asiatique','Sauce soja','Sucre','Ail','Gingembre','Huile de sésame','Riz japonais','Oignons verts'],
    allergens:['Soja','Sésame'],
    halal:true,
    badges:['halal']
  },
  {
    id:'kimbap', cat:['rice','street'], korean:'김밥', name:'Kimbap Poulet', price:8.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Korean.food-Gimbap-01.jpg/640px-Korean.food-Gimbap-01.jpg',
    emoji:'🍙', bg:'linear-gradient(135deg,#1A4D2E,#06A77D)',
    desc:'Le "sushi roll" coréen. Algue nori, riz vinaigré, poulet halal, omelette, légumes croquants.',
    ingredients:['Algue nori','Riz vinaigré','Poulet halal','Œuf','Carotte','Épinards','Concombre','Radis jaune','Huile de sésame'],
    allergens:['Sésame','Œuf','Soja'],
    halal:true,
    badges:['halal']
  },
  {
    id:'japchae', cat:['rice','veggie'], korean:'잡채', name:'Japchae', price:11.50,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Korean.food-Japchae-01.jpg/640px-Korean.food-Japchae-01.jpg',
    emoji:'🍜', bg:'linear-gradient(135deg,#7B3F00,#FFB627)',
    desc:'Nouilles de patate douce sautées aux légumes croquants et huile de sésame.',
    ingredients:['Nouilles de patate douce (dangmyeon)','Épinards','Carottes','Oignon','Champignons shiitake','Poivron','Sauce soja','Huile de sésame','Sucre','Graines de sésame'],
    allergens:['Soja','Sésame'],
    halal:true, veggie:true,
    badges:['veggie','halal']
  },
  {
    id:'ramyeon', cat:['rice'], korean:'라면', name:'Ramyeon Spicy Beef', price:10.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Korean.food-Shin_Ramyun-01.jpg/640px-Korean.food-Shin_Ramyun-01.jpg',
    emoji:'🍜', bg:'linear-gradient(135deg,#B5202D,#FF8E53)',
    desc:'Bouillon épicé maison, nouilles ramen, émincé de bœuf halal, œuf mollet et kimchi.',
    ingredients:['Nouilles ramen','Bouillon de bœuf halal','Gochugaru (piment doux)','Bœuf halal émincé','Œuf','Oignon vert','Kimchi','Ail','Pâte de soja doenjang'],
    allergens:['Gluten','Soja','Œuf'],
    halal:true, spice:true,
    badges:['halal']
  },

  // STREET SNACKS
  {
    id:'mandu', cat:['street'], korean:'만두', name:'Mandu Poulet (6 pcs)', price:7.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Korean_dumpling-Mandu-04.jpg/640px-Korean_dumpling-Mandu-04.jpg',
    emoji:'🥟', bg:'linear-gradient(135deg,#FFE5B4,#E5B97B)',
    desc:'Raviolis vapeur ou poêlés, farce poulet halal, ciboule et chou.',
    ingredients:['Pâte à raviolis (farine de blé)','Poulet halal haché','Chou','Ciboule','Tofu','Ail','Gingembre','Huile de sésame','Sauce soja'],
    allergens:['Gluten','Soja','Sésame'],
    halal:true,
    badges:['halal']
  },
  {
    id:'mandu-veg', cat:['street','veggie'], korean:'채식만두', name:'Mandu Légumes (6 pcs)', price:6.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Korean_dumpling-Mandu-01.jpg/640px-Korean_dumpling-Mandu-01.jpg',
    emoji:'🥟', bg:'linear-gradient(135deg,#9BC53D,#52B788)',
    desc:'Raviolis 100% légumes : chou, vermicelles, tofu, champignons.',
    ingredients:['Pâte à raviolis','Chou','Tofu','Vermicelles','Champignons','Ciboule','Carottes','Ail','Huile de sésame'],
    allergens:['Gluten','Soja','Sésame'],
    halal:true, veggie:true,
    badges:['veggie','halal']
  },
  {
    id:'eomuk', cat:['street'], korean:'어묵', name:'Eomuk (Brochette de poisson)', price:5.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Korean.food-Eomuk-01.jpg/640px-Korean.food-Eomuk-01.jpg',
    emoji:'🍢', bg:'linear-gradient(135deg,#A7C7E7,#F5DEB3)',
    desc:'Brochettes de galettes de poisson dans un bouillon clair, un classique des marchés de nuit.',
    ingredients:['Galette de poisson blanc','Farine de blé','Carotte','Oignon','Bouillon de radis daikon','Algue kombu','Sauce soja'],
    allergens:['Gluten','Poisson','Soja'],
    halal:true,
    badges:['halal']
  },
  {
    id:'twigim', cat:['street','veggie'], korean:'튀김', name:'Twigim Mixte', price:6.50,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Korean.cuisine-Twigim-01.jpg/640px-Korean.cuisine-Twigim-01.jpg',
    emoji:'🍤', bg:'linear-gradient(135deg,#FFD23F,#FFB627)',
    desc:'Assortiment de tempura à la coréenne : patate douce, algue gimmari, beignet aux légumes.',
    ingredients:['Patate douce','Algue nori','Vermicelles','Carotte','Oignon','Farine de blé','Maïzena','Sel'],
    allergens:['Gluten'],
    halal:true, veggie:true,
    badges:['veggie','halal']
  },
  {
    id:'kimchi-fries', cat:['street'], korean:'김치감자튀김', name:'Kimchi Fries', price:7.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Korean.cuisine-Kimchi-01.jpg/640px-Korean.cuisine-Kimchi-01.jpg',
    emoji:'🍟', bg:'linear-gradient(135deg,#E63946,#FFB627)',
    desc:'Frites maison, kimchi sauté, fromage fondu, sauce mayo épicée et oignons verts.',
    ingredients:['Pomme de terre','Kimchi','Fromage cheddar','Mayonnaise','Sriracha','Ciboule','Sel'],
    allergens:['Lait','Œuf','Soja'],
    halal:true, spice:true, new_:true,
    badges:['new','halal']
  },

  // SUCRÉ
  {
    id:'bingsu-strawberry', cat:['sweet'], korean:'딸기빙수', name:'Bingsu Fraise', price:9.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Korean.dessert-Patbingsu-04.jpg/640px-Korean.dessert-Patbingsu-04.jpg',
    emoji:'🍧', bg:'linear-gradient(135deg,#FFB6C1,#FF69B4)',
    desc:'Glace pilée crémeuse au lait, montagne de fraises fraîches, lait concentré et mochi.',
    ingredients:['Glace au lait','Fraises fraîches','Lait concentré sucré','Mochi','Crème fouettée','Coulis de fraise'],
    allergens:['Lait','Gluten'],
    halal:true, popular:true,
    badges:['popular','halal']
  },
  {
    id:'bingsu-mango', cat:['sweet'], korean:'망고빙수', name:'Bingsu Mangue', price:9.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Korean.dessert-Patbingsu-01.jpg/640px-Korean.dessert-Patbingsu-01.jpg',
    emoji:'🥭', bg:'linear-gradient(135deg,#FFD23F,#FF8E53)',
    desc:'Glace au lait, dés de mangue Alphonso, coulis tropical et lait concentré.',
    ingredients:['Glace au lait','Mangue','Lait concentré','Mochi','Coulis de mangue'],
    allergens:['Lait','Gluten'],
    halal:true,
    badges:['halal']
  },
  {
    id:'hotteok', cat:['sweet','street'], korean:'호떡', name:'Hotteok (2 pcs)', price:5.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Korean_pancake-Hotteok-01.jpg/640px-Korean_pancake-Hotteok-01.jpg',
    emoji:'🥞', bg:'linear-gradient(135deg,#C9A227,#7B3F00)',
    desc:'Crêpe coréenne dorée à la poêle, cœur fondant de cannelle, cassonade et noix.',
    ingredients:['Farine de blé','Levure','Cassonade','Cannelle','Noix','Cacahuètes','Lait','Sucre'],
    allergens:['Gluten','Lait','Fruits à coque','Arachides'],
    halal:true,
    badges:['halal']
  },
  {
    id:'dalgona', cat:['sweet','drinks'], korean:'달고나커피', name:'Dalgona Coffee', price:5.50,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Dalgona_coffee.jpg/640px-Dalgona_coffee.jpg',
    emoji:'☕', bg:'linear-gradient(135deg,#3E2723,#C9A227)',
    desc:'Le café viral coréen. Lait frais surmonté d\'une mousse de café fouettée crémeuse.',
    ingredients:['Café soluble','Sucre','Eau chaude','Lait frais','Glace'],
    allergens:['Lait'],
    halal:true,
    badges:['halal']
  },

  // BOISSONS
  {
    id:'sikhye', cat:['drinks'], korean:'식혜', name:'Sikhye (boisson riz)', price:3.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Korean.drink-Sikhye-02.jpg/640px-Korean.drink-Sikhye-02.jpg',
    emoji:'🥤', bg:'linear-gradient(135deg,#F5DEB3,#E5B97B)',
    desc:'Boisson traditionnelle sucrée et désaltérante à base de riz fermenté (sans alcool).',
    ingredients:['Riz','Malt d\'orge','Sucre','Gingembre','Eau'],
    allergens:['Gluten'],
    halal:true,
    badges:['halal']
  },
  {
    id:'yuja-tea', cat:['drinks'], korean:'유자차', name:'Thé au Yuzu', price:4.50,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Korean.tea-Yujacha-01.jpg/640px-Korean.tea-Yujacha-01.jpg',
    emoji:'🍵', bg:'linear-gradient(135deg,#FFD23F,#FFE066)',
    desc:'Marmelade artisanale de yuzu (agrume coréen) infusée à l\'eau chaude. Chaud ou glacé.',
    ingredients:['Yuzu','Sucre','Miel','Eau'],
    allergens:[],
    halal:true,
    badges:['halal']
  },
  {
    id:'aloe', cat:['drinks'], korean:'알로에음료', name:'Aloe Vera', price:3.50,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Aloe_vera_drink.jpg/640px-Aloe_vera_drink.jpg',
    emoji:'🥤', bg:'linear-gradient(135deg,#9BC53D,#52B788)',
    desc:'Boisson rafraîchissante aux pulpes d\'aloe vera.',
    ingredients:['Pulpe d\'aloe vera','Eau','Sucre','Acide citrique'],
    allergens:[],
    halal:true,
    badges:['halal']
  },
  {
    id:'soda-melon', cat:['drinks'], korean:'멜론소다', name:'Melon Soda', price:3.90,
    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Melon_soda.jpg/640px-Melon_soda.jpg',
    emoji:'🥤', bg:'linear-gradient(135deg,#9BC53D,#FFE066)',
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
  promo: null,
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

// Build dish image cell: gradient bg + emoji fallback ALWAYS visible behind, photo on top
function imgCell(d, clickable=true){
  const click = clickable ? `onclick="openProduct('${d.id}')"` : '';
  return `<div class="dish-img" style="background:${d.bg}" ${click}>
    <div class="dish-emoji">${d.emoji}</div>
    <img src="${d.img}" alt="${d.name}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.remove()" referrerpolicy="no-referrer"/>
  </div>`;
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
        ${imgCell(d, true)}
        <div class="dish-badges">${badges}</div>
        <button class="dish-fav ${isFav?'active':''}" onclick="event.stopPropagation();toggleFav('${d.id}')" aria-label="Favoris">${isFav?'❤️':'🤍'}</button>
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
let pmQuantity = 1;
function openProduct(id){
  const d = MENU.find(m=>m.id===id);
  if(!d) return;
  pmQuantity = 1;
  window._currentPid = id;
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
    <div class="pm-img" style="background:${d.bg}">
      <div class="dish-emoji">${d.emoji}</div>
      <img src="${d.img}" alt="${d.name}" onload="this.classList.add('loaded')" onerror="this.remove()" referrerpolicy="no-referrer"/>
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
function pmQty(delta){
  pmQuantity = Math.max(1, Math.min(20, pmQuantity+delta));
  $('#pmQty').textContent = pmQuantity;
  const d = MENU.find(m=>m.id===window._currentPid);
  if(d) updatePmTotal(d);
}
function updatePmTotal(d){
  const size = +($('#sizeOpts .option-pill.selected')?.dataset.size || 0);
  const total = (d.price + size) * pmQuantity;
  $('#pmTotal').textContent = fmt(total);
}

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
      sig, id:d.id, name:d.name, korean:d.korean, img:d.img, emoji:d.emoji, bg:d.bg,
      price:d.price+sizeAdd, basePrice:d.price, sizeAdd, sizeName, spice, notes, qty
    });
  }
  persist();
  renderCart();
  toast(`${qty}× ${d.name} ajouté 🍱`);
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
    img:'', emoji:'🎉', bg:'linear-gradient(135deg,#E63946,#FFD23F)',
    price:49.90, basePrice:49.90, sizeAdd:0, sizeName:'Famille', qty:1, notes:''
  });
  persist();
  renderCart();
  toggleCart();
  toast('Combo ajouté ! 🎉');
}

function renderCart(){
  const items = $('#cartItems');
  if(STATE.cart.length===0){
    items.innerHTML = `<div class="empty-cart">
      <div class="empty-cart-icon">🍽️</div>
      <p>Votre panier est vide.<br/>Choisissez vos plats préférés !</p>
    </div>`;
  } else {
    items.innerHTML = STATE.cart.map(c=>`
      <div class="cart-item">
        <div class="cart-thumb" style="background:${c.bg||'var(--pink-soft)'}">
          <span>${c.emoji||'🍱'}</span>
          ${c.img?`<img src="${c.img}" alt="" onload="this.classList.add('loaded')" onerror="this.remove()" referrerpolicy="no-referrer"/>`:''}
        </div>
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

  $('#searchInput').addEventListener('input', e=>{
    STATE.search = e.target.value.toLowerCase();
    renderMenu();
  });

  $$('.filter').forEach(b=>{
    b.onclick = ()=>{
      $$('.filter').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      STATE.filter = b.dataset.cat;
      renderMenu();
    };
  });

  $('#cartBtn').onclick = toggleCart;
  $('#burger').onclick = ()=> $('.nav-links').classList.toggle('mobile-open');
  $$('.nav-links a').forEach(a=>a.onclick=()=>$('.nav-links').classList.remove('mobile-open'));

  const toTop = $('#toTop');
  window.addEventListener('scroll', ()=>{
    toTop.classList.toggle('show', window.scrollY>500);
  });
  toTop.onclick = ()=>window.scrollTo({top:0,behavior:'smooth'});

  $$('.modal').forEach(m=>{
    m.addEventListener('click', e=>{
      if(e.target===m) m.classList.remove('open');
    });
  });

  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      $$('.modal.open').forEach(m=>m.classList.remove('open'));
      $('#cartDrawer').classList.remove('open');
      $('#overlay').classList.remove('open');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
