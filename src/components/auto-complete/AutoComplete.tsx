/* eslint-disable no-console */
import React from 'react';
import Select, { Option } from 'rc-select';
import { OptionProps } from 'rc-select/lib/Option'
import './index.less';

type Option = OptionProps[]

class Combobox extends React.Component {
  state = {
    disabled: false,
    value: '',
    options: [],
  };

  textareaRef = React.createRef<HTMLTextAreaElement>();

  timeoutId!: number;

  componentDidMount() {
    console.log('Ref:', this.textareaRef);
  }

  onChange = (value: string, option: any) => {
    console.log('onChange', value, option);
    this.setState({
      value,
    });
  };

  onKeyDown = (e: any) => {
    const { value } = this.state;
    if (e.keyCode === 13) {
      console.log('onEnter', value);
    }
  };

  onSelect = (v: string, option: any) => {
    console.log('onSelect', v, option);
  };

  onSearch = (text: string) => {
    console.log('onSearch:', text);
  };

  onAsyncChange = (value: string) => {
    window.clearTimeout(this.timeoutId);

    this.setState({
      options: [],
    });

    this.timeoutId = window.setTimeout(() => {
      this.setState({
        options: [{ value }, { value: `${value}-${value}` }],
      });
    }, 1000);
  };

  toggleDisabled = () => {
    const { disabled } = this.state;
    this.setState({
      disabled: !disabled,
    });
  };

  render() {
    const { value, disabled } = this.state;
    return (
      <div>
        <h2>combobox</h2>
        <p>
          <button type="button" onClick={this.toggleDisabled}>
            toggle disabled
          </button>
          <button
            type="button"
            onClick={() => {
              this.setState({ value: '' });
            }}
          >
            reset
          </button>
        </p>
        <div>
          <Select
            disabled={disabled}
            style={{ width: 500 }}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onSearch={this.onSearch}
            onInputKeyDown={this.onKeyDown}
            notFoundContent=""
            allowClear
            placeholder="please select"
            value={value}
            mode="combobox"
            backfill
            onFocus={() => console.log('focus')}
            onBlur={() => console.log('blur')}
          >
            <Option value="jack">
              <b style={{ color: 'red' }}>jack</b>
            </Option>
            <Option value="lucy">lucy</Option>
            <Option value="disabled" disabled>
              disabled
            </Option>
            <Option value="yiminghe">yiminghe</Option>
            <Option value="竹林星光">竹林星光</Option>
          </Select>

          <h3>Customize Input Element</h3>
          <Select
            mode="combobox"
            style={{ width: 200 }}
            getInputElement={() => (
              <textarea
                style={{ background: 'red' }}
                rows={3}
                ref={this.textareaRef}
              />
            )}
            options={[{ value: 'light' }, { value: 'bamboo' }]}
            allowClear
            placeholder="2333"
          />

          <h3>Async Input Element</h3>
          <Select
            mode="combobox"
            notFoundContent={null}
            style={{ width: 200 }}
            options={this.state.options}
            onChange={this.onAsyncChange}
          />
        </div>
      </div>
    );
  }
}

export default Combobox;