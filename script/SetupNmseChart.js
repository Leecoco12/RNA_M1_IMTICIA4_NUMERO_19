const setupNMSEChart = (mseValues,nmseValues) => {
  const ctx = document.getElementById("mseChart");

  const labels = values.map((mseValues, i) => `${i}`);

  const data = {
    labels,
    datasets: [
      {
        label: "NMSE",
        data: mseValues,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };
  const mseChart = new Chart(ctx, {
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
          text: "NMSE",
        },
      },
    },
  });
  const nmsectx = document.getElementById("nmseChart");

  const nmselabels = values.map((nmseValues, i) => `${i}`);

  const nmsedata = {
    labels:nmselabels,
    datasets: [
      {
        label: "NMSE",
        data: nmseValues,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };
  const nmseChart = new Chart(nmsectx, {
    type: "line",
    data: nmsedata,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "NMSE",
        },
      },
    },
  });
  return {mseChart,nmseChart};
};
