const products=[
{id:1,name:"Ração Premium Cães Adultos",desc:"Frango e arroz • 1 kg",price:39.90,cat:"Ração",emoji:"🥣",tag:"Mais vendido",image:"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=80"},
{id:2,name:"Brinquedo Corda Mordedor",desc:"Diversão e cuidado dental",price:24.90,cat:"Brinquedos",emoji:"🪢",tag:"",image:"https://images.unsplash.com/photo-1535294435445-d4f2f2e7b8e5?w=500&auto=format&fit=crop&q=80"},
{id:3,name:"Caminha Nuvem Confort",desc:"Macia • tamanho M",price:119.90,cat:"Acessórios",emoji:"🛏️",tag:"Conforto",image:"https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500&auto=format&fit=crop&q=80"},
{id:4,name:"Shampoo Suave Pet",desc:"Pelos brilhantes • 500 ml",price:29.90,cat:"Higiene",emoji:"🫧",tag:"",image:"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=80"},
{id:5,name:"Petisco Crocante",desc:"Sabor carne • 300 g",price:18.50,cat:"Ração",emoji:"🦴",tag:"",image:"https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=500&auto=format&fit=crop&q=80"},
{id:6,name:"Bolinha Interativa",desc:"Para brincar por horas",price:22.00,cat:"Brinquedos",emoji:"🎾",tag:"",image:"https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=500&auto=format&fit=crop&q=80"},
{id:7,name:"Coleira Confortável",desc:"Ajustável • tamanho P/M",price:34.90,cat:"Acessórios",emoji:"🐕",tag:"",image:"https://images.unsplash.com/photo-1551717743-49959800b1f6?w=500&auto=format&fit=crop&q=80"},
{id:8,name:"Kit Higiene Completo",desc:"Escova + pente para pelos",price:46.90,cat:"Higiene",emoji:"🧼",tag:"Kit especial",image:"https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=80"}
];
let cart=JSON.parse(localStorage.getItem("pataCart")||"[]"),category="Todos";
const money=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const grid=document.getElementById("productGrid"),count=document.getElementById("cartCount");
function renderProducts(){let q=document.getElementById("search").value.toLowerCase();let list=products.filter(p=>(category==="Todos"||p.cat===category)&&(p.name+" "+p.desc+" "+p.cat).toLowerCase().includes(q));grid.innerHTML=list.map(p=>`<article class="product"><div class="product-img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span class=emoji>${p.emoji}</span>')">${p.tag?`<span class="tag">${p.tag}</span>`:""}</div><h3>${p.name}</h3><p class="desc">${p.desc}</p><div class="price-row"><span class="price">${money(p.price)}</span><button class="add" aria-label="Adicionar ${p.name}" onclick="addToCart(${p.id})">+</button></div></article>`).join("");document.getElementById("empty").hidden=list.length>0}
function save(){localStorage.setItem("pataCart",JSON.stringify(cart));renderCart()}
function addToCart(id){let item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save();toast("Produto adicionado ao carrinho! 🐾")}
function renderCart(){count.textContent=cart.reduce((s,x)=>s+x.qty,0);let box=document.getElementById("cartItems");if(!cart.length){box.innerHTML='<div class="empty-cart">Seu carrinho está vazio.<br>Adicione algo especial! 🐾</div>'}else{box.innerHTML=cart.map(x=>{let p=products.find(p=>p.id===x.id);return `<div class="cart-line"><div class="thumb">${p.emoji}</div><div><b>${p.name}</b><small>${money(p.price)} cada</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="remove" onclick="removeItem(${p.id})">Remover</button></div>`}).join("")}document.getElementById("subtotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0))}
function changeQty(id,d){let x=cart.find(x=>x.id===id);x.qty+=d;if(x.qty<=0)removeItem(id);else save()}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save()}
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
function toast(msg){let t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2100)}
document.getElementById("filters").addEventListener("click",e=>{let b=e.target.closest("button[data-cat]");if(!b)return;category=b.dataset.cat;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
document.getElementById("search").addEventListener("input",renderProducts);
document.getElementById("cartOpen").onclick=openCart;document.getElementById("cartClose").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("menuBtn").onclick=()=>document.querySelector("nav").classList.toggle("show");
document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>document.querySelector("nav").classList.remove("show"));
document.getElementById("checkout").onclick=()=>{if(!cart.length){toast("Seu carrinho está vazio!");return}closeCart();document.getElementById("modalBackdrop").classList.add("show")};
document.getElementById("modalClose").onclick=()=>document.getElementById("modalBackdrop").classList.remove("show");
document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")e.currentTarget.classList.remove("show")});
document.getElementById("checkoutForm").addEventListener("submit",e=>{e.preventDefault();let fd=new FormData(e.target),order="PC-"+Date.now().toString().slice(-7),total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);document.getElementById("success").hidden=false;document.getElementById("success").innerHTML=`<b>Pedido de demonstração criado! 🎉</b><br>Número: ${order}<br>Cliente: ${fd.get("nome")}<br>Total: ${money(total)}<br><br>Este site é um protótipo: nenhum pagamento ou compra real foi realizado.`;cart=[];save();e.target.hidden=true});
renderProducts();renderCart();