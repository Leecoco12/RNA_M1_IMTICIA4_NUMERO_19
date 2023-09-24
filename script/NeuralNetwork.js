class NeuralNetwork {
  layers;
  weights;

  constructor(_inputUnit, _hiddenUnitNumber, _outputUnitNumber) {
    let hiddenUnit = new Array(_hiddenUnitNumber);
    let outputUnit = new Array(_outputUnitNumber);
    this.layers = [
      [..._inputUnit], // indexed by i
      [...hiddenUnit], // indexed by j
      [...outputUnit], // indexed by k
    ];

    const utils = new Utils();

    // STEP1 => INITIALIZE WEIGHTS
    let firstWeights = utils.generateMatrix(
      _inputUnit.length,
      _hiddenUnitNumber
    ); // Weights betwen input and hidden
    let secondWeights = utils.generateMatrix(
      _hiddenUnitNumber,
      _outputUnitNumber
    ); // Weights betwen hidden and output
    this.weights = {
      firstWeights,
      secondWeights,
    };
  }

  getNeuralNetwork() {
    return { layers: this.layers, weights: this.weights };
  }

  setInputValue(_values) {
    this.layers[0] = _values;
  }

  setWeights(_firstWeights, _secondWeights) {
    this.weights = {
      firstWeights: _firstWeights,
      secondWeights: _secondWeights,
    };
  }
  randomNumber = (min, max) => {
    return this.truncDecimal(Math.random() * (max - min) + min);
  };

  truncDecimal = (n) => {
    return Math.trunc(n * 100000000) / 100000000;
  };

  predict = async (startIndex, step, values, count) => {
    if (step === 1) {
      return await this.oneStepPrediction(startIndex, values, count);
    } else {
      return await this.multipleStepPrediction(startIndex, values, step);
    }
  };

  oneStepPrediction = async (startIndex, values, count) => {
    const realValues = [];
    const predictedValues = [];
    const descente = new DescenteDeGradient();
    const utils = new Utils();
    const prototypeCount = this.layers[0].length;

    const h = JSON.parse(JSON.stringify(this.layers));

    for (let i = startIndex; i < count + startIndex; i++) {
      const prototypes = utils.generatePrototypes(prototypeCount, i, values);

      if (prototypes) {
        realValues.push(values[i + prototypeCount]);
        this.setInputValue(prototypes);
        const propagationResult = await descente.propagation(
          this.layers,
          h,
          this.weights
        );
        const { layers } = propagationResult;

        predictedValues.push(layers[2][0]);
      } else {
        break;
      }
    }

    return { realValues, predictedValues };
  };
  multipleStepPrediction = async (startIndex, values, count) => {
    const realValues = [];
    const predictedValues = [];
    const descente = new DescenteDeGradient();
    const utils = new Utils();
    const prototypeCount = this.layers[0].length;
    const h = JSON.parse(JSON.stringify(this.layers));

    let prototypes = utils.generatePrototypes(
      prototypeCount,
      startIndex,
      values
    );
    for (let i = 0, j = startIndex; i < count; i++, j++) {
      if (prototypes) {
        console.log("prototypes",prototypes)
        realValues.push(values[i + startIndex + prototypeCount]);
        this.setInputValue(prototypes);
        const propagationResult = await descente.propagation(
          this.layers,
          h,
          this.weights
        );
        const { layers } = propagationResult;

        predictedValues.push(layers[2][0]);
        const prototypeComplements = prototypes.slice(0, -1);
        prototypes = [layers[2][0], ...prototypeComplements];
      } else {
        break;
      }
    }
    return { realValues, predictedValues };
  };
}
