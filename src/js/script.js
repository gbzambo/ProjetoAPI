//DECLARAÇÕES DOS ELEMENTOS COM DOM
const videoElemento=document.getElementById("video");
const botaoScanear=document.getElementById("btn-video");
const resultado=document.getElementById("saida");
const canva=document.getElementById("canvas");

//função para habilitar a câmera

async function configurarCamera(){
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment"}, //Habilitando a câmera traseira
            audio:false //Evita capturar o áudio 
        })
        //Atribuir o fluxo da camera em midia
        videoElemento.srcObject = midia;
        //Garante que a cam vai funcionar
        videoElemento.onplay();
    }catch(erro){
            resultado.innerText="Erro ao capturar a câmera",erro
    }
}
//executa função da camera
configurarCamera();

//Função para capturar o texto

botaoScanear.onclick = async()=>{
    botaoScanear.disabled =true;// habilita o botão para pegar o texto
    resultado.innerText= "Fazendo a Leitura... Aguarde";

    //prepara o canvas pra receber a estrutura 2d
    const contexto = canvas.getContext("2d");

    //ajusta o tamanho do canvas de acordo com video
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //define a matriz de transformação do canvas (escala, inclinação)
    contexto.setTransform(1, 0, 0, 1, 0, 0);

    //aplica filtro de contrast para melhorar o OCR
    contexto.filter = 'contrast(1.2) grayscale(1)';

    contexto.drawlImage(videoElemento, 0, 0, canvas.width,canvas.height);
    
    try{
        //o tesseract retorna o objeto
        const {data: {text}}= await Tesseract.recognize(
            canvas,
            'por' // define o idioma
        );
        //remove todos os espaços em branco
        const textoFinal= text.trim();
        resultado.innerText=textoFinal.length > 0 ?textoFinal:"Não foi possível identificar o texto"
    }catch(erro){
        resultado.innerText="Erro ao processar a leitura",erro
    }finally{
        //desabilita a leitura do texto para começar novament.
        botaoScanear.disabled=false;
    }
}