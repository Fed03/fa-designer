import React, { Component } from "react";

class SelectInput extends Component {
  constructor(props) {
    super(props);

    const { selectedValue, valueSelector } = props;
    this.state = {
      lastValue: selectedValue
        ? valueSelector(selectedValue)
        : this.initialValue
    };

    this.notifyParentComponent(this.state.las);
  }

  render() {
    const { defaultOption } = this.props;
    return (
      <select value={this.selectedValue} onChange={this.handleChange}>
        {defaultOption && (
          <option key={""} value={""}>
            {defaultOption}
          </option>
        )}
        {this.renderOptions()}
      </select>
    );
  }

  get selectedValue() {
    const { selectedValue, valueSelector } = this.props;
    return selectedValue ? valueSelector(selectedValue) : this.state.lastValue;
  }

  renderOptions() {
    const { data } = this.props;
    return data.map(d => this.renderSingleOption(d));
  }

  renderSingleOption(datum) {
    const { valueSelector, labelSelector } = this.props;
    const label = labelSelector(datum);
    const value = valueSelector(datum);

    return (
      <option key={value} value={value}>
        {label}
      </option>
    );
  }

  handleChange = e => {
    const lastValue = e.target.value;
    this.setState({ lastValue });
    this.notifyParentComponent(lastValue);
  };

  notifyParentComponent(value) {
    const { data, valueSelector, onChange } = this.props;
    const selected = data.find(d => valueSelector(d) === value);
    onChange(selected || null);
  }

  get initialValue() {
    const { defaultOption, data, valueSelector } = this.props;
    return defaultOption ? "" : valueSelector(data[0]);
  }
}

export { SelectInput };
