const setupChart = (realValues, predictedValues) => {
  const ctx = document.getElementById("myChart");

  const labels = realValues.map((value, i) => `${i}`);

  const data = {
    labels,
    datasets: [
      {
        label: "VALEURS ACTUELLES",
        data: realValues,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        textColor:"rgb(255,255,255)"
      },
      {
        label: "VALEURS PREDITES",
        data: predictedValues,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgb(54, 162, 235)",
      },
    ],
  };
  const chart = new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Prediction",
        },
      },
    },
  });
  return chart;
};
