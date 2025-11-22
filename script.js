const formAgendamento = document.getElementById('form-agendamento');
const listaAgendamentos = document.getElementById('lista-agendamentos');
const btnWhatsapp = document.getElementById('btn-whatsapp');

let ultimoAgendamento = null;

// Evento de envio do formulário
formAgendamento.addEventListener('submit', function (event) {
  event.preventDefault();

  const nome = document.getElementById('ag-nome').value;
  const servico = document.getElementById('ag-servico').value;
  const dataHoraInput = document.getElementById('ag-data').value;
  const dataHora = new Date(dataHoraInput);

  if (!validarHorario(dataHora)) {
    alert("Horário inválido. Funcionamos de segunda a sexta das 9h às 19h e sábado até 14h.");
    return;
  }

  if (isHorarioOcupado(dataHoraInput)) {
    alert("Este horário já foi agendado. Por favor, escolha outro.");
    return;
  }

  if (nome && servico && dataHoraInput) {
    const agendamento = { nome, servico, dataHora: dataHoraInput };

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
    agendamentos.push(agendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    renderAgendamentos();
    ultimoAgendamento = agendamento;
    btnWhatsapp.style.display = 'inline-block';
    formAgendamento.reset();
  }
});

// Renderiza a lista ao carregar a página
window.addEventListener('load', renderAgendamentos);

// Função para exibir os agendamentos
function renderAgendamentos() {
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  listaAgendamentos.innerHTML = '';

  agendamentos.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} - ${item.servico} em ${new Date(item.dataHora).toLocaleString()}`;
    listaAgendamentos.appendChild(li);
  });
}

// Valida se o horário está dentro do expediente
function validarHorario(dataHora) {
  const dia = dataHora.getDay(); // 0 = domingo, 6 = sábado
  const hora = dataHora.getHours();

  if (dia === 0) return false; // domingo

  if (dia === 6) {
    return hora >= 9 && hora < 14; // sábado até 14h
  }

  return hora >= 9 && hora < 19; // segunda a sexta

}

// Verifica se o horário já foi ocupado
function isHorarioOcupado(dataHoraStr) {
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  return agendamentos.some(ag => ag.dataHora === dataHoraStr);
}

// Envio para WhatsApp
btnWhatsapp.addEventListener('click', () => {
  if (ultimoAgendamento) {
    const { nome, servico, dataHora } = ultimoAgendamento;
    const mensagem = `Olá, meu nome é ${nome}. Gostaria de agendar um horário para ${servico} no dia ${new Date(dataHora).toLocaleString()}.`;

    const telefone = '55519980105580'; // Substitua pelo número real da barbearia
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  }
});
