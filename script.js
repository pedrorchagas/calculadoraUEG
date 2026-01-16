(() => {
  const tbody = document.querySelector('#subjects-table tbody');
  const addBtn = document.getElementById('add-subject');
  const totalCreditsEl = document.getElementById('total-credits');
  const crValueEl = document.getElementById('cr-value');

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function createRow(name = '', credits = '', grade = '') {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="name" placeholder="Nome da disciplina" value="${escapeHtml(name)}"></td>
      <td><input type="number" class="credits" min="1" step="1" value="${credits}"></td>
      <td><input type="number" class="grade" min="0" max="10" step="0.01" value="${grade}"></td>
      <td><button type="button" class="action-remove small">Remover</button></td>
    `;

    const creditsInput = tr.querySelector('.credits');
    const gradeInput = tr.querySelector('.grade');
    const nameInput = tr.querySelector('.name');

    [creditsInput, gradeInput, nameInput].forEach(inp => {
      inp.addEventListener('input', () => {
        validateRow(tr);
        calculateCR();
      });
    });

    tr.querySelector('.action-remove').addEventListener('click', () => {
      tr.remove();
      calculateCR();
    });

    return tr;
  }

  function validateRow(tr) {
    const credits = tr.querySelector('.credits');
    const grade = tr.querySelector('.grade');

    const cVal = Number(credits.value);
    const gVal = Number(grade.value);

    const creditsValid = Number.isFinite(cVal) && cVal > 0;
    const gradeValid = Number.isFinite(gVal) && gVal >= 0 && gVal <= 10;

    credits.classList.toggle('input-invalid', !creditsValid);
    grade.classList.toggle('input-invalid', !gradeValid);

    return creditsValid && gradeValid;
  }

  function calculateCR() {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    let totalCredits = 0;
    let weightedSum = 0;

    rows.forEach(tr => {
      if (!validateRow(tr)) return;
      const credits = Number(tr.querySelector('.credits').value);
      const grade = Number(tr.querySelector('.grade').value);
      if (!Number.isFinite(credits) || !Number.isFinite(grade)) return;
      totalCredits += credits;
      weightedSum += grade * credits;
    });

    totalCreditsEl.textContent = totalCredits;
    const cr = totalCredits === 0 ? 0 : weightedSum / totalCredits;
    crValueEl.textContent = cr.toFixed(2);
  }

  addBtn.addEventListener('click', () => {
    tbody.appendChild(createRow('', '', ''));
    calculateCR();
    const lastName = tbody.querySelector('tr:last-child .name');
    if (lastName) lastName.focus();
  });

  document.addEventListener('DOMContentLoaded', () => {
    // garantir ao menos uma linha inicial
    tbody.appendChild(createRow('', '', ''));
    calculateCR();
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const botao = document.querySelector('.seubutao');
  if (!botao) return;

  botao.addEventListener('click', function() {
    const inputNota = document.getElementById('n1');
    const campoResposta = document.getElementById('resposta');
    const nota1 = parseFloat((inputNota.value || '').toString().replace(',', '.'));

    if (isNaN(nota1) || nota1 < 0 || nota1 > 10) {
      campoResposta.innerHTML = '❌ Digite uma nota entre 0 e 10!';
      campoResposta.style.color = 'red';
      return;
    }

    const notaNecessaria = (30 - (nota1 * 2)) / 3;
    const n2Formatada = notaNecessaria.toFixed(2);

    if (notaNecessaria > 10) {
      campoResposta.innerHTML = `Sua resposta: 💀 Desespero! Você precisaria de ${n2Formatada}.`;
      campoResposta.style.color = 'orange';
    } else {
      campoResposta.innerHTML = `Sua resposta: ✅ Você precisa tirar <b>${n2Formatada}</b> no 2º Bimestre.`;
      campoResposta.style.color = 'black';
    }
  });
});
