import React, { Component } from 'react';
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { debounce, has, keys, isEqual } from 'lodash-es';

import { getCompositeMatches, searchComposite, getCompositePending } from '../../redux/ducks/search';
import { fetchDatabases, getDatabases } from '../../redux/ducks/databases';
import { createFieldsFactory, makeUrl } from '../../nodes';
import { COMPOSITE_SEARCH } from '../../nodes/sow8/search';
import SearchForm from '../../components/search/form';
import SearchResults from '../../components/composite-search/results';
import SearchPending from '../../components/search/pending';

class CompositeSearch extends Component {
  constructor(props) {
    super(props);
    this.onSearch = debounce(this.onSearch, 500);
  }

  componentDidMount() {
    this.props.dispatch(fetchDatabases());
  }

  componentDidUpdate(prevProps) {
    const { fields, databases } = this.props;
    const prevFields = prevProps.fields;
    const prevDatabases = prevProps.databases;
    if (!isEqual(fields, prevFields) ||
        !isEqual(databases, prevDatabases)) {
      this.compositeSearch();
    }
  }

  compositeSearch() {
    const { ancestors, item, fields, dispatch } = this.props;
    dispatch(searchComposite({ancestors, item, fields}));
  }

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

  onOpen = (match, mode) => {
    const { ancestors, item, dispatch, currentValues } = this.props;
    const { dataset } = currentValues;
    const platemapId = match.platemap._id;
    const runId = match.run._id;
    const searchParams = new URLSearchParams();
    searchParams.append('dataset', dataset);
    searchParams.append('platemapId', platemapId);
    searchParams.append('runId', runId);
    // dispatch(fetchSamples({ancestors, item, platemapId, runId}));
    let destination = 'samples';
    if (mode === 'active-learning') {
      destination = 'learning';
    }
    const baseUrl = `${makeUrl(ancestors, item)}`;
    dispatch(push(`${baseUrl}/${destination}?${searchParams.toString()}`));

  }

  render() {
    const {matches, pending} = this.props;
    return (
      <div>
        <SearchForm
          {...this.props}
          fieldsCreator={createFieldsFactory(COMPOSITE_SEARCH)}
          onSubmit={this.onSearch}
          liveSearch
        />
        {!pending &&
        <SearchResults  matches={matches} onOpen={this.onOpen}/>
        }
        {pending &&
        <SearchPending/>
        }
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
  const databases = getDatabases(state);
  if (!has(fields, 'dataset')) {
    // Just pick the first
    fields['dataset'] = keys(databases).sort()[0];
  }

  return {
    matches: getCompositeMatches(state),
    pending: getCompositePending(state),
    fields,
    initialValues: fields,
    currentValues: getFormValues('compositeSearch')(state),
    databases: databases
  }
}

CompositeSearch = reduxForm({
  form: 'compositeSearch',
  enableReinitialize: true,
  onChange: (values, dispatch, props, previousValues) => {
    props.submit();
  }
})(CompositeSearch);

CompositeSearch = connect(mapStateToProps)(CompositeSearch);

export default CompositeSearch;
