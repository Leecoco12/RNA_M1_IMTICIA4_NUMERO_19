class TemporalSeries {
  seriesFonction;
  parameters;
  length;
  series;
  constructor(_fonction, _parameters) {
    this.seriesFonction = _fonction;
    this.parameters = _parameters;
  }
  generateSeries(_initialValue, _length) {
    const utils = new Utils()
    this.length = _length;
    let values = [];
    let xn = _initialValue;
    for (let i = 0; i < this.length; i++) {
      const _xn = this.seriesFonction(this.parameters, xn);
      xn = _xn;
      values.push(utils.truncDecimal(_xn));
    }
    
    this.series = values;
    return values;
  }

  getSeries() {
    return this.series;
  }
}
