import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import {
  init,
  change,
  touch,
  destroy,
} from '../actions';

const hoc = (Comp) => {
  class Wrapper extends Component {
    componentDidMount () {
      this.props.init();
    }

    componentWillUnmount () {
      this.props.destroy();
    }

    render () {
      return createElement(Comp, this.props, this.props.children);
    }
  }

  const mapStateToProps = (state, props) => {
    const forms = state.form || {};
    const form = forms[props.form] || {};
    const field = form[props.name] || {};
    return {
      field,
    };
  };

  const mapDispatchToProps = (dispatch, props) => {
    return {
      init: () => dispatch(init(props)),
      destroy: () => dispatch(destroy(props.form, props.name)),
      touch: () => dispatch(touch(props.form, props.name)),
      change: (value, touched = false) => {
        dispatch(change(props.form, props.name, value, touched));
        if (typeof props.onChange === 'function') {
          props.onChange(value);
        }
      },
    };
  };

  return connect(mapStateToProps, mapDispatchToProps)(Wrapper);
};

export default hoc;
