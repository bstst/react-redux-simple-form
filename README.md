# [![Build Status](https://travis-ci.org/bstst/react-redux-simple-form.svg?branch=master)](https://travis-ci.org/bstst/react-redux-simple-form) react-redux-simple-form
 
A simple React / React-Native form library using redux and redux-thunk. 
 
## Why?

Most react redux form libraries out there are too over-engineered and over-opinionated for my liking.

That's why I created this — "react-redux-simple-form" is a library for creating abstract redux forms both on React and React-Native.

Any component that has **form** and **name** properties and wrapped with the provided higher order component receives additional properties that are used to control the state of the form. Simple as that. 

## How?

Create your store:

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { form } from 'react-redux-simple-form/reducers';

const store = createStore(combineReducers({ form }), applyMiddleware(thunk));
```

Create a basic input:

```javascript
import React, { Component } from 'react';
import { connectForm } from 'react-redux-simple-form';

class Input extends Component {
  render () {
    return (
      <div>
        <input
          onChange={(e) => this.props.change(e.target.value)}
          onBlur={() => this.props.touch()}
        />
        {this.props.field.error !== '' && <div>{this.props.field.error}</div>}
      </div>
    );
  }
}

const ConnectedInput = connectForm(Input);

export default ConnectedInput;
```
    
And use it:

```javascript
<ConnectedInput
  form="myform"
  name="myinput"
/>
```
