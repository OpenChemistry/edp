import React, { Component } from 'react';
import { reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { debounce, isEqual, has, isNil } from 'lodash-es';

import { getCompositeMatches, searchComposite, getCompositePending } from '../../redux/ducks/search';
import { fetchItem, getItem } from '../../redux/ducks/items';
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

    if (!isNil(this.props.dataset)) {
      this.compositeSearch();
    }
    // We need to load the parent to get the dataset
    else {
      let {dispatch, ancestors} = this.props;
      if (ancestors.length > 0) {
        const item = ancestors[ancestors.length - 1];
        ancestors = ancestors.slice(0, ancestors.length - 1)
        dispatch(fetchItem({ancestors, item}));
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { fields, dataset } = this.props;
    const prevFields = prevProps.fields;
    if (!isEqual(fields, prevFields) || prevProps.dataset != dataset) {
      this.compositeSearch();
    }
  }

  compositeSearch() {
    const { ancestors, item, dataset, dispatch } = this.props;
    // Augment the fields with the dataset
    let { fields }  = this.props;
    fields = {...fields, dataset};
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
    const { ancestors, item, dispatch, dataset, currentValues } = this.props;

    const platemapId = match.platemap._id;
    const runId = match.run._id;
    const searchParams = new URLSearchParams();
    if (!isNil(dataset)) {
      searchParams.append('dataset', dataset);
    }
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

  // Extract the dateset property from the parent project, if its available
  let dataset = null;
  const { ancestors } = ownProps;
  if (ancestors.length > 0) {
     const parent = ancestors[ancestors.length - 1]
     if (has(parent, '_id')) {
      const parentId = parent['_id'];
      const item = getItem(state, parentId);
      dataset = item ? item.dataset : null;
     }
  }

  const props = {
    matches: getCompositeMatches(state),
    pending: getCompositePending(state),
    fields,
    initialValues: fields,
    currentValues: getFormValues('compositeSearch')(state)
  }

  if (!isNil(dataset)) {
    props.dataset = dataset;
  }

  return props;
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
