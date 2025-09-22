import "./main.css"
import interact from 'interactjs'; 
import './dom-to-image.js'; 

app = document.querySelector('#app')
createButton = document.querySelector('#createButton')
fileLoader = document.querySelector('#fileLoader')
const mainPhotoDisplay = document.querySelector('#mainPhotoDisplay');
const darkOverlay = document.querySelector('#darkOverlay');

let currentUploadedImageUrl = ''; 

function updateModuleBackgroundPosition(moduleElement, moduleRelativeX, moduleRelativeY) {
    if (!currentUploadedImageUrl) {
        moduleElement.style.background = 'grey'; 
        return;
    }

    const mainDisplayRect = mainPhotoDisplay.getBoundingClientRect();
    const tempImg = new Image();
    tempImg.src = currentUploadedImageUrl.slice(4, -1).replace(/"/g, ""); 

    tempImg.onload = () => {
        const imgRatio = tempImg.width / tempImg.height;
        const containerRatio = mainDisplayRect.width / mainDisplayRect.height;

        let bgImageWidth, bgImageHeight;
        let bgImageOffsetX, bgImageOffsetY;

        if (containerRatio > imgRatio) {
            bgImageHeight = mainDisplayRect.height;
            bgImageWidth = mainDisplayRect.height * imgRatio;
        } else {
            bgImageWidth = mainDisplayRect.width;
            bgImageHeight = mainDisplayRect.width / imgRatio;
        }

        bgImageOffsetX = (mainDisplayRect.width - bgImageWidth) / 2;
        bgImageOffsetY = (mainDisplayRect.height - bgImageHeight) / 2;

        moduleElement.style.backgroundImage = currentUploadedImageUrl;
        moduleElement.style.backgroundColor = 'transparent'; 
        
        const finalBgPosX = -moduleRelativeX + bgImageOffsetX;
        const finalBgPosY = -moduleRelativeY + bgImageOffsetY;

        moduleElement.style.backgroundSize = `${bgImageWidth}px ${bgImageHeight}px`;
        moduleElement.style.backgroundPosition = `${finalBgPosX}px ${finalBgPosY}px`;
    };
    tempImg.onerror = () => {
        console.error('Не удалось загрузить изображение для расчета фона модуля.');
        moduleElement.style.backgroundImage = 'none';
        moduleElement.style.backgroundColor = 'grey';
    };
}


getOnclick = (image) => {
    return (event) => {
        event.stopPropagation();

        document.querySelectorAll('.image').forEach(img => img.classList.remove('active'));
        image.classList.add('active');

        const currentZIndex = parseInt(image.style.zIndex || 0, 10);
        const maxZIndex = Array.from(document.querySelectorAll('.image'))
            .reduce((max, el) => Math.max(max, parseInt(el.style.zIndex || 0, 10)), 0);
        if (currentZIndex <= maxZIndex) {
            image.style.zIndex = maxZIndex + 1;
        }
    }
}

createImage = () => {
    return () => {
        const image = document.createElement('div');
        image.classList.add('image');

        image.style.zIndex = Array.from(document.querySelectorAll('.image'))
                                .reduce((max, el) => Math.max(max, parseInt(el.style.zIndex || 0, 10)), 0) + 1;

        const position = { x: 0, y: 0 };
        image.dataset.x = 0;
        image.dataset.y = 0;
        image.style.transform = `translate(${position.x}px, ${position.y}px)`; 

        updateModuleBackgroundPosition(image, position.x, position.y);
        
        mainPhotoDisplay.appendChild(image); 

        interact(image).draggable({
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: mainPhotoDisplay, 
                    endOnly: false
                })
            ],
            listeners: {
                move (event) {
                    position.x += event.dx;
                    position.y += event.dy;
                    
                    event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
                    updateModuleBackgroundPosition(event.target, position.x, position.y);
                },
                end (event) {
                    event.target.dataset.x = position.x;
                    event.target.dataset.y = position.y;
                }
            }
        }).resizable({
            edges: { top: true, left: true, bottom: true, right: true },
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: mainPhotoDisplay, 
                    endOnly: false
                })
            ],
            listeners: {
                move: function (event) {
                    let { x, y } = event.target.dataset;

                    x = (parseFloat(x) || 0) + event.deltaRect.left;
                    y = (parseFloat(y) || 0) + event.deltaRect.top;

                    Object.assign(event.target.style, {
                        width: `${event.rect.width}px`,
                        height: `${event.rect.height}px`,
                        transform: `translate(${x}px, ${y}px)`
                    });

                    updateModuleBackgroundPosition(event.target, x, y);

                    Object.assign(event.target.dataset, { x, y });
                    position.x = parseFloat(x);
                    position.y = parseFloat(y);
                }
            }
        });

        image.onclick = getOnclick(image);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            image.remove();
        };
        image.appendChild(deleteBtn);
        
        getOnclick(image)(); 
    }
}

createButton.onclick = createImage();

fileLoader.onchange = () => {
    const file = fileLoader.files[0];
    if (!file) {
        currentUploadedImageUrl = '';
        mainPhotoDisplay.style.backgroundImage = 'none';
        mainPhotoDisplay.style.backgroundColor = '#555'; 
        darkOverlay.style.display = 'none';
        document.querySelectorAll('.image').forEach(image => {
            image.style.backgroundImage = 'none';
            image.style.backgroundColor = 'grey'; 
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const imageUrl = `url(${event.target.result})`;
        currentUploadedImageUrl = imageUrl; 
        
        mainPhotoDisplay.style.backgroundImage = imageUrl;
        mainPhotoDisplay.style.backgroundSize = 'contain';
        mainPhotoDisplay.style.backgroundPosition = 'center';
        mainPhotoDisplay.style.backgroundRepeat = 'no-repeat';
        
        darkOverlay.style.display = 'block';

        document.querySelectorAll('.image').forEach(image => {
            const x = parseFloat(image.dataset.x) || 0;
            const y = parseFloat(image.dataset.y) || 0;
            updateModuleBackgroundPosition(image, x, y);
        });
    };
    reader.readAsDataURL(file);
}

document.addEventListener('click', (event) => {
    if (!event.target.closest('.image') && !event.target.closest('#createButton') && !event.target.closest('#fileLoader')) {
        document.querySelectorAll('.image').forEach(img => img.classList.remove('active'));
    }
});

