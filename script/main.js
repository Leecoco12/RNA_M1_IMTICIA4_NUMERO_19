let predictionChart = undefined;
let nmseChart = undefined;
let trained = undefined;
let serieValues = undefined;
const runButton = document.getElementById("run_button");
const calculate = () => {
  const inputs = document.getElementsByTagName("input");
  const seriesLength = inputs[0].value;
  const noLinearityParam = inputs[1].value;
  const firstSeriesValue = inputs[2].value;
  const learningRate = inputs[3].value;
  if (seriesLength && noLinearityParam && firstSeriesValue && learningRate) {

    run(+seriesLength, +noLinearityParam, +firstSeriesValue, +learningRate);
  }
};

const predict = async () => {
  const inputs = document.getElementsByTagName("input");
  const startIndex = inputs[4].value;
  const step = inputs[5].value;
  const count = inputs[6].value;
  if (startIndex && step && count) {
    if (trained) {
      const { realValues, predictedValues } =await trained.predict(
        +startIndex,
        +step,
        serieValues,
        +count
      );
      if (!predictionChart) {
        predictionChart = setupChart(realValues, predictedValues);
      } else {
        predictionChart.destroy();
        predictionChart = setupChart(realValues, predictedValues);
      }
    } else {
      console.log("L'entrainement n'est pas fini");
    }
  } else {
    console.error("Les valeurs de predictions sont requises");
  }
};

const run = async(
  seriesLength,
  noLinearityParam,
  firstSeriesValue,
  learningRate
) => {
  let loading = true;
  console.log("Loading...");
  runButton.innerHTML = "Loading...";
  const startTime = performance.now();
  const seriesFonction = (a, xn) => {
    return a * xn * (1 - xn);
  };
  const temporalSeries = new TemporalSeries(seriesFonction, noLinearityParam);
  serieValues = temporalSeries.generateSeries(firstSeriesValue, seriesLength);
  
  const takens = new Takens();
  const jacobi = new MethodeDeJacobi();
  const maxIterations = 100;
  const tolerance = 1e-6;

  const covariance = await takens.matrixMultiplication1D(serieValues, serieValues);  

  const { eigenvalues } = await jacobi.calculateEigenValuesAndEigenVectors(
    covariance,
    maxIterations,
    tolerance
  );


  const erreurApprox = takens.calculateErreurApprox(eigenvalues);
  const unitEntryNumber = takens.findPlateau(erreurApprox);
  console.log("unitEntryNumber",unitEntryNumber)

  const hiddenUnitNumberValues = [1];
  const NMSEForAllUnitNumber = [];

  for (let i = 0; i < hiddenUnitNumberValues.length; i++) {
    const descente = new DescenteDeGradient();
    const { nmse } =await descente.train(
      hiddenUnitNumberValues[i],
      2,
      1,
      serieValues,
      learningRate,
      true
    );
    NMSEForAllUnitNumber.push(nmse);
  }

  const hiddenUnitNumber =
    hiddenUnitNumberValues[
      NMSEForAllUnitNumber.indexOf(Math.min(...NMSEForAllUnitNumber))
    ];
  console.log("hiddenUnitNumber", hiddenUnitNumber);

  const newDescente = new DescenteDeGradient();

  const { trainedNeural } = await newDescente.train(
    hiddenUnitNumber,
    2,
    1,
    serieValues,
    learningRate,
    true
  );
  console.log("trained", trainedNeural);
  trained = trainedNeural[trainedNeural.length - 1];

  const endTime = performance.now();
  console.log("done✅✅");
  console.log(`Execution took ${endTime - startTime} milliseconds`);
};

