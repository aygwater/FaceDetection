const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.LoadFromUri('/models'),
    faceapi.nets.faceLankmark68Net.LoadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.LoadFromUri('/models'),
    faceapi.nets.faceExpressionNet.LoadFromUri('/models') 
]).then(startVideo())

function startVideo(){
    navigator.getUserMedia({
        video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
        )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize) 

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new 
            faceapi.TinyFaceDetectorOptions()).withFaceLankmarks().withFaceExpressions()
             console.log(detections)
            const resizedDetections = faceapi.resizedResults(detections, displaySize)
             canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})