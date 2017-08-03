import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import classnames from 'classnames';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: this.props.options.length > 0 ? this.props.options[0].value : '',
      searchFormInput: ''
    }
  }

  render() {
    const { options, onSelect, i18n, searchButtonClassName, noTip, style, inputPlaceHolder, selectClass, formClass } = this.props;
    const tipInputInvalidClass = this.state.inputTip ? 'is-invalid' : '';
    const searchFormInputTipClass = this.state.inputTip ? 'is-visible' : '';
    const searchFormClass = classnames(`SearchForm`, formClass);
    return (
      <form className={searchFormClass}>
        <input ref={ref => this.searchFormInput = ref}  className={`SearchForm-input ${tipInputInvalidClass}`} placeholder={inputPlaceHolder}
          onChange={this.handleInputChange.bind(this)} />
        { options.length > 0 ? <Select className={`SearchForm-select ${selectClass}`} name="searchOption" value={this.state.select} options={options} onChange={this.handleSelect.bind(this)} searchable={false} clearable={false} /> : null }
        <button className={`${searchButtonClassName}`} onClick={this.handleSubmit.bind(this)}>
          {i18n[i18n.myLang]['slidepanel.button.search']}
        </button>
        { noTip ?
          null :
          <div className={`SearchForm-input-tip ${searchFormInputTipClass}`}>
            {i18n[i18n.myLang]['slidepanel.input.tip']}
          </div>
        }
      </form>
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const { select } = this.state;
    const input = this.searchFormInput.value;
    this.props.onSubmit(evt, { text:input, select });
    if ( typeof this.props.onhandleSearch === 'function') {
      this.props.onhandleSearch();
    }
  }

  handleSelect(newVal) {
    this.setState({
      select: newVal.value
    });
  }

  handleInputChange(evt) {
    const re = /[\^|\&|\.|\*|\+|\?|\!|\:|\||\\|\/|\(|\)|\[|\]|\{|\}|\#|\!|\$|\~|\@|\%|\_|\=|\||\'|\"|\;|\,|\/|\＋|\！|\＠|\＃|\＄|\％|\＾|\＆|\＊|\（|\）|\＿|\＋|\、|\」|\「|\‘|\，|\．|\／|\；|\’|\｀|\～|\＝|\｜|\』|\『|\“|\：|\？|\。]/;
    let match;
    if ( ( match = re.exec(evt.currentTarget.value)) !== null ) {
      this.searchFormInput.value = evt.currentTarget.value.slice(0, -1);
    }
    this.setState({
      favorEditInput: evt.currentTarget.value,
      inputTip: match !== null
    });
  }
}

SearchForm.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SearchForm;
