import './sass/main.scss';
import galleryItems from './js/app.js';

const refs = {
    closeModalBtn: document.querySelector('[data-action="close-lightbox"]'),
    overlay: document.querySelector('.lightbox__overlay'),
    galleryContainer: document.querySelector('.js-gallery'),
  lightboxImage: document.querySelector('.lightbox__image'),
    lightbox: document.querySelector('.js-lightbox'),
}

const galleryMarkup = createGalleryMarkup(galleryItems);
refs.galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);

function createGalleryMarkup(galleryItems) {
  return galleryItems.map(({ preview, original, description }, index) => {
    return `
  <li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      loading="lazy"
      class="gallery__image lazyload"
      data-src="${preview}"
      data-source="${original}"
      alt="${description}"
      data-index = ${index}
      width="392"
      height="240"
    />
  </a>
</li>
`;
  }).join('');
}

refs.galleryContainer.addEventListener('click', onGalleryItemClick);
 
function onGalleryItemClick(evt) {
    refs.overlay.addEventListener('click', onOverlayClick);
    refs.closeModalBtn.addEventListener('click', onCloseModal);
    window.addEventListener('keydown', onKeyPress);
  evt.preventDefault();
  if (evt.target.nodeName !== 'IMG') {
    return
  }
  
    refs.lightbox.classList.toggle('is-open');
    refs.lightboxImage.src = evt.target.dataset.source;
  refs.lightboxImage.alt = evt.target.alt;
  refs.lightboxImage.setAttribute('data-index', evt.target.dataset.index)
}

function onOverlayClick(evt) {
  if (evt.currentTarget === evt.target) {
    
    onCloseModal();
  }
}

function onCloseModal() {
    window.removeEventListener('keydown', onKeyPress);
    refs.overlay.removeEventListener('click', onOverlayClick);
    refs.closeModalBtn.removeEventListener('click', onCloseModal);
    refs.lightbox.classList.toggle('is-open');
    refs.lightboxImage.src = '';
  refs.lightboxImage.alt = '';
  refs.lightboxImage.removeAttribute('data-index');
}

function onKeyPress(evt) {
  const ESC_KEY_CODE = 'Escape';
  const isEscKey = evt.code === ESC_KEY_CODE;

  if (isEscKey) {
    onCloseModal();
  }

  const arrowRight = evt.code === 'ArrowRight';
  const arrowLeft = evt.code === 'ArrowLeft';

   if (arrowRight || arrowLeft) {
    showSlides(arrowRight);
  }
}

function showSlides(arrowR) {
  let slideIndex;

  if (arrowR) { slideIndex = Number(refs.lightboxImage.dataset.index) + 1; }
  else { slideIndex = Number(refs.lightboxImage.dataset.index) - 1; }



  if (slideIndex < 0) {
    slideIndex = galleryItems.length + slideIndex;
  }

  if (slideIndex === galleryItems.length) {
    slideIndex = 0;
  }

  refs.lightboxImage.src = galleryItems[slideIndex].original;
  refs.lightboxImage.dataset.index = slideIndex;
}


if ('loading' in HTMLImageElement.prototype) {
  console.log('Браузер поддерживает lazyload');
  addSrcAttrToLazyImages();
} else {
  console.log('Браузер НЕ поддерживает lazyload');
  addLazySizesScript();
}

function addLazySizesScript() {
  const script = document.createElement('script');
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js';
  script.integrity =
    'sha512-TmDwFLhg3UA4ZG0Eb4MIyT1O1Mb+Oww5kFG0uHqXsdbyZz9DcvYQhKpGgNkamAI6h2lGGZq2X8ftOJvF/XjTUg==';
  script.crossOrigin = 'anonymous';

  document.body.appendChild(script);
}

function addSrcAttrToLazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  lazyImages.forEach(img => {
    img.src = img.dataset.src;
  });
}
