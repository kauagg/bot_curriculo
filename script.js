document.getElementById('analisarBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('pdfUpload');
  const file = fileInput.files[0];
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');

  if (!file) {
    alert("Por favor, selecione um arquivo PDF.");
    return;
  }

  if (file.type !== "application/pdf") {
    alert("Formato inválido. Envie um arquivo PDF.");
    return;
  }

  spinner.style.display = 'inline-block';
  btnText.textContent = 'Analisando...';

  const fileReader = new FileReader();
  fileReader.onload = async function() {
    const typedArray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

    let textoExtraido = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      textoExtraido += strings.join(" ") + "\n";
    }

    analisarTexto(textoExtraido.toLowerCase());

    spinner.style.display = 'none';
    btnText.textContent = 'Analisar';
  };

  fileReader.readAsArrayBuffer(file);
});

function analisarTexto(texto) {
  const palavrasChave = ["javascript", "html", "css", "projetos", "experiência", "formação", "git", "react", "Gostoso", "ESCRAVO CLT"];
  const faltando = palavrasChave.filter(p => !texto.includes(p));
  let resultado = "";

  resultado += `✅ Palavras-chave encontradas: ${palavrasChave.length - faltando.length}/${palavrasChave.length}\n`;

  if (faltando.length > 0) {
    resultado += "⚠️ Sugestão: adicione essas palavras ao currículo:\n- " + faltando.join("\n- ") + "\n";
  } else {
    resultado += "🎉 Seu currículo contém todas as palavras-chave importantes!\n";
  }

  if (texto.length < 500) {
    resultado += "⚠️ Seu currículo está muito curto. Tente detalhar mais suas experiências.\n";
  }

  document.getElementById("resultado").innerText = resultado;
}
