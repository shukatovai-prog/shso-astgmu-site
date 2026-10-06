(function(){
  const D=window.SITE_DATA;
  const byId=id=>document.getElementById(id);
  const prefixFor=active=>active==='team'?'../../':'./';

  window.toggleMenu=function(){
    const n=byId('navLinks');
    if(n)n.classList.toggle('open');
  };

  function nav(active){
    const p=prefixFor(active);
    return `<header class="nav">
      <div class="container nav-inner">
        <a class="brand" href="${p}index.html">
         <div class="brand-mark">
  <img src="${p}assets/images/logo.shso.png" alt="Эмблема ШСО">
</div>
          <div class="brand-copy"><b>${D.site.shortTitle}</b><span>${D.site.direction}</span></div>
        </a>
        <button class="nav-toggle" type="button" onclick="toggleMenu()">Меню</button>
        <nav id="navLinks" class="nav-links">
          <a href="${p}index.html">Главная</a>
          <a href="${p}about.html">О нас</a>
          <a href="${p}teams.html">Наши отряды</a>
          <a href="${p}contacts.html">Контакты</a>
          <a href="${p}join.html">Вступить</a>
          <a class="cabinet" href="${D.site.cabinetUrl}" target="_blank" rel="noopener">Личный кабинет</a>
        </nav>
      </div>
    </header>`;
  }

 function footer(active){
  const p = prefixFor(active);

  return `
    <footer class="site-footer">
      <div class="container footer-main">

        <div class="footer-brand">
         <div class="footer-brand-top">
  <div>
    <strong>Штаб студенческих отрядов</strong>
    <span>Астраханского ГМУ</span>
  </div>
</div>

          <p>
            Студенческие медицинские отряды — команда,
            профессиональное развитие и яркая студенческая жизнь.
          </p>
        </div>


        <div class="footer-nav">

          <div class="footer-nav-group">
            <span>Навигация</span>

            <a href="${p}about.html">
              О нас
            </a>

            <a href="${p}teams.html">
              Наши отряды
            </a>

            <a href="${p}join.html">
              Вступить в РСО
            </a>
          </div>


          <div class="footer-nav-group">
            <span>Связь</span>

            <a href="${p}contacts.html">
              Контакты
            </a>

            <a
              href="${D.site.vkUrl || '#'}"
              target="_blank"
              rel="noopener"
            >
              ВКонтакте
            </a>
          </div>


          <div class="footer-nav-group">
            <span>Сервисы</span>

            <a
              class="footer-cabinet"
              href="${D.site.cabinetUrl}"
              target="_blank"
              rel="noopener"
            >
              Личный кабинет →
            </a>
          </div>

        </div>

      </div>


      <div class="container footer-bottom">

        <span>
          © 2026 ШСО Астраханского ГМУ
        </span>

        <span>
          Российские студенческие отряды
        </span>

      </div>
    </footer>
  `;
}

  window.renderShell=function(active){
    byId('nav').innerHTML=nav(active);
    byId('footer').innerHTML=footer(active);
  };

  window.renderStats=function(target,stats){
    byId(target).innerHTML=stats.map(s=>`<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join('');
  };

window.renderTeams=function(target){
  byId(target).innerHTML=D.teams.map((t,i)=>`
    <a class="team-card team-card-photo"
       style="--accent:${t.accent}"
       href="./teams/${t.slug}/">

      <div class="team-card-image">
        <img
          src="./assets/images/teams/${t.slug}.jpg"
          alt="${t.name}"
          loading="lazy"
        >
      </div>

      <div class="team-card-content">
        <span class="num">0${i+1}</span>

        <div class="team-card-text">
          <h3>${t.name}</h3>
          <p>${t.description}</p>
        </div>

        <span class="open">Открыть отряд →</span>
      </div>

    </a>
  `).join('');
};

  window.renderStaff=function(target,staff,pathPrefix=''){
    const fallback=pathPrefix+'assets/person-placeholder.svg';
    byId(target).innerHTML=staff.map(p=>`
      <article class="person">
        <img src="${pathPrefix}${p.photo||'assets/person-placeholder.svg'}" alt="${p.name}" loading="lazy"
             onerror="this.onerror=null;this.src='${fallback}'">
        <div class="person-body">
          <strong>${p.name}</strong><span>${p.role}</span>
          ${p.vk?`<a class="person-link" href="${p.vk}" target="_blank" rel="noopener">ВКонтакте →</a>`:''}
        </div>
      </article>`).join('');
  };

  window.applyHeroImage=function(){
    const hero=document.querySelector('.hero-photo-placeholder');
    if(!hero)return;
    hero.style.backgroundImage=`linear-gradient(180deg,rgba(16,24,40,.10),rgba(16,24,40,.58)),url('${D.site.heroImage}')`;
  };

 window.submitJoin = async function(e){
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const note = form.querySelector('.form-status');

  const data = Object.fromEntries(new FormData(form).entries());

  // Источник заявки
  data.source = 'public-site';
  data.createdAt = new Date().toISOString();

  btn.disabled = true;
  btn.textContent = 'Отправляем…';

  if(note){
    note.className = 'form-status';
    note.textContent = '';
  }

  try {

    const response = await fetch(
      'https://lk.shso-astgmu.ru/api/join-application',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );

    let result = {};

    try {
      result = await response.json();
    } catch (_) {
      throw new Error('Сервер вернул некорректный ответ.');
    }

    if(!response.ok || result.ok !== true){
      throw new Error(
        result.error ||
        result.message ||
        'Не удалось отправить анкету.'
      );
    }

    if(note){
      note.className = 'form-status success';
      note.textContent =
        'Анкета отправлена! Комсостав свяжется с тобой.';
    }

    form.reset();

    // Скрываем специальность ординатуры после очистки формы
    const residencyField =
      document.getElementById('residencySpecialtyField');

    if(residencyField){
      residencyField.style.display = 'none';
    }

  } catch(err) {

    console.error('JOIN APPLICATION ERROR:', err);

    if(note){
      note.className = 'form-status error';
      note.textContent =
        err.message ||
        'Не удалось отправить анкету. Попробуй ещё раз.';
    }

  } finally {

    btn.disabled = false;
    btn.textContent = 'Отправить анкету';

  }
};

  window.renderVideo=function(){
    const box=byId('videoArea');
    if(!box)return;
    if(D.site.videoUrl){
      box.innerHTML=`<div class="video-embed"><iframe src="${D.site.videoUrl}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen title="Видео о штабе"></iframe></div>`;
    }
  };

  window.renderTeamPage=function(slug){
  const t=D.teams.find(x=>x.slug===slug);
  if(!t)return;

  document.documentElement.style.setProperty('--team-accent',t.accent);

  const hero=byId('teamHero');

  hero.style.backgroundImage=
    `linear-gradient(90deg,rgba(16,24,40,.94),rgba(16,24,40,.66)),url('../../${t.heroImage}')`;

  hero.innerHTML=`
    <div class="container">
      <div class="team-kicker" style="color:${t.accent}">
        ${t.tagline}
      </div>

      <h1>${t.name}</h1>

      <p>${t.description}</p>

      <div class="actions">
        <a class="btn btn-primary"
           href="../../join.html?team=${encodeURIComponent(t.name)}">
          Хочу вступить
        </a>

        <a class="btn btn-secondary"
           href="../../teams.html">
          Все отряды
        </a>
      </div>
    </div>
  `;

  renderStats('teamStats',t.stats);


  /* ===== ВИДЕО ОТРЯДА ===== */

  const videoBox=byId('teamVideo');

  if(videoBox){

    if(t.videoUrl){

      videoBox.innerHTML=`
        <div class="team-video-player">
          <video
            controls
            playsinline
            preload="metadata"
          >
            <source
              src="${t.videoUrl}"
              type="video/mp4"
            >
            Ваш браузер не поддерживает видео.
          </video>
        </div>
      `;

    }else{

      const videoSection=
        videoBox.closest('.team-video-section');

      if(videoSection){
        videoSection.style.display='none';
      }

    }
  }


  /* ===== ДОСТИЖЕНИЯ ===== */

  byId('achievements').innerHTML=t.achievements.length
    ? t.achievements
        .map(a=>`<div class="achievement">${a}</div>`)
        .join('')
    : `<div class="empty-note">
         Раздел достижений будет дополняться.
       </div>`;


  /* ===== КОМСОСТАВ ===== */

  renderStaff('command',t.command,'../../');


  /* ===== СОЦИАЛЬНЫЕ СЕТИ ===== */

  const social=byId('teamSocial');

  if(social){

    social.innerHTML=t.social&&t.social.length
      ? t.social
          .map(s=>`
            <a
              class="btn btn-secondary"
              href="${s.url}"
              target="_blank"
              rel="noopener"
            >
              ${s.label}
            </a>
          `)
          .join('')
      : `<span class="muted">
           Ссылки на социальные сети добавим позже.
         </span>`;
  }
};

  window.prefillJoinTeam=function(){
  const q=new URLSearchParams(location.search).get('team');
  if(!q)return;

  const sel=document.querySelector('select[name=team]');

  if(sel){
    sel.value=q;
  }
};


/* ==================================================
   ГАЛЕРЕЯ — FULLSCREEN LIGHTBOX
================================================== */

window.initGalleryLightbox=function(){

  const photos=
    Array.from(document.querySelectorAll('.gallery-photo img'));

  const lightbox=
    document.getElementById('galleryLightbox');

  const lightboxImage=
    document.getElementById('lightboxImage');

  const counter=
    document.getElementById('lightboxCounter');

  if(!photos.length || !lightbox || !lightboxImage){
    return;
  }

  const closeBtn=
    lightbox.querySelector('.lightbox-close');

  const prevBtn=
    lightbox.querySelector('.lightbox-prev');

  const nextBtn=
    lightbox.querySelector('.lightbox-next');

  let currentIndex=0;


  function showPhoto(index){

    if(index < 0){
      index=photos.length-1;
    }

    if(index >= photos.length){
      index=0;
    }

    currentIndex=index;

    lightboxImage.src=
      photos[currentIndex].getAttribute('src');

    lightboxImage.alt=
      photos[currentIndex].alt || 'Фотография отряда';

    if(counter){
      counter.textContent=
        `${currentIndex+1} / ${photos.length}`;
    }
  }


  function openLightbox(index){

    showPhoto(index);

    lightbox.classList.add('open');

    document.body.classList.add('lightbox-open');
  }


  function closeLightbox(){

    lightbox.classList.remove('open');

    document.body.classList.remove('lightbox-open');
  }


  photos.forEach((photo,index)=>{

    photo.addEventListener('click',function(e){

      e.preventDefault();

      e.stopPropagation();

      openLightbox(index);

    });

  });


  if(closeBtn){

    closeBtn.addEventListener('click',function(e){

      e.stopPropagation();

      closeLightbox();

    });

  }


  if(prevBtn){

    prevBtn.addEventListener('click',function(e){

      e.stopPropagation();

      showPhoto(currentIndex-1);

    });

  }


  if(nextBtn){

    nextBtn.addEventListener('click',function(e){

      e.stopPropagation();

      showPhoto(currentIndex+1);

    });

  }


  lightbox.addEventListener('click',function(e){

    if(e.target===lightbox){
      closeLightbox();
    }

  });


  document.addEventListener('keydown',function(e){

    if(!lightbox.classList.contains('open')){
      return;
    }

    if(e.key==='Escape'){
      closeLightbox();
    }

    if(e.key==='ArrowLeft'){
      showPhoto(currentIndex-1);
    }

    if(e.key==='ArrowRight'){
      showPhoto(currentIndex+1);
    }

  });

};

})();
