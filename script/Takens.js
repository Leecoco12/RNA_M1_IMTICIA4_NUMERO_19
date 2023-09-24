class Takens {
  matrixMultiplication1D = async(m1, m2) => {
    const result = [];
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m2.length; j++) {
        if (!result[i]) result[i] = [m2[i] * m1[j]];
        else result[i].push(m2[i] * m1[j]);
      }
    }
    return result;
  };

  calculateErreurApprox = (eigenvalues) => {
    const erreurs = [];
    for (let i = 0; i < eigenvalues.length; i++) {
      erreurs.push(Math.sqrt(eigenvalues[i] + 1));
    }
    return erreurs;
  };

  findPlateau = (erreurApprox) => {
    let unitCount = 0;
    let value1 = erreurApprox[0];
    let value2 = erreurApprox[1];
    let errors;

    for (let i = 2; i < erreurApprox.length; i++) {
      errors = Math.abs(value1 - value2);
      if (errors <= 0.1 && errors > 0.00001) {
        unitCount = i;
        break;
      } else {
        value1 = value2;
        value1 = erreurApprox[i];
      }
    }
    return unitCount;
  };
}
