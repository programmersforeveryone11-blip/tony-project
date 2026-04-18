async function initSenses() {
    const name = document.getElementById('user-name').value.trim();
    if (!name) return alert("IDENTIFÍQUESE, SEÑOR");

    try {
        // Forzamos la solicitud de nuevo
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Creamos el contexto DEPUÉS de tener el stream
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Esperamos un momento para que el hardware se inicialice
        await audioContext.resume();

        analyser = audioContext.createAnalyser();
        micSource = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        micSource.connect(analyser);

        // Si llegamos aquí, el permiso es REAL
        document.getElementById('btn-start').classList.add('hidden');
        document.getElementById('user-name').classList.add('hidden');
        document.getElementById('clap-area').classList.remove('hidden');
        
        isWaitingClap = true;
        detectSound();
        console.log("Protocolo de escucha activado.");

    } catch (err) {
        // Solo lanzamos el alert si el error no es que el usuario está pensando
        if (err.name !== 'TypeError') {
            console.error("Fallo de sensores:", err);
            alert("SISTEMA: Error de comunicación con el sensor. Por favor, refresque la página y asegúrese de elegir 'Internal Microphone'.");
        }
    }
}
