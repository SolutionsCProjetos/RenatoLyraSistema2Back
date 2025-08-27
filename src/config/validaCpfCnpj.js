exports.validarCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs com todos os números iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const calc = (x) => {
    const slice = cnpj.slice(0, x);
    let factor = x - 7;
    let sum = 0;

    for (let i = x; i >= 1; i--) {
      sum += slice[x - i] * factor--;
      if (factor < 2) factor = 9;
    }

    const result = 11 - (sum % 11);
    return result > 9 ? 0 : result;
  };

  // Valida os dois dígitos verificadores do CNPJ
  const digit1 = calc(12);
  const digit2 = calc(13);
  return digit1 === Number(cnpj[12]) && digit2 === Number(cnpj[13]);
}

 // Validação de CPF
 exports.validarCPF = (cpf) => {
      const cpfSemPonto = cpf ? cpf.replace(/[^\d]+/g, "") : null;
      if (
        !cpfSemPonto ||
        cpfSemPonto.length !== 11 ||
        /^(\d)\1+$/.test(cpfSemPonto)
      )
        return false;

      let soma = 0;
      let resto;

      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpfSemPonto.substring(i - 1, i)) * (11 - i);
      }

      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpfSemPonto.substring(9, 10))) return false;

      soma = 0;
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpfSemPonto.substring(i - 1, i)) * (12 - i);
      }

      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      return resto === parseInt(cpfSemPonto.substring(10, 11));
    };
