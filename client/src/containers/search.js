import React, { Component } from 'react';
import { reduxForm, getFormValues } from 'redux-form';

import { connect } from 'react-redux';

import { push } from 'connected-react-router';
import { has, isEmpty } from 'lodash-es';

import { getMatches, seatchGlobal } from '../redux/ducks/search';

import { GLOBAL_SEARCH } from '../utils/search';
import { createFieldsFactory } from '../utils/fields';
import SearchForm from '../components/search/form';
import SearchResults from '../components/search/results';
import { ROOT_ROUTE } from '../routes';

class SearchContainer extends Component {

  componentDidMount() {
    const { fields } = this.props;
    if (!isEmpty(fields)) {
      this.globalSearch();
    }
  }

  componentDidUpdate(prevProps) {
    const { fields } = this.props;
    const prevFields = prevProps.fields;
    if (JSON.stringify(fields) !== JSON.stringify(prevFields)) {
      this.globalSearch();
    }
  }

  globalSearch() {
    const { fields, dispatch } = this.props;
    dispatch(seatchGlobal({fields}));
  }

  onOpen = (item) => {
    const { dispatch } = this.props;
    if (has(item, 'path')) {
      dispatch(push(item.path));
    }
  }

  onSearch = (values) => {
    const { dispatch } = this.props;
    const searchParams = new URLSearchParams();
    for (let key in values) {
      let val = values[key].trim();
      if (val.length > 0) {
        searchParams.append(key, values[key]);
      }
    }
    dispatch(push(`${ROOT_ROUTE}search?${searchParams.toString()}`));
  }

  render() {
    const {matches} = this.props;
    return (
      <div>
        <SearchForm
        {...this.props}
        fieldsCreator={createFieldsFactory(GLOBAL_SEARCH)}
        onSubmit={this.onSearch}
      />
        <SearchResults  matches={matches} onOpen={this.onOpen}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const searchParams = new URLSearchParams(ownProps.location.search);
  let fields = {};
  for (let pair of searchParams.entries()) {
    const [key, value] = pair;
    fields[key] = value;
  }
  return {
    matches: getMatches(state),
    fields,
    initialValues: fields,
    currentValues: getFormValues('globalSearch')(state)
  }
}

SearchContainer = reduxForm({
  form: 'globalSearch',
  enableReinitialize: true
})(SearchContainer);

SearchContainer = connect(mapStateToProps)(SearchContainer);

export default SearchContainer;
