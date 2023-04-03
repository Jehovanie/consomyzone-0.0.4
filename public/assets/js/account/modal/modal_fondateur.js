

const modal = document.querySelector('.modal-tommyJS');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal-fondateur');

const openModal = function () {
    modal.classList.remove('cache');
    overlay.classList.remove('cache');
}

const closeModal = () => {
    modal.classList.add('cache');
    overlay.classList.add('cache');
}

for (let i = 0; i < btnsOpenModal.length; i++) {
    btnsOpenModal[i].addEventListener('click', openModal);
}

btnCloseModal.addEventListener('click',closeModal);
overlay.addEventListener('click',closeModal);

document.addEventListener('keydown', function(evt) {
    console.log(evt.key);

    if (evt.key === 'Escape' && !modal.classList.contains('cache')) {
            closeModal();
        }
});
