/* ============ 国际化 ============ */
const i18n = {
  zh: {
    'nav.home': '首页', 'nav.project': '项目', 'nav.publications': '发表', 'nav.experience': '经历',
    'home.tag': '上海交通大学 · 外国语学院',
    'home.sub': '林欣瑞的个人主页',
    'home.about': '关于我',
    'home.aboutText': '（待填写自我介绍）',
    'home.edu': '教育经历',
    'home.edu1': '上海交通大学 外国语学院',
    'home.edu1sub': '（待填写）',
    'project.title': '项目经历', 'project.empty': '（待填写项目经历）',
    'pub.title': '发表情况', 'pub.empty': '（待填写发表情况）',
    'exp.title': '工作经历',
    'exp.fulltime': '全职 Full-time', 'exp.intern': '实习 Internship', 'exp.volunteer': '志愿 Volunteer',
    'exp.empty': '（待填写）'
  },
  en: {
    'nav.home': 'Home', 'nav.project': 'Projects', 'nav.publications': 'Publications', 'nav.experience': 'Experience',
    'home.tag': 'School of Foreign Languages · SJTU',
    'home.sub': 'Personal homepage of Xinrui Lin',
    'home.about': 'About Me',
    'home.aboutText': '(To be filled in)',
    'home.edu': 'Education',
    'home.edu1': 'School of Foreign Languages, Shanghai Jiao Tong University',
    'home.edu1sub': '(To be filled in)',
    'project.title': 'Projects', 'project.empty': '(Projects to be filled in)',
    'pub.title': 'Publications', 'pub.empty': '(Publications to be filled in)',
    'exp.title': 'Experience',
    'exp.fulltime': 'Full-time', 'exp.intern': 'Internship', 'exp.volunteer': 'Volunteer',
    'exp.empty': '(To be filled in)'
  }
};

let currentLang = localStorage.getItem('xl-lang') || 'zh';
const langBtn = document.getElementById('lang-toggle');

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('xl-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  langBtn.textContent = lang === 'zh' ? 'EN' : '中文';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  // 双语内容块切换
  document.querySelectorAll('.lang-zh').forEach(el => el.style.display = lang === 'zh' ? '' : 'none');
  document.querySelectorAll('.lang-en').forEach(el => el.style.display = lang === 'en' ? '' : 'none');
}
langBtn.addEventListener('click', () => applyLang(currentLang === 'zh' ? 'en' : 'zh'));
applyLang(currentLang);

/* ============ 单页导航 ============ */
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link, .nav-logo');
const bg3d = document.getElementById('bg3d');

function showPage(name) {
  pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
  document.querySelectorAll('.nav-link').forEach(l =>
    l.classList.toggle('active', l.dataset.page === name));
  // 3D 背景仅在 home 显示
  bg3d.classList.toggle('visible', name === 'home');
  if (location.hash !== '#' + name) history.pushState(null, '', '#' + name);
}

navLinks.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  showPage(a.dataset.page);
}));
window.addEventListener('popstate', () => {
  const name = location.hash.replace('#', '') || 'home';
  showPage(name);
});
showPage(location.hash.replace('#', '') || 'home');

/* ============ 滚动时隐藏 logo 与语言按钮 ============ */
const navbar = document.getElementById('navbar');
addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 60);
}, { passive: true });

/* ============ 花瓣：仅在页面加载（刷新）时飘落 3 秒 ============ */
(function dropPetals() {
  const layer = document.getElementById('petal-layer');
  const count = 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 10 + Math.random() * 16;
    p.style.width = size + 'px';
    p.style.height = size * 0.8 + 'px';
    p.style.left = Math.random() * 100 + 'vw';
    const fall = 1.8 + Math.random() * 0.9;      // 下落时长（保证 3 秒内落完）
    const delay = Math.random() * 0.9;           // 错峰出现
    p.style.animationDuration = fall + 's';
    p.style.animationDelay = delay + 's';
    // 单片花瓣动画结束后自然移除，不再整体清空
    p.addEventListener('animationend', () => p.remove());
    layer.appendChild(p);
  }
})();

/* ============ Three.js 3D 背景（landonorris.com 风格：抽象金色 3D 几何 + 鼠标视差） ============ */
(function init3D() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('bg3d');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 8;

  const rose = 0xb76e79, deep = 0x8a5560;

  // 主体：大型抽象晶体几何体（低多边形切面 + 顶点扰动）
  const heart = new THREE.Group();
  const heartMat = new THREE.MeshStandardMaterial({
    color: rose, metalness: 0.9, roughness: 0.25,
    emissive: 0x2a1216, emissiveIntensity: 0.35,
    flatShading: true
  });

  // 二十面体 + 确定性顶点扰动 → 有机晶体感
  const gGeo = new THREE.IcosahedronGeometry(2.2, 2);
  const gp = gGeo.attributes.position;
  for (let i = 0; i < gp.count; i++) {
    const x = gp.getX(i), y = gp.getY(i), z = gp.getZ(i);
    const n = Math.sin(x * 2.1) * Math.cos(y * 1.7) * Math.sin(z * 2.3);
    const d = 1 + n * 0.22;
    gp.setXYZ(i, x * d, y * d * 1.15, z * d); // 纵向略拉长
  }
  gGeo.computeVertexNormals();
  heart.add(new THREE.Mesh(gGeo, heartMat));

  // 内嵌发光核心（小一圈、反向旋转）
  const coreMesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(1.1, 0),
    new THREE.MeshStandardMaterial({
      color: 0xe8a0aa, metalness: 0.6, roughness: 0.15,
      emissive: 0xd97b8a, emissiveIntensity: 0.8, flatShading: true
    })
  );
  heart.add(coreMesh);

  // 外环绕轨道环
  const ringGeo = new THREE.TorusGeometry(3.1, 0.03, 12, 128);
  const ringMat = new THREE.MeshBasicMaterial({ color: deep, transparent: true, opacity: 0.5 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 2.4;
  const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
  ring2.rotation.x = -Math.PI / 2.8;
  ring2.rotation.y = Math.PI / 3;
  heart.add(ring1, ring2);

  scene.add(heart);

  // 环绕线框球
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(4.8, 1),
    new THREE.MeshBasicMaterial({ color: deep, wireframe: true, transparent: true, opacity: 0.18 })
  );
  scene.add(wire);

  // 玫瑰金粒子
  const pGeo = new THREE.BufferGeometry();
  const N = 600, pos = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 24;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: rose, size: 0.05, transparent: true, opacity: 0.7
  }));
  scene.add(particles);

  scene.add(new THREE.AmbientLight(0xffe4e0, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new THREE.PointLight(0xe8a0aa, 1.2, 30);
  rim.position.set(-6, -3, 4);
  scene.add(rim);

  // 鼠标视差
  let mx = 0, my = 0;
  addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  });

  function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    heart.rotation.y = t * 0.25;                    // 缓慢旋转
    heart.rotation.x = Math.sin(t * 0.4) * 0.12;    // 轻微俯仰
    coreMesh.rotation.y = -t * 0.6;                 // 内核反向旋转
    coreMesh.rotation.z = t * 0.3;
    // 呼吸式脉动（柔和）
    const beat = Math.sin(t * 1.6) * 0.5 + 0.5;
    heart.scale.setScalar(1 + beat * 0.05);
    heart.position.y = Math.sin(t * 0.8) * 0.15;    // 轻微悬浮
    wire.rotation.y = -t * 0.08;
    wire.rotation.x = t * 0.05;
    particles.rotation.y = t * 0.02;
    camera.position.x += (mx * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-my * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
})();
