import React, { Component } from 'react';
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { createFieldsFactory } from '../../utils/fields';
import { makeUrl } from '../../utils/nodes';
import { COMPOSITE_SEARCH } from '../../utils/search';
import SearchForm from '../../components/search/form';

class CompositeSearch extends Component {
  onSearch = (values) => {
    const { dispatch, ancestors, item } = this.props;
    const baseUrl = `${makeUrl(ancestors, item)}`;
    const searchParams = new URLSearchParams();
    for (let key in values) {
      let val = values[key].trim();
      if (val.length > 0) {
        searchParams.append(key, values[key]);
      }
    }
    dispatch(push(`${baseUrl}?${searchParams.toString()}`));
  }

  render() {
    return (
      <div>
        <SearchForm
          {...this.props}
          fieldsCreator={createFieldsFactory(COMPOSITE_SEARCH)}
          onSubmit={this.onSearch}
        />
        {/* <SearchResults  matches={matches} onOpen={this.onOpen}/> */}
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
    // matches: getMatches(state),
    fields,
    initialValues: fields,
    currentValues: getFormValues('compositeSearch')(state)
  }
}

CompositeSearch = reduxForm({
  form: 'compositeSearch',
  enableReinitialize: true
})(CompositeSearch);

CompositeSearch = connect(mapStateToProps)(CompositeSearch);

export default CompositeSearch;
