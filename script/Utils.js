 class Utils {
  constructor() {}

  truncDecimal = (n) => {
    return Math.trunc(n * 100000000) / 100000000;
  };

  randomNumber = (min, max) => {
    return this.truncDecimal(Math.random() * (max - min) + min);
  };

  generateMatrix = (row, line) => {
    let A = [];
    for (var i = 0; i < row; i++) {
      A[i] = [];
      for (var j = 0; j < line; j++) {
        A[i][j] = this.randomNumber(0, 0.5);
      }
    }
    return A;
  };

  generatePrototypes = (_count, _initialIndex, _values) => {
    const prototypes = [];

    if (_initialIndex + _count >= _values.length) {
      return null;
    }
    for (let i = _initialIndex; i < _initialIndex + _count; i++) {
      prototypes.push(_values[i]);
    }
    return prototypes;
  };

  generateMultipleStepPrototypes = (_count, _initialIndex, _values,precedentPrototypes)=>{
    const prototypes = [];

    if (_initialIndex + _count >= _values.length) {
      return null;
    }
    for (let i = _initialIndex; i < _initialIndex + _count; i++) {
      prototypes.push(_values[i]);
    }
    return prototypes;
  }

  /**
   *
   * @param {Array} realValues tableau des valeurs reel de longueur n
   * @param {Array } predictedValues tableua des valeurs predites de longueur n egalement
   */
  mse = (realValues, predictedValues) => {
    const n = realValues.length;
    let mse = 0;

    for (let i = 0; i < n; i++) {
      const error = realValues[i] - predictedValues[i];
      mse += error * error;
    }

    return mse;
  };

  /**
   *
   * @param {Array} values  tableau des valeurs reel de la serie et qui
   * devrait etre la meme que celle du parametre realValues
   * dans la fonction mse
   */
  variance = (values) => {
    const n = values.length;
    const moyenne = values.reduce((sum, value) => sum + value, 0) / n;

    let variance = 0;
    for (let i = 0; i < n; i++) {
      const deviation = values[i] - moyenne;
      variance += deviation * deviation;
    }

    return variance / n;
  };

  nmse = (mse, variance) => {
    return this.truncDecimal(mse / variance);
  };
}
