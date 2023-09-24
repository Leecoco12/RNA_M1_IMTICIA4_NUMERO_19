class MethodeDeJacobi {
  calculateEigenValuesAndEigenVectors = async(matrix, maxIterations, tolerance) => {
    const n = matrix.length;
    let eigenvalues = Array(n).fill(0);
    let eigenvectors = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      eigenvectors[i][i] = 1;
    }

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let maxOffDiagonal = 0;
      let p = 0;
      let q = 0;

      // Find the largest off-diagonal element
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const absValue = Math.abs(matrix[i][j]);
          if (absValue > maxOffDiagonal) {
            maxOffDiagonal = absValue;
            p = i;
            q = j;
          }
        }
      }

      if (maxOffDiagonal < tolerance) {
        break;
      }

      const theta =
        0.5 * Math.atan2(2 * matrix[p][q], matrix[p][p] - matrix[q][q]);
      const cosinus = Math.cos(theta);
      const sinus = Math.sin(theta);

      // Update matrix and eigenvectors
      const newMatrix = [...matrix];
      for (let i = 0; i < n; i++) {
        newMatrix[i] = [...matrix[i]];
      }
      for (let i = 0; i < n; i++) {
        newMatrix[i][p] = cosinus * matrix[i][p] + sinus * matrix[i][q];
        newMatrix[i][q] = -sinus * matrix[i][p] + cosinus * matrix[i][q];
      }
      for (let i = 0; i < n; i++) {
        matrix[i] = [...newMatrix[i]];
      }

      for (let i = 0; i < n; i++) {
        const temp = cosinus * eigenvectors[i][p] + sinus * eigenvectors[i][q];
        eigenvectors[i][q] = -sinus * eigenvectors[i][p] + cosinus * eigenvectors[i][q];
        eigenvectors[i][p] = temp;
      }
    }

    for (let i = 0; i < n; i++) {
      eigenvalues[i] = matrix[i][i];
    }

    return { eigenvalues, eigenvectors };
  };
}
