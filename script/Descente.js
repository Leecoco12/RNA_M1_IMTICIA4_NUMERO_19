class DescenteDeGradient {
  utils;

  constructor() {
    this.utils = new Utils();
  }

  train =async (
    hiddenUnitNumber,
    unitEntryNumber,
    outputUnitNumber,
    values,
    learningRate,
    isLimiting
  ) => {
    let trained = false;
    const seriesLength = values.length;
    const [a, b, ...realValues] = [...values];
    const nmses = [];
    let limit = 0;

    const neuralNetwork = new NeuralNetwork(
      [0, 0],
      hiddenUnitNumber,
      outputUnitNumber
    );

    let trainedNeural = [];

    do {
      const predictedValues = [];

      for (let i = 0; i < seriesLength; i++) {
        let prototypes = this.utils.generatePrototypes(
          unitEntryNumber,
          i,
          values
        );
        if (prototypes) {
          neuralNetwork.setInputValue(prototypes);
          const trainResult = await this.descente(
            neuralNetwork,
            [values[i + unitEntryNumber]],
            learningRate
          );
          predictedValues.push(trainResult.layers[2][0]);
          // console.log("predictedValues",predictedValues)
          neuralNetwork.setWeights(
            trainResult.weights.firstWeights,
            trainResult.weights.secondWeights
          );
        } else {
          break;
        }
      }

      const mse = this.utils.mse(realValues, predictedValues);
      const variance = this.utils.variance(values);
      const nmse = this.utils.nmse(mse, variance);

      if (nmse > nmses[nmses.length - 1] || (isLimiting && limit > 5)) {
        break;
        trained = true;
      }

      nmses.push(nmse);
      trainedNeural.push(neuralNetwork)
      limit++;
    } while (!trained);
    return {nmse:nmses[nmses.length - 1], trainedNeural};
  };

   descente =async (neuralNetwork, expectedValue, learningRate) => {
    let { layers, weights } = JSON.parse(
      JSON.stringify(neuralNetwork.getNeuralNetwork())
    );

    const inputUnit = layers[0];
    const hiddenUnit = layers[1];
    const outputUnit = layers[2];

    let h = [
      [...inputUnit], // indexed by i
      [...hiddenUnit], // indexed by j
      [...outputUnit], // indexed by k
    ];

    const propagationResult = await this.propagation(layers, h, weights);

    h = propagationResult.h;
    layers = propagationResult.layers;

    const backpropagationResult = await this.backpropagation(
      layers,
      h,
      weights,
      expectedValue,
      learningRate
    );
    return { layers, weights: backpropagationResult.weights };
  };

  propagation = async (_layers, _h, _weights) => {
    let layers = JSON.parse(JSON.stringify(_layers));
    let { firstWeights, secondWeights } = JSON.parse(JSON.stringify(_weights));
    let h = JSON.parse(JSON.stringify(_h));

    const inputUnit = layers[0];
    const hiddenUnit = layers[1];
    const outputUnit = layers[2];

    const hiddenUnitNumber = hiddenUnit.length;
    const outputUnitNumber = outputUnit.length;

    // STEP3 => PROPAGATE SIGNALS
    for (let j = 0; j < hiddenUnitNumber; j++) {
      let sum = 0;
      for (let i = 0; i < inputUnit.length; i++) {
        sum += this.utils.truncDecimal(layers[0][i] * firstWeights[i][j]);
      }
      h[1][j] = this.utils.truncDecimal(sum);
      layers[1][j] = this.gBetweenInputAndHidden(this.utils.truncDecimal(sum));
    }
    for (let k = 0; k < outputUnitNumber; k++) {
      let sum = 0;
      for (let j = 0; j < hiddenUnitNumber; j++) {
        sum += this.utils.truncDecimal(layers[1][j] * secondWeights[j][k]);
      }
      h[2][k] = this.utils.truncDecimal(sum);
      layers[2][k] = this.gBetweenHiddenAndOutput(this.utils.truncDecimal(sum));
    }
    return { h, layers };
  };

  backpropagation = async (_layers, _h, _weights, _expectedValue, _learningRate) => {
    let layers = JSON.parse(JSON.stringify(_layers));
    let { firstWeights, secondWeights } = JSON.parse(JSON.stringify(_weights));
    let h = JSON.parse(JSON.stringify(_h));

    let deltas = JSON.parse(JSON.stringify(layers));

    const inputUnit = layers[0];
    const hiddenUnit = layers[1];
    const outputUnit = layers[2];

    const hiddenUnitNumber = hiddenUnit.length;
    const outputUnitNumber = outputUnit.length;
    // STEP4 => CALCULATE DELTAS FOR OUTPUT
    for (let k = 0; k < outputUnitNumber; k++) {
      deltas[2][k] = this.utils.truncDecimal(
        this.gPrimBetweenHiddenAndOutput(h[2][k]) *
          this.utils.truncDecimal(_expectedValue[k] - layers[2][k])
      );
    }

    // STEP5 => CALCULATE DELTAS FOR HIDDEN LAYER
    for (let j = 0; j < hiddenUnitNumber; j++) {
      let sum = 0;
      for (let k = 0; k < outputUnitNumber; k++) {
        sum += this.utils.truncDecimal(deltas[2][k] * secondWeights[j][k]);
      }
      deltas[1][j] = this.utils.truncDecimal(
        this.gPrimBetweenHiddenAndOutput(h[1][j]) * sum
      );
    }

    // STEP6 => UPDATE WEIGHTS
    for (let i = 0; i < inputUnit.length; i++) {
      for (let j = 0; j < hiddenUnitNumber; j++) {
        firstWeights[i][j] = this.utils.truncDecimal(
          firstWeights[i][j] +
            this.utils.truncDecimal(_learningRate * deltas[1][j] * layers[1][j])
        );
      }
    }
    for (let j = 0; j < hiddenUnitNumber; j++) {
      for (let k = 0; k < outputUnitNumber; k++) {
        secondWeights[j][k] = this.utils.truncDecimal(
          secondWeights[j][k] +
            this.utils.truncDecimal(_learningRate * deltas[2][k] * layers[2][k])
        );
      }
    }
    return { weights: { firstWeights, secondWeights } };
  };
  gBetweenInputAndHidden = (n) => {
    return 1 / (1 + Math.exp(-n));
  };
  gBetweenHiddenAndOutput = (n) => {
    return n;
  };
  gPrimBetweenInputAndHidden = (n) => {
    return Math.exp(-n) / Math.pow(1 + Math.exp(-n), 2);
  };
  gPrimBetweenHiddenAndOutput = (n) => {
    return 1;
  };
}
