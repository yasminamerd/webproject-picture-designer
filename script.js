app = document.querySelector('#app')
createButton = document.querySelector('#createButton')
ileLoader = document.querySelector('#fileLoader')

background = ''


getOnclick = (image) => {
    return () => {
        //TODO: доделать сохранение картинок
    }
}

createImage = () => {
    return () => {
        image = document.createElement('div')
        image.style.backgroundImage = `url(${background})`
        image.classList.add('image')

        const position = {x:0, y:0}
        interact('.image').draggable({
            listeners: {
                move (event) {
                    position.x += event.dx
                    position.y += event.dy
                    event.target.style.top = `${position.y}px`
                    event.target.style.left = `${position.x}px`
                },
            }
        })
        
        interact('.image').resizable({
            edges: { top: true, left: true, bottom: true, right: true },
            listeners: {
                move: function (event) {
                    let { x, y } = event.target.dataset

                    x = (parseFloat(x) || 0) + event.deltaRect.left
                    y = (parseFloat(y) || 0) + event.deltaRect.top

                    Object.assign(event.target.style, {
                        width: `${event.rect.width}px`,
                        height: `${event.rect.height}px`
                    })

                    Object.assign(event.target.dataset, { x, y })
                }
            }
        })

        image.onclick = getOnclick(image)

        app.appendChild(image)
    }
}

createButton.onclick = createImage()

fileLoader.onchange = ()=> {
    file = fileLoader.files[0]

    reader = new FileReader();
    reader.onload = (event) => {
        background = event.target.result
        document.querySelectorAll('.image').forEach(image => image.style.backgroundImage = `url(${background})`)
    };
    reader.readAsDataURL(file);
}
