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
async function initSenses() {
    const name = document.getElementById('user-name').value.trim();
    if (!name) return alert("IDENTIFÍQUESE, SEÑOR");

    // Limpiamos cualquier error previo visualmente
    document.getElementById('mic-status').innerText = "ESTABLECIENDO PROTOCOLO DE MANO...";

    try {
        // Solicitud con restricciones mínimas para facilitar el acceso
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true
            } 
        });
        
        // Inicialización forzada del contexto
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        analyser = audioContext.createAnalyser();
        micSource = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        micSource.connect(analyser);

        // TRANSICIÓN DE INTERFAZ
        document.getElementById('btn-start').style.display = 'none';
        document.getElementById('user-name').style.display = 'none';
        document.getElementById('clap-area').classList.remove('hidden');
        
        isWaitingClap = true;
        detectSound();

    } catch (err) {
        console.error("DEBUG STARK:", err);
        // Si el error persiste, daremos una instrucción clara según el tipo de error
        let msg = "ERROR CRÍTICO DE HARDWARE";
        if (err.name === 'NotAllowedError') msg = "EL SISTEMA OPERATIVO O EL NAVEGADOR ESTÁN BLOQUEANDO EL MICRO. Revise Ajustes de Mac > Privacidad > Micrófono.";
        if (err.name === 'NotFoundError') msg = "NO SE DETECTÓ NINGÚN MICRÓFONO CONECTADO.";
        
        alert(msg);
    }
}
